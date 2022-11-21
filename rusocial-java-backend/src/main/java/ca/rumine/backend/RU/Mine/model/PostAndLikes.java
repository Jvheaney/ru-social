package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import org.springframework.data.neo4j.annotation.QueryResult;

@QueryResult 
public class PostAndLikes {
	public String name;
	public Integer shares;
	public Integer comments;
	public Integer likes;
	public String first_name;
	public String last_name;
	public String profile_picture;
	public String groupid;
	public String postid;
	public String userid;
	public String[] media;
	public String text;
	public Boolean isPrivate;
	public Boolean liked;
	public Boolean allowComments;
	public Boolean allowSharing;
	public CommentsAndLikes[] comment;
	public Long time_submitted;
	public Integer type;
	public Boolean isMine;
	
	public PostAndLikes() {
		
	}
	public PostAndLikes(String name, Integer shares, Integer comments, Integer likes, String first_name, String last_name,
			String profile_picture, String postid, String userid, String[] media, String text, Boolean isPrivate,
			Boolean liked, CommentsAndLikes[] comment, Long time_submitted, Integer type, Boolean isMine, String groupid, Boolean allowComments, Boolean allowSharing) {
		this.name = name;
		this.shares = shares;
		this.comments = comments;
		this.likes = likes;
		this.first_name = first_name;
		this.last_name = last_name;
		this.profile_picture = profile_picture;
		this.postid = postid;
		this.userid = userid;
		this.media = media;
		this.text = text;
		this.isPrivate = isPrivate;
		this.liked = liked;
		this.comment = comment;
		this.time_submitted = time_submitted;
		this.type = type;
		this.isMine = isMine;
		this.groupid = groupid;
		this.allowComments = allowComments;
		this.allowSharing = allowSharing;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getShares() {
		return shares;
	}
	public void setShares(Integer shares) {
		this.shares = shares;
	}
	public Integer getComments() {
		return comments;
	}
	public void setComments(Integer comments) {
		this.comments = comments;
	}
	public Integer getLikes() {
		return likes;
	}
	public void setLikes(Integer likes) {
		this.likes = likes;
	}
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
	public String getProfile_picture() {
		return profile_picture;
	}
	public void setProfile_picture(String profile_picture) {
		this.profile_picture = profile_picture;
	}
	public String getPostid() {
		return postid;
	}
	public void setPostid(String postid) {
		this.postid = postid;
	}
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	public String[] getMedia() {
		return media;
	}
	public void setMedia(String[] media) {
		this.media = media;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public Boolean getIsPrivate() {
		return isPrivate;
	}
	public void setIsPrivate(Boolean isPrivate) {
		this.isPrivate = isPrivate;
	}
	public Boolean getLiked() {
		return liked;
	}
	public void setLiked(Boolean liked) {
		this.liked = liked;
	}
	public CommentsAndLikes[] getComment() {
		return comment;
	}
	public void setComment(CommentsAndLikes[] comment) {
		this.comment = comment;
	}
	public Long getTime_submitted() {
		return time_submitted;
	}
	public void setTime_submitted(Long time_submitted) {
		this.time_submitted = time_submitted;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public Boolean getIsMine() {
		return isMine;
	}
	public void setIsMine(Boolean isMine) {
		this.isMine = isMine;
	}
	public String getGroupid() {
		return groupid;
	}
	public void setGroupid(String groupid) {
		this.groupid = groupid;
	}
	public Boolean getAllowComments() {
		return allowComments;
	}
	public void setAllowComments(Boolean allowComments) {
		this.allowComments = allowComments;
	}
	public Boolean getAllowSharing() {
		return allowSharing;
	}
	public void setAllowSharing(Boolean allowSharing) {
		this.allowSharing = allowSharing;
	}
	
	
	
	
}