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
@Table(name = "reported_problems")
public class ReportedProblem {
	@Transient String token;
	private String submission_userid;
	private String message;
	private Date submitted;
	private Integer reported_problem_id;
	
	public ReportedProblem() {
		
	}
	
	public ReportedProblem(String token, String submission_userid, String message, Date submitted, Integer reported_problem_id) {
		this.token = token;
		this.submission_userid = submission_userid;
		this.message = message;
		this.submitted = submitted;
		this.reported_problem_id = reported_problem_id;
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
	@Column(name = "reported_problem_id", nullable = false)
	public Integer getReported_problem_id() {
		return this.reported_problem_id;
	}
	public void setReported_problem_id(Integer reported_problem_id) {
		this.reported_problem_id = reported_problem_id;
	}
	
	@Column(name = "submission_userid", nullable = false)
	public String getSubmission_userid() {
		return this.submission_userid;
	}
	public void setSubmission_userid(String submission_userid) {
		this.submission_userid = submission_userid;
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
