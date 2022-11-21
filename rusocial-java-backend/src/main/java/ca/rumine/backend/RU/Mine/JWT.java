package ca.rumine.backend.RU.Mine;

public class JWT {
	private String token;
	
	public JWT(String token) {
		this.token = token;
	}
	
	public String getJWT() {
		return this.token;
	}
	
	public void setJWT(String token) {
		this.token = token;
	}
}
