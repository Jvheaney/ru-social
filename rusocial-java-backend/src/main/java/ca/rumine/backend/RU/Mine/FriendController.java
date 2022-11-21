package ca.rumine.backend.RU.Mine;

import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;

import ca.rumine.backend.RU.Mine.model.FriendProfile;
import ca.rumine.backend.RU.Mine.model.FriendsArtist;
import ca.rumine.backend.RU.Mine.model.FriendsCourse;
import ca.rumine.backend.RU.Mine.model.FriendsInterests;
import ca.rumine.backend.RU.Mine.model.FriendsProfileResult;
import ca.rumine.backend.RU.Mine.model.FriendsProgram;
import ca.rumine.backend.RU.Mine.model.FriendsTopic;
import ca.rumine.backend.RU.Mine.model.GroupMembership;
import ca.rumine.backend.RU.Mine.model.GroupResult;
import ca.rumine.backend.RU.Mine.model.UserProfile;
import ca.rumine.backend.RU.Mine.repository.FriendProfileRepository;
import ca.rumine.backend.RU.Mine.repository.FriendsArtistRepository;
import ca.rumine.backend.RU.Mine.repository.FriendsCourseRepository;
import ca.rumine.backend.RU.Mine.repository.FriendsInterestsRepository;
import ca.rumine.backend.RU.Mine.repository.FriendsProgramRepository;
import ca.rumine.backend.RU.Mine.repository.FriendsTopicRepository;
import ca.rumine.backend.RU.Mine.repository.GroupMembershipRepository;
import ca.rumine.backend.RU.Mine.repository.GroupRepository;
import ca.rumine.backend.RU.Mine.repository.ProfileRepository;
import ca.rumine.backend.RU.Mine.repository.RecentConnectionsRepository;
import ca.rumine.backend.RU.Mine.repository.SettingsRepository;

import org.tartarus.snowball.ext.englishStemmer;

@Controller
@RestController
public class FriendController {
	
	@Autowired
	private GroupRepository groupRepository;
	
	@Autowired
	private GroupMembershipRepository gmr;
	
	@Autowired
	private FriendProfileRepository fpr;
	
	@Autowired
	private FriendsProgramRepository fprogramr;
	
	@Autowired
	private FriendsInterestsRepository finterestsr;
	
	@Autowired
	private FriendsArtistRepository fartistr;
	
	@Autowired
	private FriendsTopicRepository ftopicr;
	
	@Autowired
	private FriendsCourseRepository fcoursesr;
	
	@Autowired
	private ProfileRepository profileRepository;
	
	@Autowired
	private SettingsRepository settingsRepository;
	
	@Autowired
	private TokenManager tokenManager;
	
	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
	
