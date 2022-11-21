package ca.rumine.backend.RU.Mine.model;

import org.springframework.web.multipart.MultipartFile;

public class CreatePost {
	public String text;
	public String media;
	public String groups;
	public String token;
	public Boolean allowComments;
	public Boolean allowSharing;
	
	
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getMedia() {
		return media;
	}
	public void setMedia(String media) {
		this.media = media;
	}
	public String getGroups() {
		return groups;
	}
	public void setGroups(String groups) {
		this.groups = groups;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
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
	
	public CreatePost() {
		
	}
	
	public CreatePost(String text, String groups, String token, Boolean allowComments, Boolean allowSharing) {
		super();
		this.text = text;
		this.groups = groups;
		this.token = token;
		this.allowComments = allowComments;
		this.allowSharing = allowSharing;
	}
	
	public CreatePost(String text, String media, String groups, String token, Boolean allowComments, Boolean allowSharing) {
		super();
		this.text = text;
		this.media = media;
		this.groups = groups;
		this.token = token;
		this.allowComments = allowComments;
		this.allowSharing = allowSharing;
	}
	
	
}