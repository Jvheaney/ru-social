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
@Table(name = "suggestions")
public class Suggestion {
	@Transient String token;
	private String userid;
	private String message;
	private Date submitted;
	private Integer suggestion_id;
	
	public Suggestion() {
		
	}
	
	public Suggestion(String token, String userid, String message, Date submitted, Integer suggestion_id) {
		this.token = token;
		this.userid = userid;
		this.message = message;
		this.submitted = submitted;
		this.suggestion_id = suggestion_id;
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
	@Column(name = "suggestion_id", nullable = false)
	public Integer getSuggestion_id() {
		return this.suggestion_id;
	}
	public void setSuggestion_id(Integer suggestion_id) {
		this.suggestion_id = suggestion_id;
	}
	
	@Column(name = "userid", nullable = false)
	public String getUserid() {
		return this.userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	
	@Column(name = "message", nullable = false)
	public String getMessage() {
		return this.message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	@Column(name = "submitted", nullable = false)
	public Date getSubmitted() {
		return this.submitted;
	}
	public void setSubmitted(Date submitted) {
		this.submitted = submitted;
	}
	
}
