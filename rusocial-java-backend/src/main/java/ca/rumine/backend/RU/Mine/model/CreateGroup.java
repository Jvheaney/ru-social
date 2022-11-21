package ca.rumine.backend.RU.Mine.model;

public class CreateGroup {
	public String token;
	public String name;
	public Boolean isPrivate;
	public Boolean isAnon;
	public String friends;
	public String image;
	
	public CreateGroup() {
		
	}
	
	public CreateGroup(String token, String name, Boolean isPrivate, String friends, Boolean isAnon, String image) {
		this.token = token;
		this.name = name;
		this.isPrivate = isPrivate;
		this.friends = friends;
		this.isAnon = isAnon;
		this.image = image;
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

	public Boolean getIsPrivate() {
		return isPrivate;
	}

	public void setIsPrivate(Boolean isPrivate) {
		this.isPrivate = isPrivate;
	}
	
	public Boolean getIsAnon() {
		return isAnon;
	}

	public void setIsAnon(Boolean isAnon) {
		this.isAnon = isAnon;
	}

	public String getFriends() {
		return friends;
	}

	public void setFriends(String friends) {
		this.friends = friends;
	}
	
	public String getImage() {
		return image;
	}
	
	public void setImage(String image) {
		this.image = image;
	}
}