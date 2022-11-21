package ca.rumine.backend.RU.Mine.model;

public class SharePost {
	public String token;
	public String groupid;
	public String postid;
	
	public SharePost() {
		
	}
	
	public SharePost(String token, String groupid, String postid) {
		this.token = token;
		this.groupid = groupid;
		this.postid = postid;
	}
	
	
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public String getGroupid() {
		return groupid;
	}
	public void setGroupid(String groupid) {
		this.groupid = groupid;
	}
	public String getPostid() {
		return postid;
	}
	public void setPostid(String postid) {
		this.postid = postid;
	}
	
	
}
