package ca.rumine.backend.RU.Mine;

import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import ca.rumine.backend.RU.Mine.model.Reswipe;
import ca.rumine.backend.RU.Mine.model.Swipe;
import ca.rumine.backend.RU.Mine.repository.ReswipeRepository;
import ca.rumine.backend.RU.Mine.repository.SwipeRepository;
import ca.rumine.backend.RU.Mine.manager.SwipeManager;
import ca.rumine.backend.RU.Mine.manager.TimelineManager;

@Controller
@RestController
public class TimelineController {
	
	@Autowired
	private EntityManager em;
	
	@Autowired
	private SwipeRepository swipeRepository;
	
	@Autowired
	private ReswipeRepository reswipeRepository;
	
	@Autowired
	private TokenManager tokenManager;
	
	@Autowired
	private SwipeManager swipeManager;
	
	@Autowired
	private TimelineManager timelineManager;
	
	 Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
    
    @RequestMapping(value = "/gw/t/g/{offset}", method = RequestMethod.POST)
    public ResponseEntity < String > getTimeline(@PathVariable(value ="offset") String offset, @ModelAttribute Swipe s, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(s.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
    		 lgr.log(Level.INFO, "[Get Timeline] User told signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else{
    		try {
        		String timeline = timelineManager.getTimeline(checkTokenResp[1], Integer.parseInt(offset));
       		 	lgr.log(Level.INFO, "[Get Timeline] Returning timeline to user: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":" + timeline + "}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
                if(e.getMessage().equals("No entity found for query")) {
           		 	lgr.log(Level.WARNING, "[Get Timeline] User told signout with user: " + checkTokenResp[1]);
            		String tokenResponse = "\"logout\"";
                	return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
                }
       		 	lgr.log(Level.SEVERE, "[Get Timeline] Server Error for user: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/t/s", method = RequestMethod.POST)
    public ResponseEntity < String > saveSwipe(@ModelAttribute Swipe s, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(s.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Save Swipe] User told signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else if(s.getLiked() == null || s.getSwipeid() == null) {
   		 	lgr.log(Level.WARNING, "[Save Swipe] Wrong data with user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.BAD_REQUEST);
    	}
    	else{
    		String result = "";
    		if(s.getLiked()) {
    			s.setUserid(checkTokenResp[1]);
    			s.setTime(new Date());
    			try {
    				swipeRepository.save(s);
				}
				catch(DataIntegrityViolationException ex) {
					//if the userid and swipeid has already been entered
					try {
						swipeRepository.updateSwipeHistory(s.getSwipeid(), s.getUserid(), s.getLiked());
						swipeRepository.saveReswipe(s.getUserid(), s.getSwipeid(), s.getLiked());
						//swipeRepository.incrementSwipe();
					}
					catch(Exception e) {
			   		 	lgr.log(Level.INFO, "[Save Swipe] (!) Returning success with user: " + checkTokenResp[1]);
						String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
			        	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
					}
		    		
				}
        		result = swipeManager.checkMatch(s);
    		}
    		else {
    			s.setUserid(checkTokenResp[1]);
    			s.setTime(new Date());
    			try {
        			swipeRepository.save(s);
    			}
    			catch(DataIntegrityViolationException ex) {
    				//Reswipe rs = new Reswipe();
    				//if the userid and swipeid has already been entered
    				//swipeManager.updateSwipeHistory(s.getSwipeid(), s.getUserid(), s.getLiked());
    				swipeRepository.updateSwipeHistory(s.getSwipeid(), s.getUserid(), s.getLiked());
    				//rs.setLiked(s.getLiked());
    				//rs.setSwipeid(s.getSwipeid());
    				//rs.setUserid(checkTokenResp[1]);
        			//rs.setTime(new Date());
    				//reswipeRepository.save(rs);
					swipeRepository.saveReswipe(s.getUserid(), s.getSwipeid(), s.getLiked());
    				//swipeRepository.incrementSwipe();
    			}
    			result = "success";
    		}
   		 	lgr.log(Level.INFO, "[Save Swipe] Returning success with user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"" + result + "\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    	}
    }
    
}
