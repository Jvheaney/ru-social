package ca.rumine.analythics.controllers;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;

import ca.rumine.analythics.models.ReportingAnalytics;
import ca.rumine.analythics.repositories.ReportingAnalyticsRepository;


@Controller
@RestController
public class AnalyticsController {
	
	@Autowired
	private ReportingAnalyticsRepository rar;
	
	@RequestMapping(value = "/fetch/{days}", method = RequestMethod.GET)
    public ResponseEntity < String > getConversation(@PathVariable(value ="days") Integer days, HttpServletRequest request) {
    	Logger lgr = Logger.getLogger(AnalyticsController.class.getName());
    	String ip = request.getRemoteAddr();
    	if(!ip.equals("127.0.0.1")) {
    		lgr.log(Level.INFO, "[Fetch Analytics] Not local IP, rejecting request for ip: " + ip);
            return new ResponseEntity<String>("fail", HttpStatus.CREATED);
    	}
    	lgr.log(Level.INFO, "[Fetch Analytics] Got request for " + days + " days.");
    	
    	//Get today's date
    	Calendar c = new GregorianCalendar();
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.add(Calendar.DATE, -1*days);
        c.add(Calendar.MINUTE, -1);
        Date fromDate = c.getTime();
        
        //Fetch data from database
        List<ReportingAnalytics> reports = rar.getReportingAnalytics(fromDate);
        
        //Set to JSON
        Gson gson = new Gson();
        
    	lgr.log(Level.INFO, "[Fetch Analytics] Returned data.");
        return new ResponseEntity<String>(gson.toJson(reports), HttpStatus.CREATED);
    }
	
	@RequestMapping(value = "/debugger", method = RequestMethod.POST)
    public ResponseEntity < String > remoteDebugger(@ModelAttribute("debug_statement") String debugString, HttpServletRequest request) {
    	Logger lgr = Logger.getLogger(AnalyticsController.class.getName());
    	String ip = request.getRemoteAddr();
    	lgr.log(Level.INFO, "[Remote Debugger] Got request from IP: " + ip);
    	
        //Send data to debug string to database
        rar.addDebugData(debugString);
        
    	lgr.log(Level.INFO, "[Remote Debugger] Saved data.");
        return new ResponseEntity<String>("success", HttpStatus.CREATED);
    }

}
