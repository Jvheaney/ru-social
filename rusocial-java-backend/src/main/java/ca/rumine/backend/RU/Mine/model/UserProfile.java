package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import javax.persistence.Transient;

@Entity
@Table(name = "profiles")
public class UserProfile {
	@Transient String token;
	private String userid;
	private String firstname_display;
	private String lastname;
	private String birthdate;
	private String program;
	private String year;
	private Integer gender;
	private Boolean interested_male;
	private Boolean interested_female;
	private Boolean interested_nb;
	private Boolean interested_trans;
	private Boolean interested_other;
	private String bio;
	private String pronouns;
	private String lookingfor;
	private Date edited;
	private String caption0;
	private String caption1;
	private String storyheadline;
	private String story;
	private String caption2;
	private Integer start_age;
	private Integer end_age;
	private Boolean reshow_profiles;
	private String image0;
	private String image1;
	private String image2;
	private String image3;
	private String badges;
	private String interests;
	private String top_5_spotify;
	private Boolean show_me;
	private Date last_seen;
	@Transient Integer captionNum;
	@Transient String otherUserId;
	
	public UserProfile() {
		
	}
	
	public UserProfile(String token, String firstname_display, String lastname, String birthdate, String program, String year,
			Integer gender, Boolean interested_male, Boolean interested_female, Boolean interested_nb,
			Boolean interested_trans, Boolean interested_other, String bio, String pronouns, String lookingfor,
			String caption0, String caption1, String storyheadline, String story, String caption2, Integer captionNum, String otherUserId, Integer start_age, Integer end_age, Boolean reshow_profiles, String image0, String image1, String image2, String image3, String badges, String interests, String top_5_spotify, Boolean show_me, Date last_seen) {
		this.token = token;
		this.firstname_display = firstname_display;
		this.lastname = lastname;
		this.birthdate = birthdate;
		this.program = program;
		this.year = year;
		this.gender = gender;
		this.interested_male = interested_male;
		this.interested_female = interested_female;
		this.interested_nb = interested_nb;
		this.interested_trans = interested_trans;
		this.interested_other = interested_other;
		this.bio = bio;
		this.pronouns = pronouns;
		this.lookingfor = lookingfor;
		this.caption0 = caption0;
		this.caption1 = caption1;
		this.storyheadline = storyheadline;
		this.story = story;
		this.caption2 = caption2;
		this.captionNum = captionNum;
		this.otherUserId = otherUserId;
		this.start_age = start_age;
		this.end_age = end_age;
		this.reshow_profiles = reshow_profiles;
		this.image0 = image0;
		this.image1 = image1;
		this.image2 = image2;
		this.image3 = image3;
		this.badges = badges;
		this.interests = interests;
		this.top_5_spotify = top_5_spotify;
		this.show_me = show_me;
		this.last_seen = last_seen;
	}

