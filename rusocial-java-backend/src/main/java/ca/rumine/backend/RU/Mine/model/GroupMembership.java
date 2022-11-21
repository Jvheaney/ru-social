package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "group_membership")
public class GroupMembership {
	private String groupid;
	private String userid;
	private Boolean postNotifs;
	private Boolean chatNotifs;
	private Boolean isActive;
	private Date time_joined;
	private Integer uniqid;
	
	public GroupMembership() {
		
	}
	
	public GroupMembership(String groupid, String userid, Boolean postNotifs, Boolean chatNotifs, Boolean isActive, Date time_joined){
		this.groupid = groupid;
		this.userid = userid;
		this.postNotifs = postNotifs;
		this.chatNotifs = chatNotifs;
		this.isActive = isActive;
		this.time_joined = time_joined;
	}
	
	@Column(name = "groupid", nullable = false)
	public String getGroupid() {
		return groupid;
	}

	public void setGroupid(String groupid) {
		this.groupid = groupid;
	}

	@Column(name = "userid", nullable = false)
	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	@Column(name = "post_notifs_enabled", nullable = false)
	public Boolean getPostNotifs() {
		return postNotifs;
	}

	public void setPostNotifs(Boolean postNotifs) {
		this.postNotifs = postNotifs;
	}

	@Column(name = "chat_notifs_enabled", nullable = false)
	public Boolean getChatNotifs() {
		return chatNotifs;
	}

	public void setChatNotifs(Boolean chatNotifs) {
		this.chatNotifs = chatNotifs;
	}

	@Column(name = "isactive", nullable = false)
	public Boolean getIsActive() {
		return isActive;
	}

	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}

	@Column(name = "time_joined", nullable = false)
	public Date getTime_joined() {
		return time_joined;
	}

	public void setTime_joined(Date time_joined) {
		this.time_joined = time_joined;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "uniqid", nullable = false)
	public Integer getUniqid() {
		return uniqid;
	}

	public void setUniqid(Integer uniqid) {
		this.uniqid = uniqid;
	}
	
	
	
	
	
}
