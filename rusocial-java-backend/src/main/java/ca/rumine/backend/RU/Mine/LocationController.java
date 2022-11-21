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

import ca.rumine.backend.RU.Mine.model.Location;
import ca.rumine.backend.RU.Mine.repository.LocationRepository;

@Controller
@RestController
public class LocationController {
	
	@Autowired
	private LocationRepository locationRepository;
	
	@Autowired
	private TokenManager tokenManager;
	
    
    @RequestMapping(value = "/gw/l/s", method = RequestMethod.POST)
    public ResponseEntity < String > saveLocation(@ModelAttribute Location location, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(location.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else if (location.getAccuracy() != null && location.getAltitude() != null && location.getLatitude() != null && location.getLongitude() != null) {
    		location.setUserid(checkTokenResp[1]);
    		location.setTime(new Date());
    		locationRepository.save(location);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    	}
    	else {
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    	}
    }
}
