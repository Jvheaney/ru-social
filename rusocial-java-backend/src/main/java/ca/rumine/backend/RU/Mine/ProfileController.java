package ca.rumine.backend.RU.Mine;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.Deflater;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import javax.servlet.ServletContext;
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

import ca.rumine.backend.RU.Mine.model.UserProfile;
import ca.rumine.backend.RU.Mine.model.UploadedImage;
import ca.rumine.backend.RU.Mine.model.FriendProfile;
import ca.rumine.backend.RU.Mine.model.FriendsProfileResult;
import ca.rumine.backend.RU.Mine.model.Program;
import ca.rumine.backend.RU.Mine.model.SpotifyArtist;
import ca.rumine.backend.RU.Mine.model.Top5Spotify;
import ca.rumine.backend.RU.Mine.repository.ProfileRepository;
import ca.rumine.backend.RU.Mine.repository.FriendProfileRepository;
import ca.rumine.backend.RU.Mine.repository.ImageRepository;
import ca.rumine.backend.RU.Mine.repository.SettingsRepository;

@Controller
@RestController
public class ProfileController {
	
	@Autowired
	private ProfileRepository profileRepository;
	
	@Autowired
	private ImageRepository imageRepository;
	
	@Autowired
	private SettingsRepository settingsRepository;
	
	@Autowired
	private FriendProfileRepository fpr;
	
	@Autowired
	private TokenManager tokenManager;
	
	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
		
