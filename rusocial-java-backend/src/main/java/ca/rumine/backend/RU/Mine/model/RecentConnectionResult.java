package ca.rumine.backend.RU.Mine.model;

public class RecentConnectionResult {
	private String firstname_display;
	private String userid;
	private String image0;
	private String type;
	
	public RecentConnectionResult() {
		
	}
	
	public RecentConnectionResult(String firstname_display, String userid, String image0, String type) {
		this.firstname_display = firstname_display;
		this.userid = userid;
		this.image0 = image0;
		this.type = type;
	}

	public String getFirstname_display() {
		return firstname_display;
	}

	public void setFirstname_display(String firstname_display) {
		this.firstname_display = firstname_display;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getImage0() {
		return image0;
	}

	public void setImage0(String image0) {
		this.image0 = image0;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	
}
