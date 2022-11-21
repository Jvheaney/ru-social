package ca.rumine.backend.RU.Mine.model;

public class CreateComment {
	public String token;
	public String text;
	public String postid;
	
	public CreateComment() {
		
	}
	
	public CreateComment(String token, String text, String postid) {
		this.token = token;
		this.text = text;
		this.postid = postid;
	}
	
	public String getToken() {
		return token;
	}
	
	public void setToken(String token) {
		this.token = token;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getPostid() {
		return postid;
	}

	public void setPostid(String postid) {
		this.postid = postid;
	}
	
	
	
	
	
}