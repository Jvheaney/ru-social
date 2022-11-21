package ca.rumine.backend.RU.Mine.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.Date;

@Entity
@Table(name = "blocked_users")
public class BlockedUser {
	@Transient String token;
	private String userid;
	private String blockedid;
	private Date time;
	private Integer block_num;
	
	public BlockedUser() {
		
	}
	
	public BlockedUser(String token, String userid, String blockedid, Date time, Integer block_num) {
		this.token = token;
		this.userid = userid;
		this.blockedid = blockedid;
		this.time = time;
		this.block_num = block_num;
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
	@Column(name = "block_num", nullable = false)
	public Integer getBlock_num() {
		return this.block_num;
	}
	public void setBlock_num(Integer block_num) {
		this.block_num = block_num;
	}
	
	@Column(name = "userid", nullable = false)
	public String getUserid() {
		return this.userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	
	@Column(name = "blockedid", nullable = false)
	public String getBlockedid() {
		return this.blockedid;
	}
	public void setBlockedid(String blockedid) {
		this.blockedid = blockedid;
	}
	
	@Column(name = "time", nullable = false)
	public Date getTime() {
		return this.time;
	}
	public void setTime(Date time) {
		this.time = time;
	}
}