	@RequestMapping(value = "/gw/fp/m", method = RequestMethod.POST)
    public ResponseEntity < String > migrateToFriendProfile(@RequestParam String token, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Migrate Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		FriendProfile profile = new FriendProfile();
    		
    		profile.setUserid(checkTokenResp[1]);
    		
    		//Getting data from postgres, sending to neo4j
    		UserProfile datingProfileData = profileRepository.getUserProfile(checkTokenResp[1]);
    		String firstname_display = datingProfileData.getFirstname_display();
    		String birthdate = datingProfileData.getBirthdate();
    		String pronouns = datingProfileData.getPronouns();
    		String year = datingProfileData.getYear();
    		String program = datingProfileData.getProgram();
    		String top_5_spotify = datingProfileData.getTop_5_spotify();
    		String badges = datingProfileData.getBadges();
    		String interests = datingProfileData.getInterests();
    		String bio = datingProfileData.getBio();
    		String image0 = datingProfileData.getImage0();
    		
    		String lastname = "";
    		
    		if(datingProfileData.getLastname() != null) {
    			lastname = datingProfileData.getLastname();
    		}
    		System.out.println("Fetched data from postgres: " + firstname_display);
    		
    		//Setting Neo4J model to have this data
    		profile.setFirstname_display(firstname_display);
    		profile.setLastname(lastname);
    		profile.setPronouns(pronouns);
    		profile.setBirthdate(birthdate);
    		profile.setYear(year);
    		profile.setProgram(program);
    		profile.setTop_5_spotify(top_5_spotify);
    		profile.setBadges(badges);
    		profile.setInterests(interests);
    		profile.setBio(bio);
    		profile.setImage0(image0);
    		profile.setLast_seen(new Date().getTime());
    		profile.setCreatedAt(new Date().getTime());
    		profile.setDeleted(false);
    		profile.setShow_me(true);
    		profile.setAlgo_pref(0);
    		
    		//Create neo4j profile
    		fpr.save(profile);
    		
    		//Save in PGSQL
    		profileRepository.insertIntoFriendsProfile(checkTokenResp[1], datingProfileData.getFirstname_display(), lastname, datingProfileData.getImage0());
    		
    		//Connect profile to year of study
    		fpr.connectUserToYear(checkTokenResp[1], year);
    		
    		//Connect User to Program
    		fprogramr.connectUserToProgram(checkTokenResp[1], program);
    		
    		//Creating Interest Nodes [OPTIONAL]
    		if(interests != null && !interests.equals("")){
    			
    			String[] interests_arr = interests.replace("[", "").replace("]", "").replace("\"", "").split(",");
    			
    			System.out.println(interests_arr.length);
    			
    			FriendsInterests fi;
        		
        		String interest_stemmed = "";
        			
        		for(int i = 0; i<interests_arr.length; i++) {
        			
        			interest_stemmed = interests_arr[i];
        			
        			try {
            			englishStemmer stemmer = new englishStemmer();
            			stemmer.setCurrent(interest_stemmed);
            			if (stemmer.stem()){
            				interest_stemmed = stemmer.getCurrent();
            			    System.out.println(interest_stemmed);
            			}
        			}
        			catch(Exception e) {
        				e.printStackTrace();
        	       		lgr.log(Level.INFO, "[Migrate to Friends] Stemming failed: " + checkTokenResp[1]);
        			}
        			
        			try {
        				fi = new FriendsInterests();
        				fi.setInterest_name(interest_stemmed);
        				finterestsr.save(fi);
        			}
        			catch(Exception e) {
        				System.out.println("Interest already exists");
        			}
        			System.out.println("Attempting to connect: " + interest_stemmed);
        			
            		//Connect User to Interests
        			finterestsr.connectUserToInterest(checkTokenResp[1], interest_stemmed);
        		}
    			    			
    		}
    		
    		//Creating Artist Nodes [OPTIONAL]
    		if(top_5_spotify != null && !top_5_spotify.equals("")){
    			
    			String[] top_5_spotify_arr = top_5_spotify.replace("[", "").replace("]", "").replace("\"", "").split(",");
    			
    			System.out.println(top_5_spotify_arr.length);
    			
    			FriendsArtist fa;
    			
    			for(int i = 0; i<top_5_spotify_arr.length; i++) {
    				
    				try {
    					fa = new FriendsArtist();
    					fa.setArtist_id(top_5_spotify_arr[i]);
    					fartistr.save(fa);
    				}
    				catch(Exception e) {
    					System.out.println("Artist already exists");
    				}
    				System.out.println("Attempting to connect: " + top_5_spotify_arr[i]);
    				
    				//Connect User to Artists
    				fartistr.connectUserToArtist(checkTokenResp[1], top_5_spotify_arr[i]);
    			}
    			    			
    		}
    		
    		//Creating Topic Nodes [OPTIONAL]
    		if(badges != null && !badges.equals("")){
    			
    			String[] badges_arr = badges.replace("[", "").replace("]", "").replace("\"", "").split(",");
    			
    			System.out.println(badges_arr.length);

    			for(int i = 0; i<badges_arr.length; i++) {
    				
    				System.out.println("Attempting to connect: " + badges_arr[i]);
    				
    				//Connect User to Topics
    				ftopicr.connectUserToTopic(checkTokenResp[1], badges_arr[i]);
    			}
    			    			
    		}
    		
    		
    		
       		lgr.log(Level.INFO, "[Migrate Friend Profile] Migrated user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"userid\":\"" + checkTokenResp[1] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Migrate Friend Profile] Error migrating user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/c", method = RequestMethod.POST)
    public ResponseEntity < String > createFriendProfile(@RequestParam String token, @ModelAttribute FriendProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Create Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		if(profile.getFirstname_display() == null || profile.getFirstname_display().equals("") || profile.getProgram() == null || profile.getProgram().equals("") || profile.getPronouns() == null || profile.getPronouns().equals("") || profile.getYear() == null || profile.getYear().equals("") || profile.getImage0() == null || profile.getImage0().equals("")) {
    			lgr.log(Level.WARNING, "[Create Friend Profile] Incorrect details for user: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		    
    		profile.setUserid(checkTokenResp[1]);
    		
    		String lastname = "";
    		if(profile.getLastname() != null && !profile.getLastname().equals("")) {
    			lastname = profile.getLastname();
    		}
    		
    		
    		//Setting Neo4J model to have this data
    		profile.setCreatedAt(new Date().getTime());
    		profile.setLast_seen(new Date().getTime());
    		profile.setDeleted(false);
    		profile.setShow_me(true);
    		profile.setAlgo_pref(0);
    		
    		//Create neo4j profile
    		fpr.save(profile);
    		
    		//Save in PGSQL
    		profileRepository.insertIntoFriendsProfile(checkTokenResp[1], profile.getFirstname_display(), lastname, profile.getImage0());
    		
    		settingsRepository.setProfileMade(checkTokenResp[1]);
    		
    		
    		//Connect profile to year of study
    		fpr.connectUserToYear(checkTokenResp[1], profile.getYear());
    		
    		//Connect User to Program
    		fprogramr.connectUserToProgram(checkTokenResp[1], profile.getProgram());
    		
    		
       		lgr.log(Level.INFO, "[Create Friend Profile] Created user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\",\"userid\":\"" + checkTokenResp[1] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Create Friend Profile] Error creating user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/eb", method = RequestMethod.POST)
    public ResponseEntity < String > editBio(@RequestParam String token, @ModelAttribute FriendProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit Bio Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		if(profile.getBio() == null || profile.getBio().equals("")) {
    			lgr.log(Level.WARNING, "[Edit Bio Friend Profile] Incorrect details for user: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		    		
    		fpr.editBio(checkTokenResp[1], profile.getBio());
    		
       		lgr.log(Level.INFO, "[Edit Bio Friend Profile] Edited for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Edit Bio Friend Profile] Error editing for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/ef", method = RequestMethod.POST)
    public ResponseEntity < String > editFirstname_display(@RequestParam String token, @ModelAttribute FriendProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit firstname_display Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		if(profile.getFirstname_display() == null || profile.getFirstname_display().equals("")) {
    			lgr.log(Level.WARNING, "[Edit firstname_display Friend Profile] Incorrect details for user: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		    		
    		fpr.editFirstname_display(checkTokenResp[1], profile.getFirstname_display());
    		
    		//Save in PGSQL
    		profileRepository.updateFriendsFirstname_display(checkTokenResp[1], profile.getFirstname_display());
    		
       		lgr.log(Level.INFO, "[Edit firstname_display Friend Profile] Edit for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Edit firstname_display Friend Profile] Error editing for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/eflna", method = RequestMethod.POST)
    public ResponseEntity < String > editNamesAge(@RequestParam String token, @ModelAttribute FriendProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit names and age Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		if(profile.getBirthdate() == null || profile.getBirthdate().equals("") || profile.getFirstname_display() == null || profile.getFirstname_display().equals("") || profile.getLastname() == null || profile.getLastname().equals("")) {
    			lgr.log(Level.WARNING, "[Edit names and age Friend Profile] Incorrect details for user: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		    		
    		fpr.editNamesAge(checkTokenResp[1], profile.getFirstname_display(), profile.getLastname(), profile.getBirthdate());
    		
    		//Friends_profile
    		profileRepository.updateNames(checkTokenResp[1], profile.getFirstname_display(), profile.getLastname());
    		
    		//Save in PGSQL to sync dating
    		profileRepository.updateLastnameAge(checkTokenResp[1], profile.getLastname(), profile.getBirthdate());
    		
       		lgr.log(Level.INFO, "[Edit names and age Friend Profile] Edit for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Edit names and age Friend Profile] Error editing for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/ebd", method = RequestMethod.POST)
    public ResponseEntity < String > editBirthdate(@RequestParam String token, @ModelAttribute FriendProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit names Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		if(profile.getBirthdate() == null || profile.getBirthdate().equals("")) {
    			lgr.log(Level.WARNING, "[Edit birthdate Friend Profile] Incorrect details for user: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		    		
    		fpr.editBirthdate(checkTokenResp[1], profile.getBirthdate());

    		//Save in PGSQL to sync dating
    		profileRepository.updateBirthdate(checkTokenResp[1], profile.getBirthdate());
    		
       		lgr.log(Level.INFO, "[Edit birthdate Friend Profile] Edit for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Edit birthdate Friend Profile] Error editing for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/epy", method = RequestMethod.POST)
    public ResponseEntity < String > editPronounsYear(@RequestParam String token, @ModelAttribute FriendProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit Pronouns/Year Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		if(profile.getPronouns() == null || profile.getPronouns().equals("") || profile.getYear() == null || profile.getYear().equals("")) {
    			lgr.log(Level.WARNING, "[Edit Pronouns/Year Friend Profile] Incorrect details for user: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		
    		fpr.editPronounsYear(checkTokenResp[1], profile.getPronouns(), profile.getYear());
    		
    		//ALSO CHANGE ON DATING
    		profileRepository.editPronounsAndYear(profile.getPronouns(), profile.getYear(), checkTokenResp[1], new Date());
    		
       		lgr.log(Level.INFO, "[Edit Pronouns/Year Friend Profile] Edit for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Edit Pronouns/Year Friend Profile] Error editing for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/ep", method = RequestMethod.POST)
    public ResponseEntity < String > editProgram(@RequestParam String token, @ModelAttribute FriendProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit Program Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		if(profile.getProgram() == null || profile.getProgram().equals("")) {
    			lgr.log(Level.WARNING, "[Edit Program Friend Profile] Incorrect details for user: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		    		
    		fpr.editProgram(checkTokenResp[1], profile.getProgram());
    		
    		//ALSO CHANGE ON DATING
    		profileRepository.editProgram(profile.getProgram(), checkTokenResp[1], new Date());
    		
       		lgr.log(Level.INFO, "[Edit Program Friend Profile] Edit for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Edit Program Friend Profile] Error editing for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/si", method = RequestMethod.POST)
    public ResponseEntity < String > saveImages(@RequestParam String token, @ModelAttribute FriendProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit Images Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		if(profile.getImage0() == null || profile.getImage0().equals("")) {
    			lgr.log(Level.WARNING, "[Edit Images Friend Profile] Incorrect details for user: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		    		
    		fpr.saveImages(checkTokenResp[1], profile.getImage0(), profile.getImage1(), profile.getImage2(), profile.getImage3());
    		
    		//Save in PGSQL
    		profileRepository.updateFriendsImage0(checkTokenResp[1], profile.getImage0());
    		
       		lgr.log(Level.INFO, "[Edit Images Friend Profile] Edit for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Edit Images Friend Profile] Error editing for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/ei", method = RequestMethod.POST)
    public ResponseEntity < String > editInterests(@RequestParam String token, @ModelAttribute FriendProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit Interests Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		if(profile.getInterests() == null || profile.getInterests().equals("")) {
    			lgr.log(Level.WARNING, "[Edit Interests Friend Profile] Incorrect details for user: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		
    		//Creating Interest Nodes [OPTIONAL]
    		List<String> interests_arr = Arrays.asList(profile.getInterests().replace("[", "").replace("]", "").replace("\"", "").split(","));
    			
    		System.out.println(interests_arr.size());
    			
    		FriendsInterests fi;
    		
    		String interest_stemmed = "";
    			
    		for(int i = 0; i<interests_arr.size(); i++) {
    			
    			interest_stemmed = interests_arr.get(i);
    			
    			try {
        			englishStemmer stemmer = new englishStemmer();
        			stemmer.setCurrent(interest_stemmed);
        			if (stemmer.stem()){
        				interest_stemmed = stemmer.getCurrent();
        			    System.out.println(interest_stemmed);
        			}
    			}
    			catch(Exception e) {
    				e.printStackTrace();
    	       		lgr.log(Level.INFO, "[Edit Interests Friend Profile] Stemming failed: " + checkTokenResp[1]);
    			}
    			
    			try {
    				fi = new FriendsInterests();
    				fi.setInterest_name(interest_stemmed);
    				finterestsr.save(fi);
    			}
    			catch(Exception e) {
    				System.out.println("Interest already exists");
    			}
    			System.out.println("Attempting to connect: " + interest_stemmed);
    			
        		//Connect User to Interests
    			finterestsr.connectUserToInterest(checkTokenResp[1], interest_stemmed);
    		}
    		    		
    		fpr.editInterests(checkTokenResp[1], profile.getInterests(), interests_arr);
    		
       		lgr.log(Level.INFO, "[Edit Interests Friend Profile] Edit for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Edit Interests Friend Profile] Error editing for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/ec", method = RequestMethod.POST)
    public ResponseEntity < String > editClasses(@RequestParam String token, @ModelAttribute FriendProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit Classes Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		if(profile.getClasses() == null || profile.getClasses().equals("")) {
    			lgr.log(Level.WARNING, "[Edit Classes Friend Profile] Incorrect details for user: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		
    		//Creating Interest Nodes [OPTIONAL]
    		List<String> classes_arr = Arrays.asList(profile.getClasses().replace("[", "").replace("]", "").replace("\"", "").split(","));
    			
    		System.out.println(classes_arr.size());
    			
    		FriendsCourse fc;
    			
    		for(int i = 0; i<classes_arr.size(); i++) {
    				
    			try {
    				fc = new FriendsCourse();
    				fc.setCourse_code(classes_arr.get(i));
    				fcoursesr.save(fc);
    			}
    			catch(Exception e) {
    				System.out.println("Class already exists");
    			}
    			System.out.println("Attempting to connect: " + classes_arr.get(i));
    			
        		//Connect User to Classes
    			fcoursesr.connectUserToClass(checkTokenResp[1], classes_arr.get(i));
    			
    			
    			String groupid = "gid$" + classes_arr.get(i).replaceAll(" ", "").toLowerCase();
    			
    			//Add MEMBER_OF relationship for userid
        		try {
        			groupRepository.joinGroup(checkTokenResp[1], groupid);
        		}
        		catch(Exception e) {
        			e.printStackTrace();
               		lgr.log(Level.INFO, "[Edit Classes Friend Profile] Failed to add user to group: " + checkTokenResp[1] + " " + groupid);
        		}
        		
        		try {
        			GroupMembership gm = new GroupMembership();
            		gm.setChatNotifs(true);
            		gm.setIsActive(true);
            		gm.setPostNotifs(true);
            		gm.setGroupid(groupid);
            		gm.setTime_joined(new Date());
            		gm.setUserid(checkTokenResp[1]); 		
            		gmr.save(gm);
        		}
        		catch(Exception e) {
        			e.printStackTrace();
               		lgr.log(Level.INFO, "[Edit Classes Friend Profile] Failed to add user to group membership table: " + checkTokenResp[1] + " " + groupid);
        		}
        		
    			
    		}
    		    		
    		fpr.editClasses(checkTokenResp[1], profile.getClasses(), classes_arr);
    		
       		lgr.log(Level.INFO, "[Edit Classes Friend Profile] Edit for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Edit Classes Friend Profile] Error editing for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/ebadges", method = RequestMethod.POST)
    public ResponseEntity < String > editBadges(@RequestParam String token, @ModelAttribute FriendProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit Badges Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		if(profile.getBadges() == null || profile.getBadges().equals("")) {
    			lgr.log(Level.WARNING, "[Edit Badges Friend Profile] Incorrect details for user: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		
    		//Creating Badges Nodes [OPTIONAL]
    		List<String> topics_arr = Arrays.asList(profile.getBadges().replace("[", "").replace("]", "").replace("\"", "").split(","));
    			
    		System.out.println(topics_arr.size());
    			
    		FriendsTopic ft;
    			
    		for(int i = 0; i<topics_arr.size(); i++) {
    				
    			try {
    				ft = new FriendsTopic();
    				ft.setTopic_name(topics_arr.get(i));
    				ftopicr.save(ft);
    			}
    			catch(Exception e) {
    				System.out.println("Badge already exists");
    			}
    			System.out.println("Attempting to connect: " + topics_arr.get(i));
    			
        		//Connect User to Topics
    			ftopicr.connectUserToTopic(checkTokenResp[1], topics_arr.get(i));
    		}
    		    		
    		fpr.editBadges(checkTokenResp[1], profile.getBadges(), topics_arr);
    		
       		lgr.log(Level.INFO, "[Edit Badges Friend Profile] Edit for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Edit Badges Friend Profile] Error editing for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/synci", method = RequestMethod.POST)
    public ResponseEntity < String > syncInterests(@RequestParam String token, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Sync Interests Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		String interests = profileRepository.getInterests(checkTokenResp[1]);
    		
    		if(interests == null || interests.equals("")) {
    			lgr.log(Level.INFO, "[Sync Interests Friend Profile] No interests to sync for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"no-sync\"}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    		}
    		
    		//Creating Interest Nodes [OPTIONAL]
    		List<String> interests_arr = Arrays.asList(interests.replace("[", "").replace("]", "").replace("\"", "").split(","));
    			
    		System.out.println(interests_arr.size());
    			
    		FriendsInterests fi;
    			
    		for(int i = 0; i<interests_arr.size(); i++) {
    				
    			try {
    				fi = new FriendsInterests();
    				fi.setInterest_name(interests_arr.get(i));
    				finterestsr.save(fi);
    			}
    			catch(Exception e) {
    				System.out.println("Interest already exists");
    			}
    			System.out.println("Attempting to connect: " + interests_arr.get(i));
    			
        		//Connect User to Interests
    			finterestsr.connectUserToInterest(checkTokenResp[1], interests_arr.get(i));
    		}
    		    		
    		fpr.editInterests(checkTokenResp[1], interests, interests_arr);
    		
       		lgr.log(Level.INFO, "[Sync Interests Friend Profile] Sync for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Sync Interests Friend Profile] Error syncing for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/syncb", method = RequestMethod.POST)
    public ResponseEntity < String > syncBadges(@RequestParam String token, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Sync Badges Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		String badges = profileRepository.getBadges(checkTokenResp[1]);
    		
    		if(badges == null || badges.equals("")) {
    			lgr.log(Level.INFO, "[Sync Badges Friend Profile] No badges to sync for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"no-sync\"}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    		}
    		
    		//Creating Badges Nodes [OPTIONAL]
    		List<String> topics_arr = Arrays.asList(badges.replace("[", "").replace("]", "").replace("\"", "").split(","));
    			
    		System.out.println(topics_arr.size());
    			
    		FriendsTopic ft;
    			
    		for(int i = 0; i<topics_arr.size(); i++) {
    				
    			try {
    				ft = new FriendsTopic();
    				ft.setTopic_name(topics_arr.get(i));
    				ftopicr.save(ft);
    			}
    			catch(Exception e) {
    				System.out.println("Badge already exists");
    			}
    			System.out.println("Attempting to connect: " + topics_arr.get(i));
    			
        		//Connect User to Topics
    			ftopicr.connectUserToTopic(checkTokenResp[1], topics_arr.get(i));
    		}
    		    		
    		fpr.editBadges(checkTokenResp[1], badges, topics_arr);
    		
       		lgr.log(Level.INFO, "[Sync Badges Friend Profile] Sync for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Sync Badges Friend Profile] Error syncing for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/tsm", method = RequestMethod.POST)
    public ResponseEntity < String > toggleShowMe(@RequestParam String token, @RequestParam Boolean toggle_value, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Toggle Show Me Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		fpr.toggleShowMeOnFriends(checkTokenResp[1], toggle_value);
    		
       		lgr.log(Level.INFO, "[Toggle Show Me Friend Profile] Toggled for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Toggle Show Me Friend Profile] Error toggling for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/gp", method = RequestMethod.POST)
    public ResponseEntity < String > getProfile(@RequestParam String token, @ModelAttribute FriendProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Get Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		FriendsProfileResult fp;
    		
    		if(profile.getUserid() == null || profile.getUserid().equals("")){
    			fp = fpr.fetchProfile(checkTokenResp[1], checkTokenResp[1]);
    		}
    		else {
    			fp = fpr.fetchProfile(checkTokenResp[1], profile.getUserid());
    		}
    		
    		if(fp == null || fp.getUserid() == null) {
    			lgr.log(Level.INFO, "[Get Friend Profile] Fetched no data for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"data\":\"" + "nothing-to-show" + "\"}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    		}
    		
    		Gson gson = new Gson();
    		String profileData = gson.toJson(fp);
    		
       		lgr.log(Level.INFO, "[Get Friend Profile] Fetched for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"data\": " + profileData + " }";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Get Friend Profile] Error fetching for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/hb", method = RequestMethod.POST)
    public ResponseEntity < String > hideBadges(@RequestParam String token, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Hide Badges Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		fpr.hideBadges(checkTokenResp[1]);
    		
       		lgr.log(Level.INFO, "[Hide Badges Friend Profile] Hidden badges for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Hide Badges Friend Profile] Error hiding badges for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/hs", method = RequestMethod.POST)
    public ResponseEntity < String > hideSpotify(@RequestParam String token, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Hide Spotify Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		fpr.hideSpotify(checkTokenResp[1]);
    		
       		lgr.log(Level.INFO, "[Hide Spotify Friend Profile] Hidden spotify for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Hide Spotify Friend Profile] Error hiding spotify for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/syncs", method = RequestMethod.POST)
    public ResponseEntity < String > syncSpotify(@RequestParam String userid, @RequestParam String spotifyData, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	
    	if(!ip.equals("127.0.0.1")) {
    		System.out.println(ip);
    		lgr.log(Level.SEVERE, "[Sync Spotify Friend Profile] Not syncing for user, not localhost: " + userid);
       		return new ResponseEntity<String>("no-sync", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		fpr.setSpotify(userid, spotifyData);
    		
    		//Creating Artist Nodes
    		if(spotifyData != null && !spotifyData.equals("")){
    			
    			String[] top_5_spotify_arr = spotifyData.replace("[", "").replace("]", "").replace("\"", "").split(",");
    			
    			System.out.println(top_5_spotify_arr.length);
    			
    			FriendsArtist fa;
    			
    			for(int i = 0; i<top_5_spotify_arr.length; i++) {
    				
    				try {
    					fa = new FriendsArtist();
    					fa.setArtist_id(top_5_spotify_arr[i]);
    					fartistr.save(fa);
    				}
    				catch(Exception e) {
    					System.out.println("Artist already exists");
    				}
    				System.out.println("Attempting to connect: " + top_5_spotify_arr[i]);
    				
    				//Connect User to Artists
    				fartistr.connectUserToArtist(userid, top_5_spotify_arr[i]);
    			}
    			    			
    		}
    		
    		
       		lgr.log(Level.INFO, "[Sync Spotify Friend Profile] Synced spotify for user: " + userid);
        	return new ResponseEntity<String>("success", HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Sync Spotify Friend Profile] Error syncing spotify for user: " + userid);
       		return new ResponseEntity<String>("server-error", HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/hc", method = RequestMethod.POST)
    public ResponseEntity < String > hideClasses(@RequestParam String token, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Hide Classes Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		fpr.hideClasses(checkTokenResp[1]);
    		
       		lgr.log(Level.INFO, "[Hide Classes Friend Profile] Hidden Classes for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Hide Classes Friend Profile] Error hiding classes for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/hi", method = RequestMethod.POST)
    public ResponseEntity < String > hideInterests(@RequestParam String token, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Hide Interests Friend Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		fpr.hideInterests(checkTokenResp[1]);
    		
       		lgr.log(Level.INFO, "[Hide Interests Friend Profile] Hidden interests for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Hide Interests Friend Profile] Error hiding interests for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/ccc", method = RequestMethod.POST)
    public ResponseEntity < String > checkCourseCode(@RequestParam String course_code, HttpServletRequest request) {
    	try {
    		
    		String ret = profileRepository.doesCourseExist(course_code.toUpperCase());
    		
    		Boolean return_value = false;
    		
    		if(ret != null && ret.equals(course_code)){
    			return_value = true;
    		}
    		
       		lgr.log(Level.INFO, "[Check Course Code] Checked courses ");
			String tokenResponse = "{\"token\":\"" + "NA" + "\", \"status\":\"" + return_value + "\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Check Course Code] Error checking course code");
    		String tokenResponse = "{\"token\":\"" + "NA" + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/dfp", method = RequestMethod.POST)
    public ResponseEntity < String > deleteFriendProfile(@RequestParam String userid, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	
    	if(!ip.equals("127.0.0.1")) {
    		System.out.println(ip);
    		lgr.log(Level.SEVERE, "[Delete Friend Profile] Not deleting user, not localhost: " + userid);
       		return new ResponseEntity<String>("no-del", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		fpr.deleteUser(userid);
    		
    		
       		lgr.log(Level.INFO, "[Delete Friend Profile] Deleted user: " + userid);
        	return new ResponseEntity<String>("success", HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Delete Friend Profile] Error deleting user: " + userid);
       		return new ResponseEntity<String>("server-error", HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/fp/guf", method = RequestMethod.POST)
    public ResponseEntity < String > getUserFirstname(@RequestParam String userid, HttpServletRequest request) {
    	/*String ip = request.getRemoteAddr();
    	
    	if(!ip.equals("127.0.0.1")) {
    		System.out.println(ip);
    		//lgr.log(Level.SEVERE, "[Get Group Name and Members] Not fetching data, not localhost: " + groupid);
       		return new ResponseEntity<String>("no-fetch", HttpStatus.UNAUTHORIZED);
    	}*/
    	
    	try {
    		
    		Gson gson = new Gson();
    		
    		FriendsProfileResult fp = fpr.getUserName(userid);

       		//lgr.log(Level.INFO, "[Delete Friend Profile] Deleted user: " + userid);
        	return new ResponseEntity<String>(gson.toJson(fp), HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		//lgr.log(Level.SEVERE, "[Delete Friend Profile] Error deleting user: " + userid);
       		return new ResponseEntity<String>("server-error", HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }

}
