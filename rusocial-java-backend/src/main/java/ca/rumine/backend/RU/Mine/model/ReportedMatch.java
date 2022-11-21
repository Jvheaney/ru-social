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
@Table(name = "reported_matches")
public class ReportedMatch {
	@Transient String token;
	private String submission_userid;
	private String reported_matchid;
	private String message;
	private Date submitted;
	private Integer reported_match_id;
	
	public ReportedMatch() {
		
	}
	
	public ReportedMatch(String token, String submission_userid, String reported_matchid, String message, Date submitted, Integer reported_match_id) {
		this.token = token;
		this.submission_userid = submission_userid;
		this.reported_matchid = reported_matchid;
		this.message = message;
		this.submitted = submitted;
		this.reported_match_id = reported_match_id;
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
	@Column(name = "reported_match_id", nullable = false)
	public Integer getReported_match_id() {
		return this.reported_match_id;
	}
	public void setReported_match_id(Integer reported_match_id) {
		this.reported_match_id = reported_match_id;
	}
	
	@Column(name = "submission_userid", nullable = false)
	public String getSubmission_userid() {
		return this.submission_userid;
	}
	public void setSubmission_userid(String submission_userid) {
		this.submission_userid = submission_userid;
	}
	
	@Column(name = "reported_matchid", nullable = false)
	public String getReported_matchid() {
		return this.reported_matchid;
	}
	public void setReported_matchid(String reported_matchid) {
		this.reported_matchid = reported_matchid;
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
