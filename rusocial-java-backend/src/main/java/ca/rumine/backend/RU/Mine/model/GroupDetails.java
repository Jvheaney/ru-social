package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "group_details")
public class GroupDetails {
	private String groupid;
	private String name;
	private String image;
	private Boolean isActive;
	
	public GroupDetails() {
		
	}
	
	public GroupDetails(String groupid, String name, String image, Boolean isActive){
		this.groupid = groupid;
		this.name = name;
		this.image = image;
		this.isActive = isActive;
	}
	
	@Id
	@Column(name = "groupid", nullable = false)
	public String getGroupid() {
		return groupid;
	}

	public void setGroupid(String groupid) {
		this.groupid = groupid;
	}

	@Column(name = "name", nullable = false)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "image", nullable = false)
	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	@Column(name = "isactive", nullable = false)
	public Boolean getIsActive() {
		return isActive;
	}

	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}
	
}
