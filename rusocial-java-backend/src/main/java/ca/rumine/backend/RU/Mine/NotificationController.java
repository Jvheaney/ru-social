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

import ca.rumine.backend.RU.Mine.model.PushNotificationRequest;
import ca.rumine.backend.RU.Mine.model.NotificationToken;
import ca.rumine.backend.RU.Mine.repository.FriendProfileRepository;
import ca.rumine.backend.RU.Mine.repository.NotificationRepository;
import ca.rumine.backend.RU.Mine.repository.ProfileRepository;
import ca.rumine.backend.RU.Mine.manager.NotificationManager;

@Controller
@RestController
public class NotificationController {
		
	@Autowired
	private NotificationRepository notificationRepository;

	@Autowired
	private TokenManager tokenManager;
	
	@Autowired
	private ProfileRepository profileRepository;
	
	@Autowired
	private FriendProfileRepository fpr;
	
	@Autowired
	private NotificationManager notificationManager;
	    
    @RequestMapping(value = "/gw/n/t", method = RequestMethod.POST)
    public ResponseEntity < String > addToken(@ModelAttribute NotificationToken nt, HttpServletRequest request) {
    	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(nt.getToken(), ip);
    	String token_to_save = nt.getNotif_token();
    	if(checkTokenResp[1] == "logout") {
			lgr.log(Level.INFO, "[Add Notif Token] User told to logout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else if(nt.getNotif_token() != null) {
    		try {
    			String notif_token = notificationRepository.getCurrentToken(checkTokenResp[1]);
    			if(notif_token != null) {
    				String current_token = notif_token;
    				nt.setUserid(checkTokenResp[1]);
    				nt.setToken(current_token);
    				notificationRepository.delete(nt);
    				lgr.log(Level.INFO, "[Add Notif Token] Deleted old notif token for userid: " + checkTokenResp[1]);
    			}
    		}
    		catch(Exception e) {
    			lgr.log(Level.WARNING, "[Add Notif Token] Failed to get current token on userid: " + checkTokenResp[1]);
    			e.printStackTrace();
    		}
    		//Add new token
    		nt.setUserid(checkTokenResp[1]);
    		nt.setToken(token_to_save);
    		notificationRepository.save(nt);
    		
    		
			lgr.log(Level.INFO, "[Add Notif Token] Saved notif token for userid: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"" + "success" + "\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    	}
    	else {
			lgr.log(Level.SEVERE, "[Add Notif Token] Incorrect data on userid: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.BAD_REQUEST);
    	}
    }
    
    @RequestMapping(value = "/gw/n/g", method = RequestMethod.POST)
    public ResponseEntity < String > getNotifs(@ModelAttribute NotificationToken nt, HttpServletRequest request) {
    	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(nt.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
			lgr.log(Level.INFO, "[Get User Notifs] User told to logout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	String count = notificationRepository.getNotificationCount(checkTokenResp[1]);
		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"data\":\"" + count + "\"}";
        return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    }
    
}
