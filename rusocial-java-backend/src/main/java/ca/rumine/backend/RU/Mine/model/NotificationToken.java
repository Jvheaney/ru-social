package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "notification_tokens")
public class NotificationToken {
	@Transient String token;
	private String userid;
	private String notif_token;
	
	public NotificationToken() {
		
	}
	
	public NotificationToken(String token, String userid, String notif_token) {
		this.token = token;
		this.userid = userid;
		this.notif_token = notif_token;
	}
	
	@Transient
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	
	@Id
	@Column(name = "userid", nullable = false)
	public String getUserid() {
		return this.userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}

	@Column(name = "notification_token", nullable = false)
	public String getNotif_token() {
		return this.notif_token;
	}
	public void setNotif_token(String notif_token) {
		this.notif_token = notif_token;
	}
	
	
}
