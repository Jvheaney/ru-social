package ca.rumine.backend.RU.Mine.repository;


import java.util.Date;
import java.util.List;

import javax.persistence.SqlResultSetMapping;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ca.rumine.backend.RU.Mine.model.UserProfile;
import ca.rumine.backend.RU.Mine.model.Program;
import ca.rumine.backend.RU.Mine.model.SpotifyArtist;

@Repository
public interface ProfileRepository extends JpaRepository<UserProfile, Long>{
	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET firstname_display=:firstname_display, birthdate=:birthdate, edited=:edited WHERE userid = :userid") 
    void editNameAge(@Param("firstname_display") String firstname_display, @Param("birthdate") String birthdate, @Param("userid") String userid, @Param("edited") Date edited);
	
	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET firstname_display=:firstname_display, lastname=:lastname, birthdate=:birthdate, edited=:edited WHERE userid = :userid") 
    void editBothNamesAge(@Param("firstname_display") String firstname_display, @Param("lastname") String lastname, @Param("birthdate") String birthdate, @Param("userid") String userid, @Param("edited") Date edited);
	
	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET program=:program, year=:year, edited=:edited WHERE userid = :userid") 
    void editProgramAndYear(@Param("program") String program, @Param("year") String year, @Param("userid") String userid, @Param("edited") Date edited);
	
	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET pronouns=:pronouns, lookingfor=:lookingfor, edited=:edited WHERE userid = :userid") 
    void editPronounsAndLookingfor(@Param("pronouns") String pronouns, @Param("lookingfor") String lookingfor, @Param("userid") String userid, @Param("edited") Date edited);

	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET bio=:bio, edited=:edited WHERE userid = :userid") 
    void editBio(@Param("bio") String bio, @Param("userid") String userid, @Param("edited") Date edited);
	
	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET caption0=:caption0, edited=:edited WHERE userid = :userid") 
    void editCaption0(@Param("caption0") String caption0, @Param("userid") String userid, @Param("edited") Date edited);
	
	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET caption1=:caption1, edited=:edited WHERE userid = :userid") 
    void editCaption1(@Param("caption1") String caption1, @Param("userid") String userid, @Param("edited") Date edited);
	
	
	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET caption2=:caption2, edited=:edited WHERE userid = :userid") 
    void editCaption2(@Param("caption2") String caption2, @Param("userid") String userid, @Param("edited") Date edited);
	

	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET storyheadline=:storyheadline, story=:story, edited=:edited WHERE userid = :userid") 
    void editStory(@Param("storyheadline") String storyheadline, @Param("story") String story, @Param("userid") String userid, @Param("edited") Date edited);
	
	
	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET start_age=:start_age, end_age=:end_age, reshow_profiles=:reshow_profiles, gender=:gender, interested_male=:interested_male, interested_female=:interested_female, interested_nb=:interested_nb, interested_trans=:interested_trans, interested_other=:interested_other, edited=:edited WHERE userid = :userid") 
    void editPreferences(@Param("start_age") Integer start_age, @Param("end_age") Integer end_age, @Param("reshow_profiles") Boolean reshow_profiles, @Param("gender") Integer gender, @Param("interested_male") Boolean interested_male, @Param("interested_female") Boolean interested_female, @Param("interested_nb") Boolean interested_nb, @Param("interested_trans") Boolean interested_trans, @Param("interested_other") Boolean interested_other, @Param("userid") String userid, @Param("edited") Date edited);

	@Query("SELECT up FROM UserProfile up WHERE userid = :userid") 
    UserProfile getUserProfile(@Param("userid") String userid);
	
	@Query("SELECT p FROM Program p ORDER BY program_name ASC") 
    List<Program> getPrograms();
	
	@Query("SELECT sa FROM SpotifyArtist sa WHERE artist_id IN (:artist_1, :artist_2, :artist_3, :artist_4, :artist_5) ORDER BY CASE artist_id " +
			"WHEN :artist_1 THEN 1 " + 
			"WHEN :artist_2 THEN 2 " + 
			"WHEN :artist_3 THEN 3 " + 
			"WHEN :artist_4 THEN 4 " + 
			"WHEN :artist_5 THEN 5 " +
			"ELSE 6 " + 
			"END, artist_name") 
    List<SpotifyArtist> getSpotifyArtistData(@Param("artist_1") String artist_1, @Param("artist_2") String artist_2, @Param("artist_3") String artist_3, @Param("artist_4") String artist_4, @Param("artist_5") String artist_5);
	
	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET top_5_spotify=NULL, edited=:edited WHERE userid = :userid") 
    void hideArtistData(@Param("userid") String userid, @Param("edited") Date edited);
	
	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET interests=:interests, edited=:edited WHERE userid = :userid") 
    void saveInterests(@Param("userid") String userid, @Param("interests") String interests, @Param("edited") Date edited);
	
	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET interests=NULL, edited=:edited WHERE userid = :userid") 
    void hideInterests(@Param("userid") String userid, @Param("edited") Date edited);
	
	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET badges=:badges, edited=:edited WHERE userid = :userid") 
    void saveBadges(@Param("userid") String userid, @Param("badges") String badges, @Param("edited") Date edited);
	
	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET badges=NULL, edited=:edited WHERE userid = :userid") 
    void hideBadges(@Param("userid") String userid, @Param("edited") Date edited);
	
	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET image0=:image0, image1=:image1, image2=:image2, image3=:image3, edited='now()' WHERE userid = :userid") 
    void saveImagesToProfile(@Param("userid") String userid, @Param("image0") String image0, @Param("image1") String image1, @Param("image2") String image2, @Param("image3") String image3);

