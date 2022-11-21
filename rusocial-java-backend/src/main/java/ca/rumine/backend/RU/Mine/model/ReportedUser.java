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
@Table(name = "reported_users")
public class ReportedUser {
	@Transient String token;
	private String submission_userid;
	private String reported_userid;
	private String message;
	private Date submitted;
	private Integer reported_user_id;
	
	public ReportedUser() {
		
	}
	
	public ReportedUser(String token, String submission_userid, String reported_userid, String message, Date submitted, Integer reported_user_id) {
		this.token = token;
		this.submission_userid = submission_userid;
		this.reported_userid = reported_userid;
		this.message = message;
		this.submitted = submitted;
		this.reported_user_id = reported_user_id;
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
	@Column(name = "reported_user_id", nullable = false)
	public Integer getReported_user_id() {
		return this.reported_user_id;
	}
	public void setReported_user_id(Integer reported_user_id) {
		this.reported_user_id = reported_user_id;
	}
	
	@Column(name = "submission_userid", nullable = false)
	public String getSubmission_userid() {
		return this.submission_userid;
	}
	public void setSubmission_userid(String submission_userid) {
		this.submission_userid = submission_userid;
	}
	
	@Column(name = "reported_userid", nullable = false)
	public String getReported_userid() {
		return this.reported_userid;
	}
	public void setReported_userid(String reported_userid) {
		this.reported_userid = reported_userid;
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
