package ca.rumine.backend.RU.Mine;


import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@EnableAutoConfiguration
@SpringBootApplication
public class RuMineApplication implements ErrorController {
	
	private static final String PATH = "/error";
	
	@RequestMapping("/")
    String index() {
        return "Error, that's all we know.";
    }
	
	@RequestMapping(value = PATH)
    public String error() {
        return "Error, that's all we know.";
    }

	public static void main(String[] args) {
		SpringApplication.run(RuMineApplication.class, args);
   	 	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
		lgr.setLevel(Level.INFO);
	}

	@Override
	public String getErrorPath() {
		
		return PATH;
	}

}