	@Id
	@Column(name = "userid", nullable = false)
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}

	@Column(name = "firstname_display", nullable = false)
	public String getFirstname_display() {
		return firstname_display;
	}
	public void setFirstname_display(String firstname_display) {
		this.firstname_display = firstname_display;
	}
	
	@Column(name = "lastname", nullable = false)
	public String getLastname() {
		return lastname;
	}
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	@Column(name = "birthdate", nullable = false)
	public String getBirthdate() {
		return birthdate;
	}
	public void setBirthdate(String birthdate) {
		this.birthdate = birthdate;
	}

	@Column(name = "program", nullable = false)
	public String getProgram() {
		return program;
	}
	public void setProgram(String program) {
		this.program = program;
	}

	@Column(name = "year", nullable = false)
	public String getYear() {
		return year;
	}
	public void setYear(String year) {
		this.year = year;
	}

	@Column(name = "gender", nullable = false)
	public Integer getGender() {
		return gender;
	}
	public void setGender(Integer gender) {
		if(gender == null) {
			gender = 9;
		}
		this.gender = gender;
	}

	@Column(name = "interested_male", nullable = false)
	public Boolean getInterested_male() {
		return interested_male;
	}
	public void setInterested_male(Boolean interested_male) {
		if(interested_male == null) {
			interested_male = false;
		}
		this.interested_male = interested_male;
	}

	@Column(name = "interested_female", nullable = false)
	public Boolean getInterested_female() {
		return interested_female;
	}
	public void setInterested_female(Boolean interested_female) {
		if(interested_female == null) {
			interested_female = false;
		}
		this.interested_female = interested_female;
	}

	@Column(name = "interested_nb", nullable = false)
	public Boolean getInterested_nb() {
		return interested_nb;
	}
	public void setInterested_nb(Boolean interested_nb) {
		if(interested_nb == null) {
			interested_nb = false;
		}
		this.interested_nb = interested_nb;
	}

	@Column(name = "interested_trans", nullable = false)
	public Boolean getInterested_trans() {
		return interested_trans;
	}
	public void setInterested_trans(Boolean interested_trans) {
		if(interested_trans == null) {
			interested_trans = false;
		}
		this.interested_trans = interested_trans;
	}

	@Column(name = "interested_other", nullable = false)
	public Boolean getInterested_other() {
		return interested_other;
	}
	public void setInterested_other(Boolean interested_other) {
		if(interested_other == null) {
			interested_other = false;
		}
		this.interested_other = interested_other;
	}

	@Column(name = "bio", nullable = false)
	public String getBio() {
		return bio;
	}
	public void setBio(String bio) {
		this.bio = bio;
	}

	@Column(name = "pronouns", nullable = false)
	public String getPronouns() {
		return pronouns;
	}
	public void setPronouns(String pronouns) {
		this.pronouns = pronouns;
	}

	@Column(name = "lookingfor", nullable = false)
	public String getLookingfor() {
		return lookingfor;
	}
	public void setLookingfor(String lookingfor) {
		this.lookingfor = lookingfor;
	}

	@Column(name = "edited", nullable = false)
	public Date getEdited() {
		return edited;
	}
	public void setEdited(Date edited) {
		this.edited = edited;
	}

	@Column(name = "caption0", nullable = true)
	public String getCaption0() {
		return caption0;
	}
	public void setCaption0(String caption0) {
		this.caption0 = caption0;
	}

	@Column(name = "caption1", nullable = true)
	public String getCaption1() {
		return caption1;
	}
	public void setCaption1(String caption1) {
		this.caption1 = caption1;
	}

	@Column(name = "storyheadline", nullable = true)
	public String getStoryheadline() {
		return storyheadline;
	}
	public void setStoryheadline(String storyheadline) {
		this.storyheadline = storyheadline;
	}

	@Column(name = "story", nullable = true)
	public String getStory() {
		return story;
	}
	public void setStory(String story) {
		this.story = story;
	}

	@Column(name = "caption2", nullable = true)
	public String getCaption2() {
		return caption2;
	}
	public void setCaption2(String caption2) {
		this.caption2 = caption2;
	}
	@Transient
	public String getToken() {
		return this.token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	

	@Transient
	public Integer getCaptionNum() {
		return this.captionNum;
	}
	public void setCaptionNum(Integer captionNum) {
		this.captionNum = captionNum;
	}
	
	@Transient
	public String getOtherUserId() {
		return this.otherUserId;
	}
	public void setOtherUserId(String otherUserId) {
		this.otherUserId = otherUserId;
	}
	
	@Column(name = "start_age", nullable = false)
	public Integer getStart_age() {
		return start_age;
	}
	public void setStart_age(Integer start_age) {
		this.start_age = start_age;
	}
	
	@Column(name = "end_age", nullable = false)
	public Integer getEnd_age() {
		return end_age;
	}
	public void setEnd_age(Integer end_age) {
		this.end_age = end_age;
	}
	
	@Column(name = "reshow_profiles", nullable = false)
	public Boolean getReshow_profiles() {
		return reshow_profiles;
	}
	public void setReshow_profiles(Boolean reshow_profiles) {
		this.reshow_profiles = reshow_profiles;
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

	public String getBadges() {
		return badges;
	}

	public void setBadges(String badges) {
		this.badges = badges;
	}

	public String getInterests() {
		return interests;
	}

	public void setInterests(String interests) {
		this.interests = interests;
	}

	public String getTop_5_spotify() {
		return top_5_spotify;
	}

	public void setTop_5_spotify(String top_5_spotify) {
		this.top_5_spotify = top_5_spotify;
	}
	
	@Column(name = "show_me", nullable = true)
	public Boolean getShow_me() {
		return show_me;
	}
	public void setShow_me(Boolean show_me) {
		this.show_me = show_me;
	}
	
	@Column(name = "last_seen", nullable = true)
	public Date getLast_seen() {
		return last_seen;
	}
	public void setLast_seen(Date last_seen) {
		this.last_seen = last_seen;
	}

	public String toJson() {
		String stringToReturn = "{";
		stringToReturn+="'firstname_display':'" + this.firstname_display + "',";
		stringToReturn+="'birthdate':'" + this.birthdate + "',";
		stringToReturn+="'program':'" + this.program + "',";
		stringToReturn+="'year':'" + this.year + "',";
		stringToReturn+="'gender':'" + this.gender + "',";
		stringToReturn+="'bio':'" + this.bio + "',";
		stringToReturn+="'pronouns':'" + this.pronouns + "',";
		stringToReturn+="'lookingfor':'" + this.lookingfor + "',";
		stringToReturn+="'caption0':'" + this.caption0 + "',";
		stringToReturn+="'caption1':'" + this.caption1 + "',";
		stringToReturn+="'caption2':'" + this.caption2 + "',";
		stringToReturn+="'storyheadline':'" + this.storyheadline + "',";
		stringToReturn+="'story':'" + this.story + "'";
		stringToReturn+="'start_age':'" + this.start_age + "'";
		stringToReturn+="'end_age':'" + this.end_age + "'";
		stringToReturn+="'reshow_profiles':'" + this.reshow_profiles + "'";
		stringToReturn+="}";
		return stringToReturn;
	}
	
	
}
