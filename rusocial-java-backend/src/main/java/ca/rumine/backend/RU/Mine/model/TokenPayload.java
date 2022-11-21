package ca.rumine.backend.RU.Mine.model;

public class TokenPayload {
	
	private String email;
	private String firstname;
	private String lastname;
	
	public TokenPayload() {
		
	}
	
	public TokenPayload(String email, String firstname, String lastname) {
		this.email = email;
		this.firstname = firstname;
		this.lastname = lastname;
	}
	
	public String getEmail() {
		return this.email;
	}
	
	public String getFirstName() {
		return this.firstname;
	}
	
	public String getLastName() {
		return this.lastname;
	}

}
