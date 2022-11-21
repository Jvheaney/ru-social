package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import org.springframework.data.neo4j.annotation.QueryResult;

@QueryResult 
public class CommentsAndLikes {
	public String first_name;
	public String last_name;
	public String userid;
	public String profile_picture;
	public Long time_submitted;
	public String text;
	public String commentid;
	public Integer likes;
	public Boolean liked;
	public Boolean deleted;
	public Boolean isMine;
	
	public String getFirst_name() {
		return first_name;
	}
	public void setFirst_name(String first_name) {
		this.first_name = first_name;
	}
	public String getLast_name() {
		return last_name;
	}
	public void setLast_name(String last_name) {
		this.last_name = last_name;
	}
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	public String getProfile_picture() {
		return profile_picture;
	}
	public void setProfile_picture(String profile_picture) {
		this.profile_picture = profile_picture;
	}
	public Long getTime_submitted() {
		return time_submitted;
	}
	public void setTime_submitted(Long time_submitted) {
		this.time_submitted = time_submitted;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getCommentid() {
		return commentid;
	}
	public void setCommentid(String commentid) {
		this.commentid = commentid;
	}
	public Integer getlikes() {
		return likes;
	}
	public void setlikes(Integer likes) {
		this.likes = likes;
	}
	
	public Integer getLikes() {
		return likes;
	}
	public void setLikes(Integer likes) {
		this.likes = likes;
	}
	public Boolean getLiked() {
		return liked;
	}
	public void setLiked(Boolean liked) {
		this.liked = liked;
	}
	
	public Boolean getDeleted() {
		return deleted;
	}
	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}
	public Boolean getIsMine() {
		return isMine;
	}
	public void setIsMine(Boolean isMine) {
		this.isMine = isMine;
	}
	public CommentsAndLikes() {
		
	}
	
	public CommentsAndLikes(String first_name, String last_name, String userid, String profile_picture,
			Long time_submitted, String text, String commentid, Integer likes, Boolean deleted, Boolean isMine) {
		this.first_name = first_name;
		this.last_name = last_name;
		this.userid = userid;
		this.profile_picture = profile_picture;
		this.time_submitted = time_submitted;
		this.text = text;
		this.commentid = commentid;
		this.likes = likes;
		this.deleted = deleted;
		this.isMine = isMine;
	}
	
	
}