	@Transactional
	@Modifying
	@Query(value="UPDATE profiles SET image0=:image0, edited='now()' WHERE userid = :userid", nativeQuery=true) 
    void saveFirstImageToProfile(@Param("userid") String userid, @Param("image0") String image0);
	
	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET show_me=:show_me WHERE userid = :userid") 
    void toggleShowMe(@Param("show_me") Boolean show_me, @Param("userid") String userid);
	
	//For use with friends
	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET program=:program, edited=:edited WHERE userid = :userid") 
    void editProgram(@Param("program") String program, @Param("userid") String userid, @Param("edited") Date edited);
	
	@Transactional
	@Modifying
	@Query("UPDATE UserProfile SET pronouns=:pronouns, year=:year, edited=:edited WHERE userid = :userid") 
    void editPronounsAndYear(@Param("pronouns") String pronouns, @Param("year") String year, @Param("userid") String userid, @Param("edited") Date edited);
	
	@Query(value="SELECT badges FROM profiles WHERE userid = :userid", nativeQuery=true) 
    String getBadges(@Param("userid") String userid);
	
	@Query(value="SELECT interests FROM profiles WHERE userid = :userid", nativeQuery=true) 
    String getInterests(@Param("userid") String userid);
	
	@Transactional
	@Modifying
	@Query(value="UPDATE profiles SET last_seen='now()' WHERE userid = :userid", nativeQuery=true) 
    void setLastSeen(@Param("userid") String userid);
	
	@Transactional
	@Modifying
	@Query(value="UPDATE profiles SET lastname=:lastname, birthdate=:birthdate WHERE userid = :userid", nativeQuery=true) 
    void updateLastnameAge(@Param("userid") String userid, @Param("lastname") String lastname, @Param("birthdate") String birthdate);
	
	@Transactional
	@Modifying
	@Query(value="UPDATE profiles SET birthdate=:birthdate WHERE userid = :userid", nativeQuery=true) 
    void updateBirthdate(@Param("userid") String userid, @Param("birthdate") String birthdate);
	
	/////////////////////////
	//New sign in queries
	////////////////////////
	
	@Query(nativeQuery=true,value="select prof.firstname_display as firstname_display, prof.birthdate as birthdate, prof.program as program, prof.year as year, prof.gender as gender, prof.interested_male as interested_male, prof.interested_female as interested_female, prof.interested_nb as interested_nb, prof.interested_trans as interested_trans, prof.interested_other as interested_other, prof.bio as bio, prof.pronouns as pronouns, prof.lookingfor as lookingfor, prof.start_age as start_age, prof.end_age as end_age, prof.reshow_profiles as reshow_profiles, prof.image0 as image0, prof.image1 as image1, prof.image2 as image2, prof.image3 as image3, prof.badges as badges, prof.interests as interests, prof.top_5_spotify as top_5_spotify, prof.show_me as datingenabled, u.allow_location_tracking as allow_location_tracking, u.allow_notifications as allow_notifications, prof.lastname as lastname from users u left join profiles prof on (u.userid=prof.userid) where u.userid=:userid")
	String[][] getSignInData(@Param("userid") String userid);

	/////////////////////////
	//Friends Profile Portion
	/////////////////////////
	
	@Transactional
	@Modifying
	@Query(value="INSERT INTO friends_profiles (userid, firstname_display, lastname, image0) VALUES (:userid, :firstname_display, :lastname, :image0)", nativeQuery=true) 
    void insertIntoFriendsProfile(@Param("userid") String userid, @Param("firstname_display") String firstname_display, @Param("lastname") String lastname, @Param("image0") String image0);

	@Transactional
	@Modifying
	@Query(value="UPDATE friends_profiles SET firstname_display=:firstname_display WHERE userid = :userid", nativeQuery=true) 
    void updateFriendsFirstname_display(@Param("userid") String userid, @Param("firstname_display") String firstname_display);
	
	@Transactional
	@Modifying
	@Query(value="UPDATE friends_profiles SET firstname_display=:firstname_display, lastname=:lastname WHERE userid = :userid", nativeQuery=true) 
    void updateNames(@Param("userid") String userid, @Param("firstname_display") String firstname_display, @Param("lastname") String lastname);
	
	@Transactional
	@Modifying
	@Query(value="UPDATE friends_profiles SET lastname=:lastname WHERE userid = :userid", nativeQuery=true) 
    void updateFriendsLastname(@Param("userid") String userid, @Param("lastname") String lastname);
	
	@Transactional
	@Modifying
	@Query(value="UPDATE friends_profiles SET image0=:image0 WHERE userid = :userid", nativeQuery=true) 
    void updateFriendsImage0(@Param("userid") String userid, @Param("image0") String image0);

	@Query(value="SELECT course_code FROM courses WHERE course_code = :course_code", nativeQuery=true) 
    String doesCourseExist(@Param("course_code") String course_code);
	
	@Query(value="SELECT firstname_display FROM friends_profiles WHERE userid = :userid", nativeQuery=true) 
    String getUserFromFriends(@Param("userid") String userid);
	
	@Query(value="SELECT EXISTS(SELECT lastname FROM professor_information WHERE email = :email)", nativeQuery=true) 
    Boolean isProfessor(@Param("email") String email);
	
	
	
}
