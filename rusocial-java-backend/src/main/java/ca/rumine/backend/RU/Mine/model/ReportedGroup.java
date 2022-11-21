package ca.rumine.backend.RU.Mine.model;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "reported_groups")
public class ReportedGroup {
	private String groupid;
	private String userid;
	private String message;
	private Date submissionTime;
	private Integer uniqid;
	
	public ReportedGroup() {
		
	}
	
	public ReportedGroup(String groupid, String userid, String message, Date submissionTime, Integer uniqid) {
		this.groupid = groupid;
		this.userid = userid;
		this.message = message;
		this.submissionTime = submissionTime;
		this.uniqid = uniqid;
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

	@Column(name = "message", nullable = false)
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@Column(name = "submission_time", nullable = false)
	public Date getSubmissionTime() {
		return submissionTime;
	}

	public void setSubmissionTime(Date submissionTime) {
		this.submissionTime = submissionTime;
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
