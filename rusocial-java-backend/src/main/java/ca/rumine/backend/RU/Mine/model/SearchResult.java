package ca.rumine.backend.RU.Mine.model;

import org.springframework.data.neo4j.annotation.QueryResult;

@QueryResult 
public class SearchResult {
	private String firstname_display;
	private String lastname;
	private String userid;
	private String image0;
	private Boolean friends;
	private Boolean requested;
	private Integer type;
	private String name;
	private String groupid;
	private String image;
	private Boolean isMember;
	private Boolean isGroupAdmin;
	private Boolean isPrivate;
	
	public SearchResult() {
		
	}

	public String getFirstname_display() {
		return firstname_display;
	}

	public void setFirstname_display(String firstname_display) {
		this.firstname_display = firstname_display;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
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

	public Boolean getFriends() {
		return friends;
	}

	public void setFriends(Boolean friends) {
		this.friends = friends;
	}

	public Boolean getRequested() {
		return requested;
	}

	public void setRequested(Boolean requested) {
		this.requested = requested;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
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

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public Boolean getIsMember() {
		return isMember;
	}

	public void setIsMember(Boolean isMember) {
		this.isMember = isMember;
	}

	public Boolean getIsGroupAdmin() {
		return isGroupAdmin;
	}

	public void setIsGroupAdmin(Boolean isGroupAdmin) {
		this.isGroupAdmin = isGroupAdmin;
	}

	public Boolean getIsPrivate() {
		return isPrivate;
	}

	public void setIsPrivate(Boolean isPrivate) {
		this.isPrivate = isPrivate;
	}
	
	
	
	
	
	
	
}
