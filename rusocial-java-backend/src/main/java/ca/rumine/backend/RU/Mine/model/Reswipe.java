package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;


@Entity
@Table(name = "reswipe_history")
public class Reswipe {
	@Transient String token;
	private String userid;
	private String swipeid; //Id of user that was liked or skipped
	private Boolean liked;
	private Integer uniqid;
	private Date time;
	
	public Reswipe() {
		
	}
	
	public Reswipe(String token, String userid, String swipeid, Boolean liked, Integer uniqid, Date time) {
		this.token = token;
		this.userid = userid;
		this.swipeid = swipeid;
		this.liked = liked;
		this.uniqid = uniqid;
		this.time = time;
	}
	
	@Transient
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "uniqid", nullable = false)
	public Integer getUniqid() {
		return this.uniqid;
	}
	public void setUniqid(Integer uniqid) {
		this.uniqid = uniqid;
	}
	
	@Column(name = "userid", nullable = false)
	public String getUserid() {
		return this.userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}

	@Column(name = "swipeid", nullable = false)
	public String getSwipeid() {
		return this.swipeid;
	}
	public void setSwipeid(String swipeid) {
		this.swipeid = swipeid;
	}
	
	@Column(name = "liked", nullable = false)
	public Boolean getLiked() {
		return this.liked;
	}
	public void setLiked(Boolean liked) {
		this.liked = liked;
	}
	
	@Column(name = "time", nullable = false)
	public Date getTime() {
		return this.time;
	}
	public void setTime(Date time) {
		this.time = time;
	}
	
	
}
