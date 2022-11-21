package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Property;
import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;

@NodeEntity
public class Comment {
	
	@Id @GeneratedValue
	public Long id;
	
	@Property("text")
	public String text;
	
	@Property("commentid")
	public String commentid;
	
	@Property("time_submitted")
	public Long time_submitted;
	
	@Property("deleted")
	public Boolean deleted;
	
	public Comment() {
		
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

	public String getCommentid() {
		return commentid;
	}

	public void setCommentid(String commentid) {
		this.commentid = commentid;
	}

	public Long getTime_submitted() {
		return time_submitted;
	}

	public void setTime_submitted(Long time_submitted) {
		this.time_submitted = time_submitted;
	}
	
	public Boolean getDeleted() {
		return deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}
	
}
