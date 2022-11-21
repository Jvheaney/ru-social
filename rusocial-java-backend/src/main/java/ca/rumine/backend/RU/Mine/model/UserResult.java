package ca.rumine.backend.RU.Mine.model;

import org.springframework.data.neo4j.annotation.QueryResult;

@QueryResult 
public class UserResult {
	public String userid;
	public String first_name;
	public String last_name;
	public Boolean friends;
	public Boolean blocked;
	public Boolean requested;
	public String bio;
	public String name;
	public String[] mutualFriends;
	public String profile_picture;
	public Boolean created; //Only used for a few queries
	
	public UserResult() {
		
	}
	
	public UserResult(String userid, String first_name, String last_name, Boolean friends, Boolean blocked, Boolean requested, String bio, String name, String[] mutualFriends, String profile_picture, Boolean created) {
		this.userid = userid;
		this.first_name = first_name;
		this.last_name = last_name;
		this.friends = friends;
		this.blocked = blocked;
		this.requested = requested;
		this.bio = bio;
		this.name = name;
		this.mutualFriends = mutualFriends;
		this.profile_picture = profile_picture;
		this.created = created;
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

	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String[] getMutualFriends() {
		return mutualFriends;
	}
	public void setMutualFriends(String[] mutualFriends) {
		this.mutualFriends = mutualFriends;
	}
	public String getProfile_picture() {
		return profile_picture;
	}
	public void setProfile_picture(String profile_picture) {
		this.profile_picture = profile_picture;
	}

	public Boolean getBlocked() {
		return blocked;
	}

	public void setBlocked(Boolean blocked) {
		this.blocked = blocked;
	}
	
	public Boolean getCreated() {
		return created;
	}
	
	public void setCreated(Boolean created) {
		this.created = created;
	}
	
	
	
}