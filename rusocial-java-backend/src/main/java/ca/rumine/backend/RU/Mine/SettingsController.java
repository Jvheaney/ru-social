package ca.rumine.backend.RU.Mine;

import java.util.Date;
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
import org.springframework.web.bind.annotation.RestController;

import ca.rumine.backend.RU.Mine.model.SettingsToggle;
import ca.rumine.backend.RU.Mine.model.User;
import ca.rumine.backend.RU.Mine.repository.SettingsRepository;
import ca.rumine.backend.RU.Mine.repository.UserRepository;

@Controller
@RestController
public class SettingsController {
	@Autowired
	private SettingsRepository settingsRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private TokenManager tokenManager;
	
	 Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
	    
    @RequestMapping(value = "/gw/s/n", method = RequestMethod.POST)
    public ResponseEntity < String > toggleNotif(@ModelAttribute SettingsToggle st, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(st.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
    		 lgr.log(Level.INFO, "[Toggle Notif] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else if(st.getToggle_value() != null) {
    		settingsRepository.setAllowNotification(checkTokenResp[1], st.getToggle_value());
   		 	lgr.log(Level.INFO, "[Toggle Notif] Returning success to user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    	}
    	else {
   		 	lgr.log(Level.SEVERE, "[Toggle Notif] Wrong data with user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.BAD_REQUEST);
    	}
    }
    
    @RequestMapping(value = "/gw/s/l", method = RequestMethod.POST)
    public ResponseEntity < String > toggleLoc(@ModelAttribute SettingsToggle st, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(st.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Toggle Location] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else if(st.getToggle_value() != null) {
    		settingsRepository.setAllowLocation(checkTokenResp[1], st.getToggle_value());
   		 	lgr.log(Level.INFO, "[Toggle Location] Returning success to user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    	}
    	else {
   		 	lgr.log(Level.SEVERE, "[Toggle Location] Wrong data with user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.BAD_REQUEST);
    	}
    }
    
    @RequestMapping(value = "/gw/s/g", method = RequestMethod.POST)
    public ResponseEntity < String > getLocAndNotif(@ModelAttribute SettingsToggle st, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(st.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Get Loc and Notif] User told to signout with ip: " + ip);
   		 	return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	try {
    		User user = userRepository.findByUserid(checkTokenResp[1]);
   		 	lgr.log(Level.INFO, "[Toggle Loc and Notif] Returning success to user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":{\"notifications\":" + user.getAllowNotifications() + ", \"location\":" + user.getAllowLocationTracking() + "}}";
    		return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    	}
    	catch(Exception e) {
   		 	lgr.log(Level.SEVERE, "[Get Loc and Notif] Server error with user: " + checkTokenResp[1]);
    		e.printStackTrace();
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    }
    
}
