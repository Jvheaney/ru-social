package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "matches")
public class Match {
	private String matchid;
	private String userid_1;
	private String userid_2;
	private Date time;
	private Boolean isActive;
	private Integer type;
	
	public Match() {
		
	}
	
	
	public Match(String matchid, String userid_1, String userid_2, Date time, Boolean isActive, Integer type) {
		this.matchid = matchid;
		this.userid_1 = userid_1;
		this.userid_2 = userid_2;
		this.time = time;
		this.isActive = isActive;
		this.type = type;
	}



	@Id
	@Column(name = "matchid", nullable = false)
	public String getMatchid() {
		return matchid;
	}
	public void setMatchid(String matchid) {
		this.matchid = matchid;
	}
	
	@Column(name = "userid_1", nullable = false)
	public String getUserid_1() {
		return userid_1;
	}
	public void setUserid_1(String userid_1) {
		this.userid_1 = userid_1;
	}
	
	@Column(name = "userid_2", nullable = false)
	public String getUserid_2() {
		return userid_2;
	}
	public void setUserid_2(String userid_2) {
		this.userid_2 = userid_2;
	}
	
	@Column(name = "time", nullable = false)
	public Date getTime() {
		return time;
	}
	public void setTime(Date time) {
		this.time = time;
	}
	
	@Column(name = "isactive", nullable = false)
	public Boolean getIsActive() {
		return isActive;
	}
	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}
	
	@Column(name = "type", nullable = false)
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	
	
}
