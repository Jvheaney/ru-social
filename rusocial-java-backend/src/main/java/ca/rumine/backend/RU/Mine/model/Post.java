package ca.rumine.backend.RU.Mine.model;


import java.util.Date;

import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Property;
import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;

@NodeEntity
public class Post {
	
	@Id @GeneratedValue
	public Long id;
	
	@Property("text")
	public String text;
	
	@Property("postid")
	public String postid;
	
	@Property("time_submitted")
	public Long time_submitted;
	
	@Property("media")
	public String[] media;
	
	@Property("type")
	public Integer type;
	
	@Property("allowComments")
	public Boolean allowComments;
	
	@Property("allowSharing")
	public Boolean allowSharing;
	
	@Property("deleted")
	public Boolean deleted;

	public Post() {
		
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public Long getTime_submitted() {
		return time_submitted;
	}

	public void setTime_submitted(Long time_submitted) {
		this.time_submitted = time_submitted;
	}

	public String[] getMedia() {
		return media;
	}

	public void setMedia(String[] media) {
		this.media = media;
	}
	
	public Integer getType() {
		return type;
	}
	
	public void setType(Integer type) {
		this.type = type;
	}
	public Boolean getDeleted() {
		return deleted;
	}
	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
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
