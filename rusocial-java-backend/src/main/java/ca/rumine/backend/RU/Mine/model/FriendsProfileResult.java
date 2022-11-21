package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import org.springframework.data.neo4j.annotation.QueryResult;

@QueryResult 
public class FriendsProfileResult {
	private String firstname_display;
	private String lastname;
	private String birthdate;
	private String image0;
	private String image1;
	private String image2;
	private String image3;
	private String userid;
	private String pronouns;
	private String year;
	private String program;
	private String top_5_spotify;
	private String badges;
	private String classes;
	private String interests;
	private String bio;
	private Boolean isFriend;
	private Boolean isMe;
	
	public FriendsProfileResult() {
		
	}
	
	public FriendsProfileResult(String firstname_display, String image0, String userid) {
		this.firstname_display = firstname_display;
		this.image0 = image0;
		this.userid = userid;
	}
	
	
	
	public FriendsProfileResult(String firstname_display, String lastname, String birthdate, String image0, String image1, String image2, String image3,
			String userid, String pronouns, String year, String program, String top_5_spotify, String badges,
			String classes, String interests, String bio) {
		super();
		this.firstname_display = firstname_display;
		this.lastname = lastname;
		this.birthdate = birthdate;
		this.image0 = image0;
		this.image1 = image1;
		this.image2 = image2;
		this.image3 = image3;
		this.userid = userid;
		this.pronouns = pronouns;
		this.year = year;
		this.program = program;
		this.top_5_spotify = top_5_spotify;
		this.badges = badges;
		this.classes = classes;
		this.interests = interests;
		this.bio = bio;
	}
	
	public FriendsProfileResult(String firstname_display, String lastname, String birthdate, String image0, String image1, String image2, String image3,
			String userid, String pronouns, String year, String program, String top_5_spotify, String badges,
			String classes, String interests, String bio, Boolean isFriend, Boolean isMe) {
		super();
		this.firstname_display = firstname_display;
		this.lastname = lastname;
		this.birthdate = birthdate;
		this.image0 = image0;
		this.image1 = image1;
		this.image2 = image2;
		this.image3 = image3;
		this.userid = userid;
		this.pronouns = pronouns;
		this.year = year;
		this.program = program;
		this.top_5_spotify = top_5_spotify;
		this.badges = badges;
		this.classes = classes;
		this.interests = interests;
		this.bio = bio;
		this.isFriend = isFriend;
		this.isMe = isMe;
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
	public String getImage0() {
		return image0;
	}
	public void setImage0(String image0) {
		this.image0 = image0;
	}
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
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

	public Boolean getIsFriend() {
		return isFriend;
	}

	public void setIsFriend(Boolean isFriend) {
		this.isFriend = isFriend;
	}

	public Boolean getIsMe() {
		return isMe;
	}

	public void setIsMe(Boolean isMe) {
		this.isMe = isMe;
	}
	
	
	
	
}
