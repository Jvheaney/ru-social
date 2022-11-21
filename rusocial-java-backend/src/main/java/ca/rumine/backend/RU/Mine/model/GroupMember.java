package ca.rumine.backend.RU.Mine.model;

import org.springframework.data.neo4j.annotation.QueryResult;

@QueryResult 
public class GroupMember {
	public String first_name;
	public String last_name;
	public String userid;
	public String profile_picture;
	
	public GroupMember() {
		
	}
	
	public GroupMember(String first_name, String last_name, String userid, String profile_picture) {
		this.first_name = first_name;
		this.last_name = last_name;
		this.userid = userid;
		this.profile_picture = profile_picture;
	}
	
	public String getFirst_name() {
		return first_name;
	}
	public void setFirst_name(String first_name) {
		this.first_name = first_name;
	}
	public String getLast_name() {
		return last_name;
	}
	public void setLast_name(String last_name) {
		this.last_name = last_name;
	}
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	public String getProfile_picture() {
		return profile_picture;
	}
	public void setProfile_picture(String profile_picture) {
		this.profile_picture = profile_picture;
	}
}
