package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "reported_posts")
public class ReportedPost {
	private String postid;
	private String userid;
	private Date submissionTime;
	private Integer uniqid;
	
	public ReportedPost() {
		
	}
	
	public ReportedPost(String postid, String userid, Date submissionTime, Integer uniqid) {
		this.postid = postid;
		this.userid = userid;
		this.submissionTime = submissionTime;
		this.uniqid = uniqid;
	}

	@Column(name = "postid", nullable = false)
	public String getPostid() {
		return postid;
	}

	public void setPostid(String postid) {
		this.postid = postid;
	}
	
	@Column(name = "userid", nullable = false)
	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
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