    @RequestMapping(value = "/gw/up/c", method = RequestMethod.POST)
    public ResponseEntity < String > create(@ModelAttribute UserProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(profile.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
    		 lgr.log(Level.INFO, "[Create Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	if(profile.getFirstname_display() == null || profile.getBirthdate() == null || profile.getProgram() == null || profile.getProgram().equals("null") || profile.getYear() == null || profile.getYear().equals("null") || profile.getGender() == null || profile.getInterested_male() == null || profile.getInterested_female() == null || profile.getInterested_nb() == null || profile.getInterested_trans() == null || profile.getInterested_other() == null || profile.getBio() == null || profile.getPronouns() == null || profile.getLookingfor() == null || profile.getLookingfor().equals("null")) {
   		 	lgr.log(Level.WARNING, "[Create Profile] Incorrect details for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
    		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    	else {
    		
    		String lastname = "";
    		if(profile.getLastname() != null && !profile.getLastname().equals("")) {
    			lastname = profile.getLastname();
    		}
    		profile.setLastname(lastname);
    		profile.setUserid(checkTokenResp[1]);
    		profile.setEdited(new Date());
    		profile.setStart_age(18);
    		profile.setEnd_age(40);
    		profile.setReshow_profiles(true);
    		profile.setShow_me(true);
    		profile.setLast_seen(new Date());
        	UserProfile saved_profile = profileRepository.save(profile);
        	if(saved_profile == null) {
       		 	lgr.log(Level.SEVERE, "[Create Profile] Error saving for user: " + checkTokenResp[1]);
				String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"save-error\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        	}
        	else{
        		settingsRepository.setProfileMade(checkTokenResp[1]);
       		 	lgr.log(Level.INFO, "[Create Profile] Profile saved for user: " + checkTokenResp[1]);
				String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
        	}
    	}
    }
    
    @RequestMapping(value = "/gw/up/ena", method = RequestMethod.POST)
    public ResponseEntity < String > editNameAge(@ModelAttribute UserProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(profile.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit Name and Age] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	if(profile.getFirstname_display() == null || profile.getBirthdate() == null) {
   		 	lgr.log(Level.WARNING, "[Edit Name and Age] Wrong data for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
    		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    	else {
    		try {
    			profile.setUserid(checkTokenResp[1]);
    			profileRepository.editNameAge(profile.getFirstname_display(), profile.getBirthdate(), checkTokenResp[1], new Date());
       		 	lgr.log(Level.INFO, "[Edit Name and Age] Saved data for user: " + checkTokenResp[1]);
				String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Edit Name and Age] Error saving data for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/up/eflna", method = RequestMethod.POST)
    public ResponseEntity < String > editBothNamesAge(@ModelAttribute UserProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(profile.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit Both Names and Age] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	if(profile.getFirstname_display() == null || profile.getBirthdate() == null || profile.getLastname() == null) {
   		 	lgr.log(Level.WARNING, "[Edit Name and Age] Wrong data for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
    		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    	else {
    		try {
    			profile.setUserid(checkTokenResp[1]);
    			profileRepository.editBothNamesAge(profile.getFirstname_display(), profile.getLastname(), profile.getBirthdate(), checkTokenResp[1], new Date());
       		 	//Update lastname in friends_profile pgsql
    			profileRepository.updateFriendsLastname(checkTokenResp[1],profile.getLastname());
    			//Sync to friends
    			fpr.updateBirthdateAndLastname(checkTokenResp[1],profile.getBirthdate(), profile.getLastname());
    			lgr.log(Level.INFO, "[Edit Both Names and Age] Saved data for user: " + checkTokenResp[1]);
				String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Edit Both Names and Age] Error saving data for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/up/epy", method = RequestMethod.POST)
    public ResponseEntity < String > editProgramYear(@ModelAttribute UserProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(profile.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit Program and Year] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	if(profile.getProgram() == null || profile.getYear() == null || profile.getProgram().equals("null") || profile.getYear().equals("null")) {
   		 	lgr.log(Level.WARNING, "[Edit Program and Year] Wrong data for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
    		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    	else {
    		try {
        		profile.setUserid(checkTokenResp[1]);
            	profileRepository.editProgramAndYear(profile.getProgram(), profile.getYear(), checkTokenResp[1], new Date());
            	
            	//Sync with friends
            	fpr.editProgramYear(checkTokenResp[1], profile.getProgram(), profile.getYear());
            	
       		 	lgr.log(Level.INFO, "[Edit Program and Year] Saved data for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Edit Program and Year] Error saving data for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/up/eplf", method = RequestMethod.POST)
    public ResponseEntity < String > editPronounsAndLookingFor(@ModelAttribute UserProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(profile.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit Pronouns and Looking For] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	if(profile.getPronouns() == null || profile.getLookingfor() == null || profile.getLookingfor().equals("null")) {
   		 	lgr.log(Level.WARNING, "[Edit Pronouns and Looking For] Wrong data for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
    		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    	else {
    		try {
    			profile.setUserid(checkTokenResp[1]);
        		profileRepository.editPronounsAndLookingfor(profile.getPronouns(), profile.getLookingfor(), checkTokenResp[1], new Date());
        		
        		//Sync pronouns with friends
        		fpr.editPronouns(checkTokenResp[1], profile.getPronouns());
        		
       		 	lgr.log(Level.INFO, "[Edit Pronouns and Looking For] Saved data for user: " + checkTokenResp[1]);
				String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Edit Pronouns and Looking For] Error saving data for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/up/eb", method = RequestMethod.POST)
    public ResponseEntity < String > editBio(@ModelAttribute UserProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(profile.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit Bio] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	if(profile.getBio() == null) {
   		 	lgr.log(Level.WARNING, "[Edit Bio] Wrong data for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
    		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    	else {
    		try {
    			profile.setUserid(checkTokenResp[1]);
    			profileRepository.editBio(profile.getBio(), checkTokenResp[1], new Date());
       		 	lgr.log(Level.INFO, "[Edit Bio] Saved data for user: " + checkTokenResp[1]);
				String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Edit Bio] Error saving data for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/up/ec", method = RequestMethod.POST)
    public ResponseEntity < String > editCaption(@ModelAttribute UserProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(profile.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit Caption] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	if(profile.getCaptionNum() == null) {
   		 	lgr.log(Level.WARNING, "[Edit Caption] Wrong data for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
    		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    	else {
    		try {
    			profile.setUserid(checkTokenResp[1]);
    			if(profile.getCaptionNum() == 0) {
    				profileRepository.editCaption0(profile.getCaption0(), checkTokenResp[1], new Date());
    			}
    			else if(profile.getCaptionNum() == 1) {
    				profileRepository.editCaption1(profile.getCaption1(), checkTokenResp[1], new Date());
    			}
    			else if(profile.getCaptionNum() == 2) {
    				profileRepository.editCaption2(profile.getCaption2(), checkTokenResp[1], new Date());
    			}
       		 	lgr.log(Level.INFO, "[Edit Caption] Saved data for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Edit Caption] Error saving data for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/up/es", method = RequestMethod.POST)
    public ResponseEntity < String > editStory(@ModelAttribute UserProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(profile.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit Story] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	if(profile.getStoryheadline() == null || profile.getStory() == null) {
   		 	lgr.log(Level.WARNING, "[Edit Story] Wrong data for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
    		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    	else {
    		try {
    			profile.setUserid(checkTokenResp[1]);
    			profileRepository.editStory(profile.getStoryheadline(), profile.getStory(), checkTokenResp[1], new Date());
       		 	lgr.log(Level.INFO, "[Edit Story] Saved data for user: " + checkTokenResp[1]);
				String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Edit Story] Error saving data for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/up/ep", method = RequestMethod.POST)
    public ResponseEntity < String > editPreferences(@ModelAttribute UserProfile profile, @RequestParam(value = "friends_algo_pref", required = false) Integer friends_algo_pref, @RequestParam(value = "datingProfileExists", required = false) Boolean datingProfileExists, @RequestParam(value = "friendsProfileExists", required = false) Boolean friendsProfileExists, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(profile.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Edit Preferences] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	if(friends_algo_pref == null && datingProfileExists == null && friendsProfileExists == null) {
    		//indication of old app
    		System.out.println("Updating dating pref");
			if(profile.getReshow_profiles() == null) {
				profile.setReshow_profiles(true);
			}
			if(profile.getEnd_age() == null) {
				profile.setEnd_age(40);
			}
			if(profile.getStart_age() == null) {
				profile.setStart_age(18);
			}
			profile.setUserid(checkTokenResp[1]);
			profileRepository.editPreferences(profile.getStart_age(), profile.getEnd_age(), profile.getReshow_profiles(), profile.getGender(), profile.getInterested_male(), profile.getInterested_female(), profile.getInterested_nb(), profile.getInterested_trans(), profile.getInterested_other(), checkTokenResp[1], new Date());
			lgr.log(Level.INFO, "[Edit Preferences (OLD APP)] Saved data for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
    		return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    	}
    	
    	
    	if(friends_algo_pref != null && (friends_algo_pref < 0 || friends_algo_pref > 4) && friendsProfileExists) {
    		lgr.log(Level.WARNING, "[Edit Preferences] Wrong data for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
    		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    		
    	if((profile.getGender() == null || profile.getInterested_male() == null || profile.getInterested_female() == null || profile.getInterested_nb() == null || profile.getInterested_trans() == null || profile.getInterested_other() == null) && datingProfileExists) {
    		lgr.log(Level.WARNING, "[Edit Preferences] Wrong data for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
    		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    	else {
    		try {
    			if(datingProfileExists) {
    				System.out.println("Updating dating pref");
    				if(profile.getReshow_profiles() == null) {
        				profile.setReshow_profiles(true);
        			}
        			if(profile.getEnd_age() == null) {
        				profile.setEnd_age(40);
        			}
        			if(profile.getStart_age() == null) {
        				profile.setStart_age(18);
        			}
        			profile.setUserid(checkTokenResp[1]);
        			profileRepository.editPreferences(profile.getStart_age(), profile.getEnd_age(), profile.getReshow_profiles(), profile.getGender(), profile.getInterested_male(), profile.getInterested_female(), profile.getInterested_nb(), profile.getInterested_trans(), profile.getInterested_other(), checkTokenResp[1], new Date());
    			}
    			
    			if(friendsProfileExists) {
    				System.out.println("Updating friends pref");
    				//Save preferences
            		fpr.saveAlgoPreference(checkTokenResp[1], friends_algo_pref);
    			}
    			
    			lgr.log(Level.INFO, "[Edit Preferences] Saved data for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Edit Preferences] Error saving data for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/up/p", method = RequestMethod.POST)
    public ResponseEntity < String > getUserProfile(@ModelAttribute UserProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(profile.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Get User Profile] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	Gson gson = new Gson();
    	try {
    		if(profile.getOtherUserId() == null) {
    			UserProfile up = profileRepository.getUserProfile(checkTokenResp[1]);
    			/*UploadedImage[] ui = imageRepository.getAllUserPhotos(checkTokenResp[1]);
    			String ui_array = "[";
    			for (int i = 0; i<ui.length; i++) {
    				ui[i].setImgid("https://rumine.ca/_i/s/i.php?i=" + ui[i].getImgid());
    				ui[i].setData(null);
    				ui[i].setDeleted(null);
    				ui[i].setUploaded(null);
    				ui[i].setUserid(null);
    				ui_array+=gson.toJson(ui[i]);
    				if(i+1 != ui.length) {
    					ui_array+=",";
    				}
    			}
    			ui_array += "]";*/
    			up.setUserid(null);
    			up.setEdited(null);
    			up.setShow_me(null);
    			up.setLast_seen(null);
    			up.setStart_age(null);
    			up.setEnd_age(null);
    			up.setReshow_profiles(null);
    			up.setGender(null);
    			up.setInterested_male(null);
    			up.setInterested_female(null);
    			up.setInterested_nb(null);
    			up.setInterested_other(null);
    			up.setInterested_trans(null);
    			String profileData = "{\"profile\":" + gson.toJson(up) + "}";
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":" + profileData + "}";
       		 	lgr.log(Level.INFO, "[Get User Profile (me)] Returning data, asking user: " + checkTokenResp[1]);
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    		}
    		else {
    			UserProfile up = profileRepository.getUserProfile(profile.getOtherUserId());
    			UploadedImage[] ui = imageRepository.getAllUserPhotos(profile.getOtherUserId());
    			String ui_array = "[";
    			for (int i = 0; i<ui.length; i++) {
    				ui[i].setImgid("https://rumine.ca/_i/s/i.php?i=" + ui[i].getImgid());
    				ui[i].setData(null);
    				ui[i].setDeleted(null);
    				ui[i].setUploaded(null);
    				ui[i].setUserid(null);
    				ui_array+=gson.toJson(ui[i]);
    				if(i+1 != ui.length) {
    					ui_array+=",";
    				}
    			}
    			ui_array += "]";
    			up.setUserid(null);
    			up.setEdited(null);
    			up.setStart_age(null);
    			up.setEnd_age(null);
    			up.setReshow_profiles(null);
    			up.setInterested_male(null);
    			up.setInterested_female(null);
    			up.setInterested_nb(null);
    			up.setInterested_trans(null);
    			up.setInterested_other(null);
    			String profileData = "{\"profile\":" + gson.toJson(up) + ",\"images\":" + ui_array + "}";
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":" + profileData + "}";
       		 	lgr.log(Level.INFO, "[Get User Profile (other)] Returning data, asking user: " + checkTokenResp[1]);
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    		}
    	}
    	catch(Exception e) {
   		 	lgr.log(Level.SEVERE, "[Get User Profile] Error getting data, asking user: " + checkTokenResp[1]);
    		e.printStackTrace();
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    }
    
    @RequestMapping(value = "/gw/up/ui", method = RequestMethod.POST)
    public ResponseEntity < String > uploadImage(@ModelAttribute UploadedImage image, HttpServletRequest request) {
    	//This should only be used on profile creation
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(image.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Upload Image] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	if(image.getImgnum() == null) {
   		 	lgr.log(Level.WARNING, "[Upload Image] Incorrect data with user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
    		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    	else {
    		image.setUserid(checkTokenResp[1]);
        	imageRepository.deleteOldPhoto(checkTokenResp[1], image.getImgnum());
        	if(image.getData().equals("removeimage")) {
       		 	lgr.log(Level.WARNING, "[Upload Image] Remove image with user: " + checkTokenResp[1]);
            	String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"dataerror\"}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
        	}
        	else if(image.getData() != null) {
        		String imgDiskId = getSaltString(64);
        		try
                {
                    //This will decode the String which is encoded by using Base64 class
                    BufferedImage image_disk = null;
                    byte[] imageByte = Base64.getDecoder().decode(image.getData());
                    ByteArrayInputStream bis = new ByteArrayInputStream(imageByte);
                    image_disk = ImageIO.read(bis);
                    bis.close();
                    File outputfile = new File("./img_uploads/" + imgDiskId + ".tmp");
                    ImageIO.write(image_disk, "jpeg", outputfile);
                    ProcessBuilder processBuilder = new ProcessBuilder();
                    processBuilder.command("bash", "-c", "./compress.sh " + imgDiskId + ".tmp");
                    try {

                		Process process = processBuilder.start();

                		StringBuilder output = new StringBuilder();

                		BufferedReader reader = new BufferedReader(
                				new InputStreamReader(process.getInputStream()));

                		String line;
                		while ((line = reader.readLine()) != null) {
                			output.append(line + "\n");
                		}

                		int exitVal = process.waitFor();
                		if (exitVal == 0) {
                		} else {
                		}
               		 	lgr.log(Level.INFO, "[Upload Image] Image compressed and saved to disk for user: " + checkTokenResp[1]);
                	} catch (IOException e) {
               		 	lgr.log(Level.SEVERE, "[Upload Image] IO error with user: " + checkTokenResp[1]);
                		e.printStackTrace();
                	} catch (InterruptedException e) {
               		 	lgr.log(Level.SEVERE, "[Upload Image] Interrupted error with user: " + checkTokenResp[1]);
                		e.printStackTrace();
                	}
                }
                catch(Exception e)
                {
           		 	lgr.log(Level.SEVERE, "[Upload Image] Data error with user: " + checkTokenResp[1]);
                	String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"dataerror\"}";
                	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
                }
        		String imageid = getSaltString(32);
        		image.setImgid(imageid);
        		image.setUploaded(new Date());
        		image.setDeleted(false);
        		image.setData(imgDiskId+".tmp");
        		imageRepository.save(image);
       		 	lgr.log(Level.INFO, "[Upload Image] Image saved to database for user: " + checkTokenResp[1]);
        	}
   		 	lgr.log(Level.INFO, "[Upload Image] Returning image url: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"" + image.getImgid() + "\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    	}
    }
    
    @RequestMapping(value = "/gw/up/gp", method = RequestMethod.POST)
    public ResponseEntity < String > getPrograms(@ModelAttribute Program program, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(program.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Get Programs] User told to sign out with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else {
    		try {
    			List<Program> programs = profileRepository.getPrograms();
    			String prog_array = "[";
    			for (int i = 0; i<programs.size(); i++) {
    				prog_array+=programs.get(i).toJson();
    				if(i+1 != programs.size()) {
    					prog_array+=",";
    				}
    			}
    			prog_array += "]";
       		 	lgr.log(Level.INFO, "[Get Programs] Returning programs with user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"programs\":" + prog_array + "}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Get Programs] Server error with user: " + checkTokenResp[1]);
    			e.printStackTrace();
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/up/gsa", method = RequestMethod.POST)
    public ResponseEntity < String > getSpotifyArtists(@ModelAttribute Top5Spotify top5, HttpServletRequest request) {
    	//lgr.log(Level.INFO, top5.getArtist_1());
    	try {
    		Gson gson = new Gson();
    		List<SpotifyArtist> artist_data = profileRepository.getSpotifyArtistData(top5.getArtist_1(), top5.getArtist_2(), top5.getArtist_3(), top5.getArtist_4(), top5.getArtist_5());
       	 	//lgr.log(Level.INFO, "[Get Spotify Artists] Returning Artists");
    		String tokenResponse = "{\"token\":\"" + "NA" + "\", \"artist_data\":" + gson.toJson(artist_data) + "}";
    		return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
     	 	lgr.log(Level.SEVERE, "[Get Spotify Artists] Server error");
    		e.printStackTrace();
    		String tokenResponse = "{\"token\":\"" + "NA" + "\", \"status\":\"server-error\"}";
    		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    }
    
    @RequestMapping(value = "/gw/up/hsa", method = RequestMethod.POST)
    public ResponseEntity < String > hideSpotifyArtists(@ModelAttribute Program program, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(program.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Hide Spotify Aritsts] User told to sign out with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else {
    		try {
    			profileRepository.hideArtistData(checkTokenResp[1], new Date());
       		 	lgr.log(Level.INFO, "[Hide Spotify Aritsts] Successfully removed artists: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":" + "\"success\"" + "}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Hide Spotify Aritsts] Server error with user: " + checkTokenResp[1]);
    			e.printStackTrace();
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/up/si", method = RequestMethod.POST)
    public ResponseEntity < String > saveInterests(@ModelAttribute UserProfile up, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(up.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Save Interests] User told to sign out with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else {
    		try {
    			profileRepository.saveInterests(checkTokenResp[1], up.getInterests(), new Date());
       		 	lgr.log(Level.INFO, "[Save Interests] Successfully save interests: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":" + "\"success\"" + "}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Save Interests] Server error with user: " + checkTokenResp[1]);
    			e.printStackTrace();
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/up/hi", method = RequestMethod.POST)
    public ResponseEntity < String > hideInterests(@ModelAttribute UserProfile up, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(up.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Hide Interests] User told to sign out with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else {
    		try {
    			profileRepository.hideInterests(checkTokenResp[1], new Date());
       		 	lgr.log(Level.INFO, "[Hide Interests] Successfully hidden interests: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":" + "\"success\"" + "}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Hide Interests] Server error with user: " + checkTokenResp[1]);
    			e.printStackTrace();
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/up/sb", method = RequestMethod.POST)
    public ResponseEntity < String > saveBadges(@ModelAttribute UserProfile up, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(up.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Save Badges] User told to sign out with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else {
    		try {
    			profileRepository.saveBadges(checkTokenResp[1], up.getBadges(), new Date());
       		 	lgr.log(Level.INFO, "[Save Badges] Successfully save badges: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":" + "\"success\"" + "}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Save Badges] Server error with user: " + checkTokenResp[1]);
    			e.printStackTrace();
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/up/hb", method = RequestMethod.POST)
    public ResponseEntity < String > hideBadges(@ModelAttribute UserProfile up, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(up.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Hide Badges] User told to sign out with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else {
    		try {
    			profileRepository.hideBadges(checkTokenResp[1], new Date());
       		 	lgr.log(Level.INFO, "[Hide Badges] Successfully hidden badges: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":" + "\"success\"" + "}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Hide Badges] Server error with user: " + checkTokenResp[1]);
    			e.printStackTrace();
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/up/upi", method = RequestMethod.POST)
    public ResponseEntity < String > uploadProfileImage(@ModelAttribute UploadedImage image, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(image.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Upload Profile Image] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	image.setUserid(checkTokenResp[1]);
        if(image.getData() != null) {
        	String imgDiskId = getSaltString(64);
        	try
        	{
        		//This will decode the String which is encoded by using Base64 class
                BufferedImage image_disk = null;
                byte[] imageByte = Base64.getDecoder().decode(image.getData());
                ByteArrayInputStream bis = new ByteArrayInputStream(imageByte);
                image_disk = ImageIO.read(bis);
                bis.close();
                File outputfile = new File("./img_uploads/" + imgDiskId + ".tmp");
                ImageIO.write(image_disk, "jpeg", outputfile);
                ProcessBuilder processBuilder = new ProcessBuilder();
                processBuilder.command("bash", "-c", "./compress.sh " + imgDiskId + ".tmp");
                try {

                	Process process = processBuilder.start();

                	StringBuilder output = new StringBuilder();

                	BufferedReader reader = new BufferedReader(
                				new InputStreamReader(process.getInputStream()));

                	String line;
                	while ((line = reader.readLine()) != null) {
                		output.append(line + "\n");
                	}

                	int exitVal = process.waitFor();
                	if (exitVal == 0) {
                	} else {
                	}
               		lgr.log(Level.INFO, "[Upload Profile Image] Image compressed and saved to disk for user: " + checkTokenResp[1]);
                } catch (IOException e) {
               		lgr.log(Level.SEVERE, "[Upload Profile Image] IO error with user: " + checkTokenResp[1]);
                	e.printStackTrace();
                } catch (InterruptedException e) {
               		 lgr.log(Level.SEVERE, "[Upload Profile Image] Interrupted error with user: " + checkTokenResp[1]);
                	e.printStackTrace();
                	}
                }
                catch(Exception e)
                {
           		 	lgr.log(Level.SEVERE, "[Upload Profile Image] Data error with user: " + checkTokenResp[1]);
                	String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"dataerror\"}";
                	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
                }
        		image.setImgid(getSaltString(32));
        		image.setUploaded(new Date());
        		image.setDeleted(false);
        		image.setData(imgDiskId+".tmp");
        		imageRepository.save(image);
       		 	lgr.log(Level.INFO, "[Upload Profile Image] Image saved to database for user: " + checkTokenResp[1]);
        	}
        	else {
        		lgr.log(Level.SEVERE, "[Upload Profile Image] Incorrect data with user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrong-data\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.BAD_REQUEST);
        	}
   		 	lgr.log(Level.INFO, "[Upload Profile Image] Returning image url: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"" + image.getImgid() + "\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    }
    
    @RequestMapping(value = "/gw/up/spi", method = RequestMethod.POST)
    public ResponseEntity < String > saveProfileImage(@ModelAttribute UserProfile images, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(images.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Save Profile Image] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
        if(images.getImage0() != null && !images.getImage0().equals("null")) {
        	String image0 = null, image1 = null, image2 = null, image3 = null;
        	if(!images.getImage0().equals("null")) {
        		image0 = images.getImage0();
        	}
        	if(!images.getImage1().equals("null")) {
        		image1 = images.getImage1();
        	}
        	if(!images.getImage2().equals("null")) {
        		image2 = images.getImage2();
        	}
        	if(!images.getImage3().equals("null")) {
        		image3 = images.getImage3();
        	}
        	profileRepository.saveImagesToProfile(checkTokenResp[1], image0, image1, image2, image3);
        	lgr.log(Level.INFO, "[Save Profile Image] Images saved to database for user: " + checkTokenResp[1]);
        }
        else {
        	lgr.log(Level.SEVERE, "[Save Profile Image] Incorrect data with user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrong-data\"}";
    		return new ResponseEntity<String>(tokenResponse, HttpStatus.BAD_REQUEST);
        }
   		lgr.log(Level.INFO, "[Save Profile Image] Returning image url: " + checkTokenResp[1]);
		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"" + "success" + "\"}";
        return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    }
    
    @RequestMapping(value = "/gw/up/tsm", method = RequestMethod.POST)
    public ResponseEntity < String > toggleShowMe(@RequestParam String token, @RequestParam Boolean toggle_value, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Toggle Show Me Dating] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else {
    		try {
    			
    			profileRepository.toggleShowMe(toggle_value, checkTokenResp[1]);
    			
       		 	lgr.log(Level.INFO, "[Toggle Show Me Dating] Toggled for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Toggle Show Me Dating] Error toggling for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/up/mfp", method = RequestMethod.POST)
    public ResponseEntity < String > migrateFriendProfile(@ModelAttribute UserProfile profile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(profile.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Migrate to Dating] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	try {

    		//Fetch profile from friends
    		FriendProfile result = fpr.getProfile(checkTokenResp[1]);
    		
    		if(result == null || !result.getUserid().equals(checkTokenResp[1])) {
    			lgr.log(Level.SEVERE, "[Migrate to Dating] No data found for user: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		
    		String lastname = "";
    		if(result.getLastname() != null && !result.getLastname().equals("")){
    			lastname = result.getLastname();
    		}
    		
    		profile.setUserid(checkTokenResp[1]);
    		profile.setReshow_profiles(true);
    		profile.setEnd_age(40);
    		profile.setStart_age(18);
    		profile.setShow_me(true);
    		profile.setFirstname_display(result.getFirstname_display());
    		profile.setLastname(lastname);
    		profile.setPronouns(result.getPronouns());
    		profile.setYear(result.getYear());
    		profile.setProgram(result.getProgram());
    		profile.setTop_5_spotify(result.getTop_5_spotify());
    		profile.setBadges(result.getBadges());
    		profile.setInterests(result.getInterests());
    		profile.setBio(result.getBio());
    		profile.setImage0(result.getImage0());
    		profile.setLast_seen(new Date());
    		
    		profileRepository.save(profile);

    		lgr.log(Level.INFO, "[Migrate to Dating] Migrated data for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       	 	lgr.log(Level.SEVERE, "[Migrate to Dating] Error migrating data for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
    		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
    
	protected String getSaltString(int length) {
        String SALTCHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        StringBuilder salt = new StringBuilder();
        Random rnd = new Random();
        while (salt.length() < length) { // length of the random string.
            int index = (int) (rnd.nextFloat() * SALTCHARS.length());
            salt.append(SALTCHARS.charAt(index));
        }
        String saltStr = salt.toString();
        return saltStr;

    }
}
