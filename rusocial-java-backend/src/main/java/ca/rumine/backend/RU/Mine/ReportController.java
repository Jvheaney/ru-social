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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ca.rumine.backend.RU.Mine.model.ReportedUser;
import ca.rumine.backend.RU.Mine.model.BlockedUser;
import ca.rumine.backend.RU.Mine.model.ReportedMatch;
import ca.rumine.backend.RU.Mine.model.ReportedProblem;
import ca.rumine.backend.RU.Mine.model.Suggestion;
import ca.rumine.backend.RU.Mine.repository.ReportedUserRepository;
import ca.rumine.backend.RU.Mine.repository.BlockedUserRepository;
import ca.rumine.backend.RU.Mine.repository.ReportedMatchRepository;
import ca.rumine.backend.RU.Mine.repository.ReportedProblemRepository;
import ca.rumine.backend.RU.Mine.repository.SuggestionRepository;

@Controller
@RestController
public class ReportController {
	
	@Autowired
	private ReportedUserRepository reportedUserRepository;
	
	@Autowired
	private ReportedMatchRepository reportedMatchRepository;
	
	@Autowired
	private ReportedProblemRepository reportedProblemRepository;
	
	@Autowired
	private SuggestionRepository suggestionRepository;
	
	@Autowired
	private BlockedUserRepository blockedUserRepository;
	
	@Autowired
	private TokenManager tokenManager;
	
	 Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
    
    @RequestMapping(value = "/gw/r/u", method = RequestMethod.POST)
    public ResponseEntity < String > reportUser(@ModelAttribute ReportedUser ru, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(ru.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
    		 lgr.log(Level.INFO, "[Report User] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else if (ru.getReported_userid() != null) {
    		ru.setSubmission_userid(checkTokenResp[1]);
    		ru.setSubmitted(new Date());
    		reportedUserRepository.save(ru);
   		 	lgr.log(Level.INFO, "[Report User] Returning success for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    	}
    	else {
   		 	lgr.log(Level.SEVERE, "[Report User] Wrong data for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.BAD_REQUEST);
    	}
    }
    
    @RequestMapping(value = "/gw/r/m", method = RequestMethod.POST)
    public ResponseEntity < String > reportMatch(@ModelAttribute ReportedMatch rm, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(rm.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Report Match] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else if (rm.getReported_matchid() != null) {
    		rm.setSubmission_userid(checkTokenResp[1]);
    		rm.setSubmitted(new Date());
    		reportedMatchRepository.save(rm);
   		 	lgr.log(Level.INFO, "[Report Match] Returning success for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    	}
    	else {
   		 	lgr.log(Level.SEVERE, "[Report Match] Wrong data for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.BAD_REQUEST);
    	}
    }
    
    @RequestMapping(value = "/gw/r/p", method = RequestMethod.POST)
    public ResponseEntity < String > reportProblem(@ModelAttribute ReportedProblem rp, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(rp.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Report Problem] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else if (rp.getMessage() != null) {
    		rp.setSubmission_userid(checkTokenResp[1]);
    		rp.setSubmitted(new Date());
    		reportedProblemRepository.save(rp);
   		 	lgr.log(Level.INFO, "[Report Problem] Returning success for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    	}
    	else {
   		 	lgr.log(Level.SEVERE, "[Report Problem] Wrong data for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.BAD_REQUEST);
    	}
    }
    
    @RequestMapping(value = "/gw/r/s", method = RequestMethod.POST)
    public ResponseEntity < String > makeSuggestion(@ModelAttribute Suggestion s, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(s.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Make Suggestion] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else if (s.getMessage() != null) {
    		s.setUserid(checkTokenResp[1]);
    		s.setSubmitted(new Date());
    		suggestionRepository.save(s);
   		 	lgr.log(Level.INFO, "[Make Suggestion] Returning success for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    	}
    	else {
   		 	lgr.log(Level.SEVERE, "[Make Suggestion] Wrong data for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.BAD_REQUEST);
    	}
    }
    
    @RequestMapping(value = "/gw/r/b", method = RequestMethod.POST)
    public ResponseEntity < String > blockUser(@ModelAttribute BlockedUser b, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(b.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Block User] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else if (b.getBlockedid() != null) {
    		b.setUserid(checkTokenResp[1]);
    		b.setTime(new Date());
    		blockedUserRepository.save(b);
    		BlockedUser b1 = new BlockedUser();
    		b1.setUserid(b.getBlockedid());
    		b1.setBlockedid(checkTokenResp[1]);
    		b1.setTime(new Date());
    		blockedUserRepository.save(b1);
   		 	lgr.log(Level.INFO, "[Block User] Returning success for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    	}
    	else {
   		 	lgr.log(Level.SEVERE, "[Block User] Wrong data for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.BAD_REQUEST);
    	}
    }
    
    @RequestMapping(value = "/debug", method = RequestMethod.POST)
    public ResponseEntity < String > remoteDebugger(@RequestParam("message") String message, HttpServletRequest request) {
   		 	lgr.log(Level.INFO, "[Remote Debugger] " + message);
			String tokenResponse = "{\"token\":\"" + "NA" + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    }
}
