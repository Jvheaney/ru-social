package ca.rumine.backend.RU.Mine.model;

public class EditGroup {
	public String token;
	public String name;
	public String groupid;
	
	public EditGroup() {
		
	}
	
	public EditGroup(String token, String name, String groupid) {
		this.token = token;
		this.name = name;
		this.groupid = groupid;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getGroupid() {
		return groupid;
	}

	public void setGroupid(String groupid) {
		this.groupid = groupid;
	}
	
	
}
