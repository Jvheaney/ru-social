package ca.rumine.analythics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AnalythicsApplication {

	public static void main(String[] args) {
		SpringApplication.run(AnalythicsApplication.class, args);
	}

}
