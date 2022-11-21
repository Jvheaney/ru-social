package ca.rumine.backend.RU.Mine.model;

public class LikePostComment {
	public String token;
	public String postid;
	public String commentid;
	
	
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public String getPostid() {
		return postid;
	}
	public void setPostid(String postid) {
		this.postid = postid;
	}
	public String getCommentid() {
		return commentid;
	}
	public void setCommentid(String commentid) {
		this.commentid = commentid;
	}
	
	public LikePostComment() {
		
	}
	
	public LikePostComment(String token, String postid, String commentid) {
		super();
		this.token = token;
		this.postid = postid;
		this.commentid = commentid;
	}
	
	
}
