package ca.rumine.backend.RU.Mine.model;

import java.time.ZonedDateTime;
import java.util.Date;

import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Property;

@NodeEntity
public class FriendProfile {

	@Id @GeneratedValue
	private Long id;
	
	@Property("userid")
	public String userid;
	
	@Property("firstname_display")
	public String firstname_display;
	
	@Property("lastname")
	public String lastname;
	
	@Property("birthdate")
	public String birthdate;
	
	@Property("pronouns")
	public String pronouns;
	
	@Property("year")
	public String year;
	
	@Property("program")
	public String program;
	
	@Property("top_5_spotify")
	public String top_5_spotify;
	
	@Property("badges")
	public String badges;
	
	@Property("classes")
	public String classes;
	
	@Property("interests")
	public String interests;
	
	@Property("bio")
	public String bio;
	
	@Property("image0")
	public String image0;
	
	@Property("image1")
	public String image1;
	
	@Property("image2")
	public String image2;
	
	@Property("image3")
	public String image3;
	
	@Property("deleted")
	public Boolean deleted;
	
	@Property("show_me")
	public Boolean show_me;
	
	@Property("algo_pref")
	public Integer algo_pref;
	
	@Property("last_seen")
	public Long last_seen;
	
	@Property("createdAt")
	public Long createdAt;
	
	
	public FriendProfile() {
		
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getFirstname_display() {
		return firstname_display;
	}

	public void setFirstname_display(String firstname_display) {
		this.firstname_display = firstname_display;
	}
	
	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}
	
	public String getBirthdate() {
		return birthdate;
	}

	public void setBirthdate(String birthdate) {
		this.birthdate = birthdate;
	}

	public String getPronouns() {
		return pronouns;
	}

	public void setPronouns(String pronouns) {
		this.pronouns = pronouns;
	}

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	public String getProgram() {
		return program;
	}

	public void setProgram(String program) {
		this.program = program;
	}

	public String getTop_5_spotify() {
		return top_5_spotify;
	}

	public void setTop_5_spotify(String top_5_spotify) {
		this.top_5_spotify = top_5_spotify;
	}

	public String getBadges() {
		return badges;
	}

	public void setBadges(String badges) {
		this.badges = badges;
	}

	public String getClasses() {
		return classes;
	}

	public void setClasses(String classes) {
		this.classes = classes;
	}

	public String getInterests() {
		return interests;
	}

	public void setInterests(String interests) {
		this.interests = interests;
	}

	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public String getImage0() {
		return image0;
	}

	public void setImage0(String image0) {
		this.image0 = image0;
	}

	public String getImage1() {
		return image1;
	}

	public void setImage1(String image1) {
		this.image1 = image1;
	}

	public String getImage2() {
		return image2;
	}

	public void setImage2(String image2) {
		this.image2 = image2;
	}

	public String getImage3() {
		return image3;
	}

	public void setImage3(String image3) {
		this.image3 = image3;
	}

	public Boolean getDeleted() {
		return deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}
	
	public Boolean getShow_me() {
		return show_me;
	}
	
	public void setShow_me(Boolean show_me) {
		this.show_me = show_me;
	}
	
	public Integer getAlgo_pref() {
		return algo_pref;
	}
	
	public void setAlgo_pref(Integer algo_pref) {
		this.algo_pref = algo_pref;
	}
	
	public Long getLast_seen() {
		return last_seen;
	}
	
	public void setLast_seen(Long last_seen) {
		this.last_seen = last_seen;
	}
	
	public Long getCreatedAt() {
		return createdAt;
	}
	
	public void setCreatedAt(Long createdAt) {
		this.createdAt = createdAt;
	}
	
	

	
}
