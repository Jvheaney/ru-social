package ca.rumine.backend.RU.Mine;

import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;

import ca.rumine.backend.RU.Mine.repository.FriendProfileRepository;
import ca.rumine.backend.RU.Mine.repository.ProfileRepository;
import ca.rumine.backend.RU.Mine.repository.UserRepository;
import ca.rumine.backend.RU.Mine.model.FriendProfile;
import ca.rumine.backend.RU.Mine.model.FriendsProfileResult;
import ca.rumine.backend.RU.Mine.model.SignInDataModel;
import ca.rumine.backend.RU.Mine.model.TokenPayload;

@Controller
@RestController
public class AccountController {

	@Autowired
	UserRepository userRepository;

	@Autowired
	ProfileRepository profileRepository;

	@Autowired
	FriendProfileRepository fpr;

	@Autowired
	TokenManager tokenManager;

	@Value("${server.address}")
	private String serverAddress;

    @RequestMapping(value = "/gw/acc/s2", method = RequestMethod.POST)
    public ResponseEntity < String > signinAndFetch(@ModelAttribute IDToken idToken, HttpServletRequest request) {
    	 Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
    	if(idToken != null) {
    		String ip = request.getRemoteAddr();
    		TokenPayload userPayload = idToken.getUserEmail();
    		if(userPayload == null) {
    			 lgr.log(Level.WARNING, "[Account Sign in] User payload is NULL. IP: " + ip);
    			return new ResponseEntity<String>("\"tokenerror\"", HttpStatus.UNAUTHORIZED);
    		}
    		else {
    			if(userPayload.getEmail().contains("@ryerson.ca")) {
        			String[] tokenResponse = tokenManager.isAccountCreated(userPayload.getEmail());
        			String httpResp = "";

        			if(tokenResponse[0] == "dne") {

        				if(profileRepository.isProfessor(userPayload.getEmail())) {
        					lgr.log(Level.SEVERE, "[Account Sign in] This user is a professor: " + userPayload.getEmail());
        					return new ResponseEntity<String>("\"professor\"", HttpStatus.CREATED);
        				}

        				//create account and generate tokens
           			 	lgr.log(Level.INFO, "[Account Sign in] Creating account for: " + userPayload.getEmail() + " IP: " + ip);
        				httpResp = "{\"token\":\"" + tokenManager.createAccount(userPayload.getEmail(), userPayload.getFirstName(), userPayload.getLastName(), ip) + "\", \"status\":\"newuser\", \"firstname\":\"" + userPayload.getFirstName() + "\", \"lastname\":\"" + userPayload.getLastName() + "\"}";
        			}
        			else if(tokenResponse[0] == "noprofile") {

        				if(profileRepository.isProfessor(userPayload.getEmail())) {
        					lgr.log(Level.SEVERE, "[Account Sign in] This user is a professor: " + userPayload.getEmail());
        					return new ResponseEntity<String>("\"professor\"", HttpStatus.CREATED);
        				}

           			 	lgr.log(Level.INFO, "[Account Sign in] No profile for: " + tokenResponse[1] + " IP: " + ip);
        				httpResp = "{\"token\":\"" + tokenManager.generateTokenPair(tokenResponse[1], ip) + "\", \"status\":\"newuser\", \"firstname\":\"" + userPayload.getFirstName() + "\", \"lastname\":\"" + userPayload.getLastName() + "\"}";
        			}
        			else {
        				//generate tokens
           			 	lgr.log(Level.INFO, "[Account Sign in] Signing in: " + tokenResponse[1] + " IP: " + ip);

           			 	String[][] result = profileRepository.getSignInData(tokenResponse[1]);

           			 	SignInDataModel user_data = new SignInDataModel();
           			 if(result == null || result.length == 0 || result[0] == null || result[0].length == 0) {

        			 	}
        			 	else if(result[0][0] == null || result[0][0].equals("")) {
     			 		user_data.setAllow_location_tracking(Boolean.parseBoolean(result[0][24]));
     			 		user_data.setAllow_notifications(Boolean.parseBoolean(result[0][25]));
        			 	}
        			 	else {
        			 		user_data.setFirstname_display(result[0][0]);
        			 		user_data.setBirthdate(result[0][1]);
        			 		user_data.setProgram(result[0][2]);
        			 		user_data.setYear(result[0][3]);
        			 		user_data.setGender(Integer.parseInt(result[0][4]));
        			 		user_data.setInt_m(Boolean.parseBoolean(result[0][5]));
        			 		user_data.setInt_f(Boolean.parseBoolean(result[0][6]));
        			 		user_data.setInt_nb(Boolean.parseBoolean(result[0][7]));
        			 		user_data.setInt_t(Boolean.parseBoolean(result[0][8]));
        			 		user_data.setInt_o(Boolean.parseBoolean(result[0][9]));
        			 		user_data.setBio(result[0][10]);
        			 		user_data.setPronouns(result[0][11]);
        			 		user_data.setLookingFor(result[0][12]);
        			 		user_data.setStart_age(Integer.parseInt(result[0][13]));
        			 		user_data.setEnd_age(Integer.parseInt(result[0][14]));
     			 			user_data.setReshow_profiles(Boolean.parseBoolean(result[0][15]));
     			 			user_data.setImage0(result[0][16]);
     			 			user_data.setImage1(result[0][17]);
     			 			user_data.setImage2(result[0][18]);
     			 			user_data.setImage3(result[0][19]);
     			 			user_data.setBadges(result[0][20]);
     			 			user_data.setInterests(result[0][21]);
     			 			user_data.setTop_5_spotify(result[0][22]);
     			 			user_data.setDatingEnabled(Boolean.parseBoolean(result[0][23]));
     			 			user_data.setAllow_location_tracking(Boolean.parseBoolean(result[0][24]));
     			 			user_data.setAllow_notifications(Boolean.parseBoolean(result[0][25]));
        			 		user_data.setLastname(result[0][26]);
        			 	}

           			 	FriendProfile fp = fpr.getProfile(tokenResponse[1]);
           			 	//FriendProfile fp = new FriendProfile();

           			 	if(fp != null) {
           			 		fp.setId(null);
           			 		fp.setDeleted(null);
        			 	}

           			 	Gson gson = new Gson();

           			 	String pgsql_user_data_return = gson.toJson(user_data);
           			 	String neo_user_data_return = gson.toJson(fp);

        				httpResp = "{\"token\":\"" + tokenManager.generateTokenPair(tokenResponse[1],ip) + "\", \"status\":\"returning\", \"dating\":" + pgsql_user_data_return + ", \"friends\":" + neo_user_data_return + "}";
        			}
        			return new ResponseEntity<String>(httpResp, HttpStatus.CREATED);
        		}
    			else if(userPayload.getEmail().equals("adminEmail1")) {
            			String[] tokenResponse = tokenManager.isAccountCreated(userPayload.getEmail());
            			String httpResp = "";
            			if(tokenResponse[0] == "dne") {
            				//create account and generate tokens
               			 	lgr.log(Level.INFO, "[Account Sign in] No account for admin personal GMAIL.");
            				httpResp = "{\"token\":\"" + tokenManager.createAccount(userPayload.getEmail(), userPayload.getFirstName(), userPayload.getLastName(), ip) + "\", \"status\":\"newuser\", \"firstname\":\"" + userPayload.getFirstName() + "\", \"lastname\":\"" + userPayload.getLastName() + "\"}";
            			}
            			else if(tokenResponse[0] == "noprofile") {
               			 	lgr.log(Level.INFO, "[Account Sign in] No profile for admin personal GMAIL.");
            				httpResp = "{\"token\":\"" + tokenManager.generateTokenPair(tokenResponse[1], ip) + "\", \"status\":\"newuser\", \"firstname\":\"" + userPayload.getFirstName() + "\", \"lastname\":\"" + userPayload.getLastName() + "\"}";
            			}
            			else {
            				//generate tokens
               			 	lgr.log(Level.INFO, "[Account Sign in] Signing in admin personal GMAIL.");

               			 String[][] result = profileRepository.getSignInData(tokenResponse[1]);

            			 	SignInDataModel user_data = new SignInDataModel();
            			 	if(result == null || result.length == 0 || result[0] == null || result[0].length == 0) {

               			 	}
               			 	else if(result[0][0] == null || result[0][0].equals("")) {
            			 		user_data.setAllow_location_tracking(Boolean.parseBoolean(result[0][24]));
            			 		user_data.setAllow_notifications(Boolean.parseBoolean(result[0][25]));
               			 	}
               			 	else {
               			 		user_data.setFirstname_display(result[0][0]);
               			 		user_data.setBirthdate(result[0][1]);
               			 		user_data.setProgram(result[0][2]);
               			 		user_data.setYear(result[0][3]);
               			 		user_data.setGender(Integer.parseInt(result[0][4]));
               			 		user_data.setInt_m(Boolean.parseBoolean(result[0][5]));
               			 		user_data.setInt_f(Boolean.parseBoolean(result[0][6]));
               			 		user_data.setInt_nb(Boolean.parseBoolean(result[0][7]));
               			 		user_data.setInt_t(Boolean.parseBoolean(result[0][8]));
               			 		user_data.setInt_o(Boolean.parseBoolean(result[0][9]));
               			 		user_data.setBio(result[0][10]);
               			 		user_data.setPronouns(result[0][11]);
            			 		user_data.setLookingFor(result[0][12]);
            			 		user_data.setStart_age(Integer.parseInt(result[0][13]));
            			 		user_data.setEnd_age(Integer.parseInt(result[0][14]));
            			 		user_data.setReshow_profiles(Boolean.parseBoolean(result[0][15]));
            			 		user_data.setImage0(result[0][16]);
            			 		user_data.setImage1(result[0][17]);
            			 		user_data.setImage2(result[0][18]);
            			 		user_data.setImage3(result[0][19]);
            			 		user_data.setBadges(result[0][20]);
            			 		user_data.setInterests(result[0][21]);
            			 		user_data.setTop_5_spotify(result[0][22]);
            			 		user_data.setDatingEnabled(Boolean.parseBoolean(result[0][23]));
            			 		user_data.setAllow_location_tracking(Boolean.parseBoolean(result[0][24]));
            			 		user_data.setAllow_notifications(Boolean.parseBoolean(result[0][25]));
            			 		user_data.setLastname(result[0][26]);
               			 	}

            			 	FriendProfile fp = fpr.getProfile(tokenResponse[1]);

            			 	if(fp != null) {
                   			 fp.setId(null);
                   			 fp.setDeleted(null);
               			 	}

            			 	Gson gson = new Gson();

            			 	String pgsql_user_data_return = gson.toJson(user_data);
            			 	String neo_user_data_return = gson.toJson(fp);

         				httpResp = "{\"token\":\"" + tokenManager.generateTokenPair(tokenResponse[1],ip) + "\", \"status\":\"returning\", \"dating\":" + pgsql_user_data_return + ", \"friends\":" + neo_user_data_return + "}";

            			}
            			return new ResponseEntity<String>(httpResp, HttpStatus.CREATED);
            	}
    			else if(userPayload.getEmail().equals("adminEmail2")) {
        			String[] tokenResponse = tokenManager.isAccountCreated(userPayload.getEmail());
        			String httpResp = "";
        			if(tokenResponse[0] == "dne") {
        				//create account and generate tokens
           			 	lgr.log(Level.INFO, "[Account Sign in] No account for adminEmail2 GMAIL." + " IP: " + ip);
        				httpResp = "{\"token\":\"" + tokenManager.createAccount(userPayload.getEmail(), userPayload.getFirstName(), userPayload.getLastName(), ip) + "\", \"status\":\"newuser\", \"firstname\":\"" + userPayload.getFirstName() + "\", \"lastname\":\"" + userPayload.getLastName() + "\"}";
        			}
        			else if(tokenResponse[0] == "noprofile") {
           			 	lgr.log(Level.INFO, "[Account Sign in] No profile for adminEmail2 GMAIL." + " IP: " + ip);
        				httpResp = "{\"token\":\"" + tokenManager.generateTokenPair(tokenResponse[1], ip) + "\", \"status\":\"newuser\", \"firstname\":\"" + userPayload.getFirstName() + "\", \"lastname\":\"" + userPayload.getLastName() + "\"}";
        			}
        			else {
        				//generate tokens
           			 	lgr.log(Level.INFO, "[Account Sign in] Signing in adminEmail2 GMAIL." + " IP: " + ip);

           			 String[][] result = profileRepository.getSignInData(tokenResponse[1]);

        			 	SignInDataModel user_data = new SignInDataModel();
        			 	if(result == null || result.length == 0 || result[0] == null || result[0].length == 0) {

           			 	}
           			 	else if(result[0][0] == null || result[0][0].equals("")) {
        			 		user_data.setAllow_location_tracking(Boolean.parseBoolean(result[0][24]));
        			 		user_data.setAllow_notifications(Boolean.parseBoolean(result[0][25]));
           			 	}
           			 	else {
           			 		user_data.setFirstname_display(result[0][0]);
           			 		user_data.setBirthdate(result[0][1]);
           			 		user_data.setProgram(result[0][2]);
           			 		user_data.setYear(result[0][3]);
           			 		user_data.setGender(Integer.parseInt(result[0][4]));
           			 		user_data.setInt_m(Boolean.parseBoolean(result[0][5]));
           			 		user_data.setInt_f(Boolean.parseBoolean(result[0][6]));
           			 		user_data.setInt_nb(Boolean.parseBoolean(result[0][7]));
           			 		user_data.setInt_t(Boolean.parseBoolean(result[0][8]));
           			 		user_data.setInt_o(Boolean.parseBoolean(result[0][9]));
           			 		user_data.setBio(result[0][10]);
           			 		user_data.setPronouns(result[0][11]);
        			 		user_data.setLookingFor(result[0][12]);
        			 		user_data.setStart_age(Integer.parseInt(result[0][13]));
        			 		user_data.setEnd_age(Integer.parseInt(result[0][14]));
        			 		user_data.setReshow_profiles(Boolean.parseBoolean(result[0][15]));
        			 		user_data.setImage0(result[0][16]);
        			 		user_data.setImage1(result[0][17]);
        			 		user_data.setImage2(result[0][18]);
        			 		user_data.setImage3(result[0][19]);
        			 		user_data.setBadges(result[0][20]);
        			 		user_data.setInterests(result[0][21]);
        			 		user_data.setTop_5_spotify(result[0][22]);
        			 		user_data.setDatingEnabled(Boolean.parseBoolean(result[0][23]));
        			 		user_data.setAllow_location_tracking(Boolean.parseBoolean(result[0][24]));
        			 		user_data.setAllow_notifications(Boolean.parseBoolean(result[0][25]));
        			 		user_data.setLastname(result[0][26]);
           			 	}

        			 	FriendProfile fp = fpr.getProfile(tokenResponse[1]);

        			 	if(fp != null) {
               			 fp.setId(null);
               			 fp.setDeleted(null);
           			 	}

        			 	Gson gson = new Gson();

        			 	String pgsql_user_data_return = gson.toJson(user_data);
        			 	String neo_user_data_return = gson.toJson(fp);

     				httpResp = "{\"token\":\"" + tokenManager.generateTokenPair(tokenResponse[1],ip) + "\", \"status\":\"returning\", \"dating\":" + pgsql_user_data_return + ", \"friends\":" + neo_user_data_return + "}";

        			}
        			return new ResponseEntity<String>(httpResp, HttpStatus.CREATED);
    			}
    			else if(userPayload.getEmail().equals("adminEmail3")) {
        			String[] tokenResponse = tokenManager.isAccountCreated(userPayload.getEmail());
        			String httpResp = "";
        			if(tokenResponse[0] == "dne") {
        				//create account and generate tokens
           			 	lgr.log(Level.INFO, "[Account Sign in] No account for adminEmail3 GMAIL" + " IP: " + ip);
        				httpResp = "{\"token\":\"" + tokenManager.createAccount(userPayload.getEmail(), userPayload.getFirstName(), userPayload.getLastName(), ip) + "\", \"status\":\"newuser\", \"firstname\":\"" + userPayload.getFirstName() + "\", \"lastname\":\"" + userPayload.getLastName() + "\"}";
        			}
        			else if(tokenResponse[0] == "noprofile") {
           			 	lgr.log(Level.INFO, "[Account Sign in] No profile for adminEmail3 GMAIL." + " IP: " + ip);
        				httpResp = "{\"token\":\"" + tokenManager.generateTokenPair(tokenResponse[1], ip) + "\", \"status\":\"newuser\", \"firstname\":\"" + userPayload.getFirstName() + "\", \"lastname\":\"" + userPayload.getLastName() + "\"}";
        			}
        			else {
        				//generate tokens
           			 	lgr.log(Level.INFO, "[Account Sign in] Signing in adminEmail3 GMAIL." + " IP: " + ip);

           			 String[][] result = profileRepository.getSignInData(tokenResponse[1]);

        			 	SignInDataModel user_data = new SignInDataModel();
        			 	if(result == null || result.length == 0 || result[0] == null || result[0].length == 0) {

           			 	}
           			 	else if(result[0][0] == null || result[0][0].equals("")) {
        			 		user_data.setAllow_location_tracking(Boolean.parseBoolean(result[0][24]));
        			 		user_data.setAllow_notifications(Boolean.parseBoolean(result[0][25]));
           			 	}
           			 	else {
           			 		user_data.setFirstname_display(result[0][0]);
           			 		user_data.setBirthdate(result[0][1]);
           			 		user_data.setProgram(result[0][2]);
           			 		user_data.setYear(result[0][3]);
           			 		user_data.setGender(Integer.parseInt(result[0][4]));
           			 		user_data.setInt_m(Boolean.parseBoolean(result[0][5]));
           			 		user_data.setInt_f(Boolean.parseBoolean(result[0][6]));
           			 		user_data.setInt_nb(Boolean.parseBoolean(result[0][7]));
           			 		user_data.setInt_t(Boolean.parseBoolean(result[0][8]));
           			 		user_data.setInt_o(Boolean.parseBoolean(result[0][9]));
           			 		user_data.setBio(result[0][10]);
           			 		user_data.setPronouns(result[0][11]);
        			 		user_data.setLookingFor(result[0][12]);
        			 		user_data.setStart_age(Integer.parseInt(result[0][13]));
        			 		user_data.setEnd_age(Integer.parseInt(result[0][14]));
        			 		user_data.setReshow_profiles(Boolean.parseBoolean(result[0][15]));
        			 		user_data.setImage0(result[0][16]);
        			 		user_data.setImage1(result[0][17]);
        			 		user_data.setImage2(result[0][18]);
        			 		user_data.setImage3(result[0][19]);
        			 		user_data.setBadges(result[0][20]);
        			 		user_data.setInterests(result[0][21]);
        			 		user_data.setTop_5_spotify(result[0][22]);
        			 		user_data.setDatingEnabled(Boolean.parseBoolean(result[0][23]));
        			 		user_data.setAllow_location_tracking(Boolean.parseBoolean(result[0][24]));
        			 		user_data.setAllow_notifications(Boolean.parseBoolean(result[0][25]));
        			 		user_data.setLastname(result[0][26]);
           			 	}

        			 	FriendProfile fp = fpr.getProfile(tokenResponse[1]);

        			 	if(fp != null) {
               			 fp.setId(null);
               			 fp.setDeleted(null);
           			 	}

        			 	Gson gson = new Gson();

        			 	String pgsql_user_data_return = gson.toJson(user_data);
        			 	String neo_user_data_return = gson.toJson(fp);

     				httpResp = "{\"token\":\"" + tokenManager.generateTokenPair(tokenResponse[1],ip) + "\", \"status\":\"returning\", \"dating\":" + pgsql_user_data_return + ", \"friends\":" + neo_user_data_return + "}";

        			}
        			return new ResponseEntity<String>(httpResp, HttpStatus.CREATED);
    			}
    			else if(userPayload.getEmail().equals("adminEmail4")) {
        			String[] tokenResponse = tokenManager.isAccountCreated(userPayload.getEmail());
        			String httpResp = "";
        			if(tokenResponse[0] == "dne") {
        				//create account and generate tokens
           			 	lgr.log(Level.INFO, "[Account Sign in] No account for adminEmail4 GMAIL" + " IP: " + ip);
        				httpResp = "{\"token\":\"" + tokenManager.createAccount(userPayload.getEmail(), userPayload.getFirstName(), userPayload.getLastName(), ip) + "\", \"status\":\"newuser\", \"firstname\":\"" + userPayload.getFirstName() + "\", \"lastname\":\"" + userPayload.getLastName() + "\"}";
        			}
        			else if(tokenResponse[0] == "noprofile") {
           			 	lgr.log(Level.INFO, "[Account Sign in] No profile for adminEmail4 GMAIL." + " IP: " + ip);
        				httpResp = "{\"token\":\"" + tokenManager.generateTokenPair(tokenResponse[1], ip) + "\", \"status\":\"newuser\", \"firstname\":\"" + userPayload.getFirstName() + "\", \"lastname\":\"" + userPayload.getLastName() + "\"}";
        			}
        			else {
        				//generate tokens
           			 	lgr.log(Level.INFO, "[Account Sign in] Signing in adminEmail4 GMAIL." + " IP: " + ip);

           			 String[][] result = profileRepository.getSignInData(tokenResponse[1]);

        			 	SignInDataModel user_data = new SignInDataModel();
        			 	if(result == null || result.length == 0 || result[0] == null || result[0].length == 0) {

           			 	}
           			 	else if(result[0][0] == null || result[0][0].equals("")) {
        			 		user_data.setAllow_location_tracking(Boolean.parseBoolean(result[0][24]));
        			 		user_data.setAllow_notifications(Boolean.parseBoolean(result[0][25]));
           			 	}
           			 	else {
           			 		user_data.setFirstname_display(result[0][0]);
           			 		user_data.setBirthdate(result[0][1]);
           			 		user_data.setProgram(result[0][2]);
           			 		user_data.setYear(result[0][3]);
           			 		user_data.setGender(Integer.parseInt(result[0][4]));
           			 		user_data.setInt_m(Boolean.parseBoolean(result[0][5]));
           			 		user_data.setInt_f(Boolean.parseBoolean(result[0][6]));
           			 		user_data.setInt_nb(Boolean.parseBoolean(result[0][7]));
           			 		user_data.setInt_t(Boolean.parseBoolean(result[0][8]));
           			 		user_data.setInt_o(Boolean.parseBoolean(result[0][9]));
           			 		user_data.setBio(result[0][10]);
           			 		user_data.setPronouns(result[0][11]);
        			 		user_data.setLookingFor(result[0][12]);
        			 		user_data.setStart_age(Integer.parseInt(result[0][13]));
        			 		user_data.setEnd_age(Integer.parseInt(result[0][14]));
        			 		user_data.setReshow_profiles(Boolean.parseBoolean(result[0][15]));
        			 		user_data.setImage0(result[0][16]);
        			 		user_data.setImage1(result[0][17]);
        			 		user_data.setImage2(result[0][18]);
        			 		user_data.setImage3(result[0][19]);
        			 		user_data.setBadges(result[0][20]);
        			 		user_data.setInterests(result[0][21]);
        			 		user_data.setTop_5_spotify(result[0][22]);
        			 		user_data.setDatingEnabled(Boolean.parseBoolean(result[0][23]));
        			 		user_data.setAllow_location_tracking(Boolean.parseBoolean(result[0][24]));
        			 		user_data.setAllow_notifications(Boolean.parseBoolean(result[0][25]));
        			 		user_data.setLastname(result[0][26]);
           			 	}

        			 	FriendProfile fp = fpr.getProfile(tokenResponse[1]);

        			 	if(fp != null) {
               			 fp.setId(null);
               			 fp.setDeleted(null);
           			 	}

        			 	Gson gson = new Gson();

        			 	String pgsql_user_data_return = gson.toJson(user_data);
        			 	String neo_user_data_return = gson.toJson(fp);

     				httpResp = "{\"token\":\"" + tokenManager.generateTokenPair(tokenResponse[1],ip) + "\", \"status\":\"returning\", \"dating\":" + pgsql_user_data_return + ", \"friends\":" + neo_user_data_return + "}";

        			}
        			return new ResponseEntity<String>(httpResp, HttpStatus.CREATED);
    			}
    			else if(userPayload.getEmail().equals("adminEmail5")) {
        			String[] tokenResponse = tokenManager.isAccountCreated(userPayload.getEmail());
        			String httpResp = "";
        			if(tokenResponse[0] == "dne") {
        				//create account and generate tokens
           			 	lgr.log(Level.INFO, "[Account Sign in] No account for adminEmail5 GMAIL" + " IP: " + ip);
        				httpResp = "{\"token\":\"" + tokenManager.createAccount(userPayload.getEmail(), userPayload.getFirstName(), userPayload.getLastName(), ip) + "\", \"status\":\"newuser\", \"firstname\":\"" + userPayload.getFirstName() + "\", \"lastname\":\"" + userPayload.getLastName() + "\"}";
        			}
        			else if(tokenResponse[0] == "noprofile") {
           			 	lgr.log(Level.INFO, "[Account Sign in] No profile for adminEmail5 GMAIL." + " IP: " + ip);
        				httpResp = "{\"token\":\"" + tokenManager.generateTokenPair(tokenResponse[1], ip) + "\", \"status\":\"newuser\", \"firstname\":\"" + userPayload.getFirstName() + "\", \"lastname\":\"" + userPayload.getLastName() + "\"}";
        			}
        			else {
        				//generate tokens
           			 	lgr.log(Level.INFO, "[Account Sign in] Signing in adminEmail5 GMAIL." + " IP: " + ip);

           			 String[][] result = profileRepository.getSignInData(tokenResponse[1]);

        			 	SignInDataModel user_data = new SignInDataModel();
        			 	if(result == null || result.length == 0 || result[0] == null || result[0].length == 0) {

           			 	}
           			 	else if(result[0][0] == null || result[0][0].equals("")) {
        			 		user_data.setAllow_location_tracking(Boolean.parseBoolean(result[0][24]));
        			 		user_data.setAllow_notifications(Boolean.parseBoolean(result[0][25]));
           			 	}
           			 	else {
           			 		user_data.setFirstname_display(result[0][0]);
           			 		user_data.setBirthdate(result[0][1]);
           			 		user_data.setProgram(result[0][2]);
           			 		user_data.setYear(result[0][3]);
           			 		user_data.setGender(Integer.parseInt(result[0][4]));
           			 		user_data.setInt_m(Boolean.parseBoolean(result[0][5]));
           			 		user_data.setInt_f(Boolean.parseBoolean(result[0][6]));
           			 		user_data.setInt_nb(Boolean.parseBoolean(result[0][7]));
           			 		user_data.setInt_t(Boolean.parseBoolean(result[0][8]));
           			 		user_data.setInt_o(Boolean.parseBoolean(result[0][9]));
           			 		user_data.setBio(result[0][10]);
           			 		user_data.setPronouns(result[0][11]);
        			 		user_data.setLookingFor(result[0][12]);
        			 		user_data.setStart_age(Integer.parseInt(result[0][13]));
        			 		user_data.setEnd_age(Integer.parseInt(result[0][14]));
        			 		user_data.setReshow_profiles(Boolean.parseBoolean(result[0][15]));
        			 		user_data.setImage0(result[0][16]);
        			 		user_data.setImage1(result[0][17]);
        			 		user_data.setImage2(result[0][18]);
        			 		user_data.setImage3(result[0][19]);
        			 		user_data.setBadges(result[0][20]);
        			 		user_data.setInterests(result[0][21]);
        			 		user_data.setTop_5_spotify(result[0][22]);
        			 		user_data.setDatingEnabled(Boolean.parseBoolean(result[0][23]));
        			 		user_data.setAllow_location_tracking(Boolean.parseBoolean(result[0][24]));
        			 		user_data.setAllow_notifications(Boolean.parseBoolean(result[0][25]));
        			 		user_data.setLastname(result[0][26]);
           			 	}

        			 	FriendProfile fp = fpr.getProfile(tokenResponse[1]);

        			 	if(fp != null) {
               			 fp.setId(null);
               			 fp.setDeleted(null);
           			 	}

        			 	Gson gson = new Gson();

        			 	String pgsql_user_data_return = gson.toJson(user_data);
        			 	String neo_user_data_return = gson.toJson(fp);

     				httpResp = "{\"token\":\"" + tokenManager.generateTokenPair(tokenResponse[1],ip) + "\", \"status\":\"returning\", \"dating\":" + pgsql_user_data_return + ", \"friends\":" + neo_user_data_return + "}";

        			}
        			return new ResponseEntity<String>(httpResp, HttpStatus.CREATED);
    			}
    			else if(userPayload.getEmail().equals("adminEmail6")) {
        			String[] tokenResponse = tokenManager.isAccountCreated(userPayload.getEmail());
        			String httpResp = "";
        			if(tokenResponse[0] == "dne") {
        				//create account and generate tokens
           			 	lgr.log(Level.INFO, "[Account Sign in] No account for adminEmail6 GMAIL" + " IP: " + ip);
        				httpResp = "{\"token\":\"" + tokenManager.createAccount(userPayload.getEmail(), userPayload.getFirstName(), userPayload.getLastName(), ip) + "\", \"status\":\"newuser\", \"firstname\":\"" + userPayload.getFirstName() + "\", \"lastname\":\"" + userPayload.getLastName() + "\"}";
        			}
        			else if(tokenResponse[0] == "noprofile") {
           			 	lgr.log(Level.INFO, "[Account Sign in] No profile for adminEmail6 GMAIL." + " IP: " + ip);
        				httpResp = "{\"token\":\"" + tokenManager.generateTokenPair(tokenResponse[1], ip) + "\", \"status\":\"newuser\", \"firstname\":\"" + userPayload.getFirstName() + "\", \"lastname\":\"" + userPayload.getLastName() + "\"}";
        			}
        			else {
        				//generate tokens
           			 	lgr.log(Level.INFO, "[Account Sign in] Signing in adminEmail6 GMAIL." + " IP: " + ip);

           			 String[][] result = profileRepository.getSignInData(tokenResponse[1]);

           			 	SignInDataModel user_data = new SignInDataModel();

           			 	if(result == null || result.length == 0 || result[0] == null || result[0].length == 0) {

           			 	}
           			 	else if(result[0][0] == null || result[0][0].equals("")) {
        			 		user_data.setAllow_location_tracking(Boolean.parseBoolean(result[0][24]));
        			 		user_data.setAllow_notifications(Boolean.parseBoolean(result[0][25]));
           			 	}
           			 	else {
           			 		user_data.setFirstname_display(result[0][0]);
           			 		user_data.setBirthdate(result[0][1]);
           			 		user_data.setProgram(result[0][2]);
           			 		user_data.setYear(result[0][3]);
           			 		user_data.setGender(Integer.parseInt(result[0][4]));
           			 		user_data.setInt_m(Boolean.parseBoolean(result[0][5]));
           			 		user_data.setInt_f(Boolean.parseBoolean(result[0][6]));
           			 		user_data.setInt_nb(Boolean.parseBoolean(result[0][7]));
           			 		user_data.setInt_t(Boolean.parseBoolean(result[0][8]));
           			 		user_data.setInt_o(Boolean.parseBoolean(result[0][9]));
           			 		user_data.setBio(result[0][10]);
           			 		user_data.setPronouns(result[0][11]);
        			 		user_data.setLookingFor(result[0][12]);
        			 		user_data.setStart_age(Integer.parseInt(result[0][13]));
        			 		user_data.setEnd_age(Integer.parseInt(result[0][14]));
        			 		user_data.setReshow_profiles(Boolean.parseBoolean(result[0][15]));
        			 		user_data.setImage0(result[0][16]);
        			 		user_data.setImage1(result[0][17]);
        			 		user_data.setImage2(result[0][18]);
        			 		user_data.setImage3(result[0][19]);
        			 		user_data.setBadges(result[0][20]);
        			 		user_data.setInterests(result[0][21]);
        			 		user_data.setTop_5_spotify(result[0][22]);
        			 		user_data.setDatingEnabled(Boolean.parseBoolean(result[0][23]));
        			 		user_data.setAllow_location_tracking(Boolean.parseBoolean(result[0][24]));
        			 		user_data.setAllow_notifications(Boolean.parseBoolean(result[0][25]));
        			 		user_data.setLastname(result[0][26]);
           			 	}


        			 	FriendProfile fp = fpr.getProfile(tokenResponse[1]);

        			 	if(fp != null) {
            			 fp.setId(null);
            			 fp.setDeleted(null);
        			 	}

        			 	Gson gson = new Gson();

        			 	String pgsql_user_data_return = gson.toJson(user_data);
        			 	String neo_user_data_return = gson.toJson(fp);

     				httpResp = "{\"token\":\"" + tokenManager.generateTokenPair(tokenResponse[1],ip) + "\", \"status\":\"returning\", \"dating\":" + pgsql_user_data_return + ", \"friends\":" + neo_user_data_return + "}";

        			}
        			return new ResponseEntity<String>(httpResp, HttpStatus.CREATED);
    			}
    			else {
       			 	lgr.log(Level.INFO, "[Account Sign in] Incorrect email used on: " + userPayload.getEmail() + " IP: " + ip);
    				return new ResponseEntity<String>("\"wrongaccount\"", HttpStatus.CREATED);
    			}
    		}
    	}
    	else {
			lgr.log(Level.SEVERE, "[Account Sign in] Post error");
			return new ResponseEntity<String>("\"posterror\"", HttpStatus.CREATED);
    	}
    }

