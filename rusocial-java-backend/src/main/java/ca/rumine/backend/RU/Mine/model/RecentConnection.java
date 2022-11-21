package ca.rumine.backend.RU.Mine.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "recent_connections")
public class RecentConnection {
	private String userid;
	private String connection_userid;
	private Integer type;
	private Integer uniqid;
	
	public RecentConnection() {
		
	}
	
	public RecentConnection(String userid, String connection_userid, Integer type) {
		this.userid = userid;
		this.connection_userid = connection_userid;
		this.type = type;
	}
	
	public RecentConnection(String userid, String connection_userid, Integer type, Integer uniqid) {
		this.userid = userid;
		this.connection_userid = connection_userid;
		this.type = type;
		this.uniqid = uniqid;
	}

	@Column(name = "userid", nullable = false)
	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	@Column(name = "connection_userid", nullable = false)
	public String getConnection_userid() {
		return connection_userid;
	}

	public void setConnection_userid(String connection_userid) {
		this.connection_userid = connection_userid;
	}

	@Column(name = "type", nullable = false)
	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
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
