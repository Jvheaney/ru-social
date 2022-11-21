package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Property;
import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;

@NodeEntity
public class Group {
	
	@Id @GeneratedValue
	public Long id;
	
	@Property("name")
	public String name;
	
	@Property("groupid")
	public String groupid;
	
	@Property("time_created")
	public Long time_created;
	
	@Property("time_edited")
	public Long time_edited;
	
	@Property("isPrivate")
	public Boolean isPrivate;
	
	@Property("isAnon")
	public Boolean isAnon;
	
	@Property("image")
	public String image;
	
	@Property("deleted")
	public Boolean deleted;
	
	public Group() {
		
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getGroupid() {
		return groupid;
	}

	public void setGroupid(String groupid) {
		this.groupid = groupid;
	}

	public Long getTime_created() {
		return time_created;
	}

	public void setTime_created(Long time_created) {
		this.time_created = time_created;
	}

	public Long getTime_edited() {
		return time_edited;
	}

	public void setTime_edited(Long time_edited) {
		this.time_edited = time_edited;
	}

	public Boolean getIsPrivate() {
		return isPrivate;
	}

	public void setIsPrivate(Boolean isPrivate) {
		this.isPrivate = isPrivate;
	}
	
	public Boolean getIsAnon() {
		return isAnon;
	}

	public void setIsAnon(Boolean isAnon) {
		this.isAnon = isAnon;
	}
	
	public String getImage() {
		return image;
	}
	
	public void setImage(String image) {
		this.image = image;
	}
	
	public Boolean getDeleted() {
		return deleted;
	}
	
	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}
	
	
}