    @RequestMapping(value = "/gw/sync", method = RequestMethod.POST)
    public ResponseEntity < String > syncProfiles(@RequestParam String token, HttpServletRequest request) {
   	 	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Sync Profiles] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}

    	try {

    		//generate tokens
			String[][] result = profileRepository.getSignInData(checkTokenResp[1]);

			SignInDataModel user_data = new SignInDataModel();
			if(result == null || result.length == 0 || result[0] == null || result[0].length == 0) {

		 	}
		 	else if(result[0][0] == null || result[0][0].equals("")) {
		 		user_data.setAllow_location_tracking(Boolean.parseBoolean(result[0][24]));
		 		user_data.setAllow_notifications(Boolean.parseBoolean(result[0][25]));
		 	}
		 	else {
		 		user_data.setFirstname_display(result[0][0]);
		 		user_data.setBirthdate(result[0][1]);
		 		user_data.setProgram(result[0][2]);
		 		user_data.setYear(result[0][3]);
		 		user_data.setGender(Integer.parseInt(result[0][4]));
		 		user_data.setInt_m(Boolean.parseBoolean(result[0][5]));
		 		user_data.setInt_f(Boolean.parseBoolean(result[0][6]));
		 		user_data.setInt_nb(Boolean.parseBoolean(result[0][7]));
		 		user_data.setInt_t(Boolean.parseBoolean(result[0][8]));
		 		user_data.setInt_o(Boolean.parseBoolean(result[0][9]));
		 		user_data.setBio(result[0][10]);
		 		user_data.setPronouns(result[0][11]);
		 		user_data.setLookingFor(result[0][12]);
		 		user_data.setStart_age(Integer.parseInt(result[0][13]));
		 		user_data.setEnd_age(Integer.parseInt(result[0][14]));
		 		user_data.setReshow_profiles(Boolean.parseBoolean(result[0][15]));
		 		user_data.setImage0(result[0][16]);
		 		user_data.setImage1(result[0][17]);
		 		user_data.setImage2(result[0][18]);
		 		user_data.setImage3(result[0][19]);
		 		user_data.setBadges(result[0][20]);
		 		user_data.setInterests(result[0][21]);
		 		user_data.setTop_5_spotify(result[0][22]);
		 		user_data.setDatingEnabled(Boolean.parseBoolean(result[0][23]));
		 		user_data.setAllow_location_tracking(Boolean.parseBoolean(result[0][24]));
		 		user_data.setAllow_notifications(Boolean.parseBoolean(result[0][25]));
		 		user_data.setLastname(result[0][26]);
		 	}

			 	FriendProfile fp = fpr.getProfile(checkTokenResp[1]);
				//FriendProfile fp = new FriendProfile();

			if(fp != null) {
				fp.setId(null);
				fp.setDeleted(null);
		 	}


    		try {
    			profileRepository.setLastSeen(checkTokenResp[1]);
    			lgr.log(Level.INFO, "[Account Controller - Save Last Seen] Saved Dating last seen for userid: " + checkTokenResp[1]);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
    			lgr.log(Level.INFO, "[Account Controller - Save Last Seen] Save Dating last seen for userid failed: " + checkTokenResp[1]);
    		}

    		try {
    			fpr.setLastseen(checkTokenResp[1], new Date().getTime());
    			lgr.log(Level.INFO, "[Account Controller - Save Last Seen] Saved friends last seen for userid: " + checkTokenResp[1]);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
    			lgr.log(Level.INFO, "[Account Controller - Save Last Seen] Save friends last seen for userid failed: " + checkTokenResp[1]);
    		}


			Gson gson = new Gson();

			String pgsql_user_data_return = gson.toJson(user_data);
			String neo_user_data_return = gson.toJson(fp);

			String share_url = "https://rufriends.me/join/s.php?i=";

       		lgr.log(Level.SEVERE, "[Sync Profiles] Returning sync'd data for user: " + checkTokenResp[1]);
			String httpResp = "{\"token\":\"" + checkTokenResp[0] + "\", \"dating\":" + pgsql_user_data_return + ", \"friends\":" + neo_user_data_return + ", \"shareurl\":\"" + share_url + "\"}";
			return new ResponseEntity<String>(httpResp, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Sync Profiles] Error fetching for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }

    /*@RequestMapping(value = "/gw/acc/dbs", method = RequestMethod.POST)
    public ResponseEntity < String > debugSignin(@RequestParam String userid, HttpServletRequest request) {
    	 Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
    	 String ip = request.getRemoteAddr();
    	 System.out.println(ip);
    	 System.out.println(serverAddress);
    	 String httpResp;
    	 if(ip.equals(serverAddress))
    	 {
    		lgr.log(Level.INFO, "[Debug Account Generated] Generated" + " IP: " + ip);
			httpResp = "{\"token\":\"" + tokenManager.generateTokenPair(userid,ip) + "\", \"status\":\"debug\"}";
			return new ResponseEntity<String>(httpResp, HttpStatus.OK);
    	 }
    	lgr.log(Level.SEVERE, "[Debug Account Attempt] Not same IP");
 		return new ResponseEntity<String>("Error, that's all we know.", HttpStatus.NOT_FOUND);
    }*/

}
