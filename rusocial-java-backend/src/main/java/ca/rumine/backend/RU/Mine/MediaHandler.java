package ca.rumine.backend.RU.Mine;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import ca.rumine.backend.RU.Mine.manager.MediaManager;
import ca.rumine.backend.RU.Mine.TokenManager;

@Controller
@RestController
public class MediaHandler {
	
	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
	
	@Autowired
	private TokenManager tokenManager;
	
	@Autowired
	private MediaManager mediaManager;
	
	@RequestMapping(value = "/media/upload", method = RequestMethod.POST)
    public ResponseEntity < String > uploadMedia(@RequestParam("token") String token, @RequestParam("imageFile") MultipartFile imageFile, HttpServletRequest request) {
		Gson gson = new Gson();
    	String ip = request.getRemoteAddr();
    	String[] result = tokenManager.checkToken(token, ip);
    	
    	try {
    		
    		if(result[1].equals("logout")) {
				lgr.log(Level.INFO, "[Upload Media Handler] User told to logout with id: " + result[1]);
    			return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    		}
    		
			byte[] imageBytes = imageFile.getBytes();
			
			String format = mediaManager.getFormat(imageBytes, imageFile.getOriginalFilename());
			
			if(!mediaManager.isValidFormat(format)) {
				lgr.log(Level.INFO, "[Upload Media Handler] Invalid format with user: " + result[1]);
	    		String tokenResponse = "{\"token\":\"" + result[0] + "\", \"status\":\"" + "dataerror" + "\"}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.BAD_REQUEST);
			}
			else {
				String reference = mediaManager.saveMedia(imageBytes, result[1], ip, format, 1);
				
				lgr.log(Level.INFO, "[Upload Media Handler] Returning success with user: " + result[1]);
	    		String tokenResponse = "{\"token\":\"" + result[0] + "\", \"status\":\"" + reference + "\"}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
			}
    		
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		String tokenResponse = "{\"token\":\"" + result[0] + "\", \"status\":\"" + "dataerror" + "\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.BAD_REQUEST);
    	}
		
	}
	
	@RequestMapping(value = "/media/artwork/upload", method = RequestMethod.POST)
    public ResponseEntity < String > uploadArtwork(@RequestParam("imageFile") MultipartFile imageFile, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	
    	try {
    		
			byte[] imageBytes = imageFile.getBytes();
			
			String format = mediaManager.getFormat(imageBytes, imageFile.getOriginalFilename());
			
			if(!mediaManager.isValidFormat(format)) {
				lgr.log(Level.INFO, "[Upload Media Handler] Invalid format with ip: " + ip);
	    		String tokenResponse = "{\"status\":\"" + "dataerror" + "\"}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.BAD_REQUEST);
			}
			else {
				String reference = mediaManager.saveMedia(imageBytes, "artwork-contest", ip, format, 1);
				
				lgr.log(Level.INFO, "[Upload Media Handler] Returning success with ip: " + ip);
	    		String tokenResponse = "{\"status\":\"" + reference + "\"}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
			}
    		
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		String tokenResponse = "{\"status\":\"" + "dataerror" + "\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.BAD_REQUEST);
    	}
		
	}


}
