package ca.rumine.backend.RU.Mine.model;

import org.springframework.data.neo4j.annotation.QueryResult;

@QueryResult 
public class GroupResult {
	public String name;
	public String image;
	public String groupid;
	public Boolean shared;
	public Boolean isGroupAdmin;
	public Boolean isPrivate;
	public Boolean isMember;
	public Integer numberOfMembers;
	
	public GroupResult() {
		
	}
	
	public GroupResult(String name, String image, String groupid) {
		this.name = name;
		this.image = image;
		this.groupid = groupid;
	}
	
	public GroupResult(String name, String image, String groupid, Boolean shared, Boolean isGroupAdmin, Boolean isPrivate, Boolean isMember) {
		this.name = name;
		this.image = image;
		this.groupid = groupid;
		this.shared = shared;
		this.isGroupAdmin = isGroupAdmin;
		this.isPrivate = isPrivate;
		this.isMember = isMember;
	}
	
	public GroupResult(String name, String image, String groupid, Boolean shared) {
		this.name = name;
		this.image = image;
		this.groupid = groupid;
		this.shared = shared;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public String getGroupid() {
		return groupid;
	}
	public void setGroupid(String groupid) {
		this.groupid = groupid;
	}
	public Boolean getShared() {
		return shared;
	}
	public void setShared(Boolean shared) {
		this.shared = shared;
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
	public Boolean getIsMember() {
		return isMember;
	}

	public void setIsMember(Boolean isMember) {
		this.isMember = isMember;
	}

	public Integer getNumberOfMembers() {
		return numberOfMembers;
	}

	public void setNumberOfMembers(Integer numberOfMembers) {
		this.numberOfMembers = numberOfMembers;
	}
	
	
	
}
