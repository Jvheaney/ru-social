package ca.rumine.backend.RU.Mine.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import ca.rumine.backend.RU.Mine.model.FriendProfile;
import ca.rumine.backend.RU.Mine.model.FriendsProfileResult;
import ca.rumine.backend.RU.Mine.model.SearchResult;

public interface FriendProfileRepository extends Neo4jRepository<FriendProfile, Long> {
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "match (y:Year) where y.year=$year "
			+ "MERGE (u)-[:studying_in]->(y)")
	public void connectUserToYear(@Param("userid") String userid, @Param("year") String year);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "set u.bio=$bio")
	public void editBio(@Param("userid") String userid, @Param("bio") String bio);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "set u.firstname_display=$firstname_display")
	public void editFirstname_display(@Param("userid") String userid, @Param("firstname_display") String firstname_display);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "set u.lastname=$lastname")
	public void editLastname(@Param("userid") String userid, @Param("lastname") String lastname);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "set u.firstname_display=$firstname_display "
			+ "set u.birthdate=$birthdate "
			+ "set u.lastname=$lastname")
	public void editNamesAge(@Param("userid") String userid, @Param("firstname_display") String firstname_display, @Param("lastname") String lastname, @Param("birthdate") String birthdate);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "set u.birthdate=$birthdate")
	public void editBirthdate(@Param("userid") String userid, @Param("birthdate") String birthdate);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "match (y:Year) where y.year=$year "
			+ "match (u)-[r:studying_in]->(:Year) "
			+ "delete r "
			+ "set u.year=$year "
			+ "set u.pronouns=$pronouns "
			+ "MERGE (u)-[:studying_in]->(y)")
	public void editPronounsYear(@Param("userid") String userid, @Param("pronouns") String pronouns, @Param("year") String year);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "set u.pronouns=$pronouns")
	public void editPronouns(@Param("userid") String userid, @Param("pronouns") String pronouns);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "match (u)-[r1:belongs_to]->(:FriendsProgram) "
			+ "match (u)-[r2:studying_in]->(:Year) "
			+ "match (p:FriendsProgram) where p.program_name=$program "
			+ "match (y:Year) where y.year=$year "
			+ "delete r1 "
			+ "delete r2 "
			+ "set u.program=$program "
			+ "set u.year=$year "
			+ "merge (u)-[:belongs_to]->(p) "
			+ "merge (u)-[:studying_in]->(y)")
	public void editProgramYear(@Param("userid") String userid, @Param("program") String program, @Param("year") String year);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "match (p:FriendsProgram) where p.program_name=$program "
			+ "match (u)-[r:belongs_to]->(:FriendsProgram) "
			+ "delete r "
			+ "set u.program=$program "
			+ "merge (u)-[:belongs_to]->(p)")
	public void editProgram(@Param("userid") String userid, @Param("program") String program);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "set u.image0=$image0 "
			+ "set u.image1=$image1 "
			+ "set u.image2=$image2 "
			+ "set u.image3=$image3 ")
	public void saveImages(@Param("userid") String userid, @Param("image0") String image0, @Param("image1") String image1, @Param("image2") String image2, @Param("image3") String image3);

	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "match (u)-[r:interested_in]->(:FriendsInterests) "
			+ "match (i:FriendsInterests) where i.interest_name IN $interests_array "
			+ "set u.interests=$interests "
			+ "delete r "
			+ "MERGE (u)-[:interested_in]->(i) ")
	public void editInterests(@Param("userid") String userid, @Param("interests") String interests, @Param("interests_array") Collection<String> interests_array);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "match (u)-[r:enrolled_in]->(:FriendsCourse) "
			+ "match (c:FriendsCourse) where c.course_code IN $course_codes "
			+ "set u.classes=$courses "
			+ "delete r "
			+ "MERGE (u)-[:enrolled_in]->(c) ")
	public void editClasses(@Param("userid") String userid, @Param("courses") String courses, @Param("course_codes") Collection<String> course_codes);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "match (u)-[r:interested_in]->(:FriendsTopic) "
			+ "match (t:FriendsTopic) where t.topic_name IN $badges_array "
			+ "set u.badges=$badges "
			+ "delete r "
			+ "MERGE (u)-[:interested_in]->(t) ")
	public void editBadges(@Param("userid") String userid, @Param("badges") String badges, @Param("badges_array") Collection<String> badges_array);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "set u.show_me=$show_me")
	public void toggleShowMeOnFriends(@Param("userid") String userid, @Param("show_me") Boolean showme);
	
	@Query("match (u:FriendProfile) where u.userid=$userid and u.deleted=FALSE " +
			"return u")
	public FriendProfile getProfile(@Param("userid") String userid);
	
	@Query("match (me:FriendProfile) where me.userid=$myuserid " +
			"match (u:FriendProfile) where u.userid=$userid and u.deleted=FALSE " +
			" and not (exists((me)-[:BLOCKED]->(u)) OR exists((u)<-[:BLOCKED]-(me))) "
			+ "return u.userid as userid, u.firstname_display as firstname_display, COALESCE(u.lastname,'') as lastname, u.birthdate as birthdate, u.pronouns as pronouns, u.year as year, u.program as program, "
			+ "u.top_5_spotify as top_5_spotify, u.badges as badges, u.classes as classes, u.interests as interests, u.bio as bio, u.image0 as image0, u.image1 as image1, u.image2 as image2, u.image3 as image3, exists((me)-[:FRIENDS_WITH]->(u)) as isFriend, me.userid=u.userid as isMe")
	public FriendsProfileResult fetchProfile(@Param("myuserid") String myuserid, @Param("userid") String userid);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "match (u:FriendProfile)-[r:interested_in]->(:FriendsTopic) "
			+ "set u.badges='[]' "
			+ "delete r")
	public void hideBadges(@Param("userid") String userid);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "match (u:FriendProfile)-[r:enrolled_in]->(:FriendsCourse) "
			+ "set u.classes='[]' "
			+ "delete r")
	public void hideClasses(@Param("userid") String userid);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "match (u:FriendProfile)-[r:listens_to]->(:FriendsArtist) "
			+ "set u.top_5_spotify='[]' "
			+ "delete r")
	public void hideSpotify(@Param("userid") String userid);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "match (u:FriendProfile)-[r:interested_in]->(:FriendsInterests) "
			+ "set u.interests='[]' "
			+ "delete r")
	public void hideInterests(@Param("userid") String userid);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "set u.top_5_spotify=$spotifyData")
	public void setSpotify(@Param("userid") String userid, @Param("spotifyData") String spotifyData);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "set u.last_seen=$last_seen")
	public void setLastseen(@Param("userid") String userid, @Param("last_seen") Long last_seen);
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "set u.lastname=$lastname "
			+ "set u.birthdate=$birthdate")
	public void updateBirthdateAndLastname(@Param("userid") String userid, @Param("birthdate") String birthdate, @Param("lastname") String lastname);

	////////////////////////////
	////////////////////////////
	////////////////////////////
	//Timeline related functions
	////////////////////////////
	////////////////////////////
	////////////////////////////
	
	
	
	@Query("match (u:FriendProfile) where u.userid=$useridToBlock " + 
			"match (me:FriendProfile) where me.userid=$userid " + 
			"merge (me)-[:BLOCKED]->(u)")
	public void blockUser(@Param("useridToBlock") String useridToBlock, @Param("userid") String userid);
		
	@Query("match (u:FriendProfile) where u.userid=$useridToUnblock " + 
		   "match (me:FriendProfile) where me.userid=$userid " + 
		   "optional match (me)-[r:BLOCKED]->(u) " +
		   "delete r")
	public void unblockUser(@Param("useridToUnblock") String useridToUnblock, @Param("userid") String userid);
	
	@Query("match (u:FriendProfile) where u.userid=$userid " + 
			   "match (u)-[:BLOCKED]->(n:FriendProfile) " + 
			   "where n.deleted=false " +
			   "return n.firstname_display as firstname_display, n.image0 as image0, n.userid as userid")
	public List<FriendsProfileResult> getBlockedUsers(@Param("userid") String userid);
		
	@Query("match (u:FriendProfile) where u.userid=$userid " + 
		   "match (u)-[:FRIENDS_WITH]->(n:FriendProfile) " + 
		   "where n.deleted=false and not (exists((u)-[:BLOCKED]->(n)) OR exists((u)<-[:BLOCKED]-(n))) " +
			"return n.firstname_display as firstname_display, COALESCE(n.lastname,'') as lastname, n.image0 as image0, n.userid as userid order by toLower(n.firstname_display) ASC")
	public List<FriendsProfileResult> getFriends(@Param("userid") String userid);
	
	@Query("match (n:FriendProfile) where n.userid=$userid "
			+ "match (u:FriendProfile) where u.userid=$useridToAdd "
			+ "MATCH (n)-[r:REQUESTED]->(u) "
			+ "DELETE r")
	public void cancelRequest(@Param("userid") String userid, @Param("useridToAdd") String useridToAdd);
	
	@Query("match (n:FriendProfile) where n.userid=$userid "
			+ "match (u:FriendProfile) where u.userid=$useridToAdd "
			+ "match (u)-[:REQUESTED]->(n) "
			+ "MERGE (n)-[:FRIENDS_WITH]->(u) "
			+ "MERGE (u)-[:FRIENDS_WITH]->(n)")
	public void addFriend(@Param("userid") String userid, @Param("useridToAdd") String useridToAdd);
	
	@Query("match (n:FriendProfile) where n.userid=$userid "
			+ "match (u:FriendProfile) where u.userid=$useridToAdd "
			+ "match (n)-[r1:FRIENDS_WITH]->(u) "
			+ "match (u)-[r2:FRIENDS_WITH]->(n) "
			+ "optional match (u)-[r3:REQUESTED]->(n) "
			+ "optional match (n)-[r4:REQUESTED]->(u) "
			+ "delete r1, r2, r3, r4")
	public void deleteFriend(@Param("userid") String userid, @Param("useridToAdd") String useridToAdd);
	
	@Query("match (u:FriendProfile) where u.userid=$userid " + 
			"match (n:FriendProfile) where n.userid=$useridToAdd " + 
			"FOREACH (i in CASE WHEN EXISTS((n)-[:REQUESTED]->(u)) THEN [1] ELSE [] END | " + 
			"  MERGE (n)-[:FRIENDS_WITH]->(u) " + 
			"  MERGE (u)-[:FRIENDS_WITH]->(n)) " + 
			"FOREACH (i in CASE WHEN NOT EXISTS((n)-[:REQUESTED]->(u)) THEN [1] ELSE [] END | " + 
			"  MERGE (u)-[:REQUESTED]->(n)) " + 
			"return case when exists((u)-[:REQUESTED]->(n)) then [\"sent\"] else [\"added\"] end")
	public String requestFriend(@Param("userid") String userid, @Param("useridToAdd") String useridToAdd);
	
	@Query("match (u:FriendProfile) where u.userid=$userid " + 
			   "match (u)-[:REQUESTED]->(n:FriendProfile) " + 
			   "where n.deleted=false and not (exists((u)-[:BLOCKED]->(n)) OR exists((u)<-[:BLOCKED]-(n)) OR exists((u)-[:FRIENDS_WITH]->(n))) " +
			   "return n.firstname_display as firstname_display, n.image0 as image0, n.userid as userid")
	public List<FriendsProfileResult> getRequestsSent(@Param("userid") String userid);
	
	@Query("match (u:FriendProfile) where u.userid=$userid " + 
			   "set u.algo_pref=$type")
	public void saveAlgoPreference(@Param("userid") String userid, @Param("type") Integer type);
	
	@Query("match (n:FriendProfile) where n.userid=$userid "
			+ "match (u:FriendProfile) where u.userid=$userToMarkSeen "
			+ "MERGE (n)-[r:SEEN]->(u) ON CREATE SET r.time=datetime() ON MATCH SET r.time=datetime()")
	public void markUserAsSeen(@Param("userid") String userid, @Param("userToMarkSeen") String userToMarkSeen);
	
	@Query("match (me:FriendProfile) " +
			"where me.userid=$userid " +
			"call apoc.do.when(me.algo_pref=0, " +
			"'match (o:FriendProfile) where o.userid<>$userid and o.show_me=True and not ((me)-[:REJECTED_REQUEST]->(o) OR (o)<-[:REJECTED_REQUEST]-(me)) and not ((me)-[:BLOCKED]->(o) OR (o)<-[:BLOCKED]-(me)) and not ((me)-[:REQUESTED]->(o)) and not ((me)-[:FRIENDS_WITH]->(o)) AND NOT o.userid IN $uids optional MATCH (me)-[r:SEEN]->(o) optional MATCH (me)-[:enrolled_in]->(c:FriendsCourse)<-[:enrolled_in]-(o) WITH me, o, r, COUNT(c) AS common return distinct o, common, r.time order by r.time is null desc, r.time asc, common desc limit 15','',{me:me, userid:$userid,uids:$uids}) yield value as timeline0 " +
			"call apoc.do.when(me.algo_pref=1, " +
			"'match (o:FriendProfile) where o.userid<>$userid and o.show_me=True and not ((me)-[:REJECTED_REQUEST]->(o) OR (o)<-[:REJECTED_REQUEST]-(me)) and not ((me)-[:BLOCKED]->(o) OR (o)<-[:BLOCKED]-(me)) and not ((me)-[:REQUESTED]->(o)) and not ((me)-[:FRIENDS_WITH]->(o)) AND NOT o.userid IN $uids optional MATCH (me)-[r:SEEN]->(o) optional MATCH (me)-[:belongs_to]->(c:FriendsProgram)<-[:belongs_to]-(o) WITH me, o, r, COUNT(c) AS common return distinct o, common, r.time order by r.time is null desc, r.time asc, common desc limit 15','',{me:me, userid:$userid,uids:$uids}) yield value as timeline1 " +
			"call apoc.do.when(me.algo_pref=2, " +
			"'match (o:FriendProfile) where o.userid<>$userid and o.show_me=True and not ((me)-[:REJECTED_REQUEST]->(o) OR (o)<-[:REJECTED_REQUEST]-(me)) and not ((me)-[:BLOCKED]->(o) OR (o)<-[:BLOCKED]-(me)) and not ((me)-[:REQUESTED]->(o)) and not ((me)-[:FRIENDS_WITH]->(o)) AND NOT o.userid IN $uids optional MATCH (me)-[r:SEEN]->(o) optional MATCH (me)-[:interested_in]->(c:FriendsInterests)<-[:interested_in]-(o) WITH me, o, r, COUNT(c) AS common return distinct o, common, r.time order by r.time is null desc, r.time asc, common desc limit 15','',{me:me, userid:$userid,uids:$uids}) yield value as timeline2 " +
			"call apoc.do.when(me.algo_pref=3, " +
			"'match (o:FriendProfile) where o.userid<>$userid and o.show_me=True and not ((me)-[:REJECTED_REQUEST]->(o) OR (o)<-[:REJECTED_REQUEST]-(me)) and not ((me)-[:BLOCKED]->(o) OR (o)<-[:BLOCKED]-(me)) and not ((me)-[:REQUESTED]->(o)) and not ((me)-[:FRIENDS_WITH]->(o)) AND NOT o.userid IN $uids optional MATCH (me)-[r:SEEN]->(o) optional MATCH (me)-[:listens_to]->(c:FriendsArtist)<-[:listens_to]-(o) WITH me, o, r, COUNT(c) AS common return distinct o, common, r.time order by r.time is null desc, r.time asc, common desc limit 15','',{me:me, userid:$userid,uids:$uids}) yield value as timeline3 " +
			"call apoc.do.when(me.algo_pref=4, " +
			"'match (o:FriendProfile) where o.userid<>$userid and o.show_me=True and not ((me)-[:REJECTED_REQUEST]->(o) OR (o)<-[:REJECTED_REQUEST]-(me)) and not ((me)-[:BLOCKED]->(o) OR (o)<-[:BLOCKED]-(me)) and not ((me)-[:REQUESTED]->(o)) and not ((me)-[:FRIENDS_WITH]->(o)) AND NOT o.userid IN $uids optional MATCH (me)-[r:SEEN]->(o) return distinct o, r.time order by r.time is null desc, r.time asc limit 15','',{me:me, userid:$userid,uids:$uids}) yield value as timeline4 " +
			"with CASE WHEN me.algo_pref=0 then timeline0 else CASE WHEN me.algo_pref=1 then timeline1 else CASE WHEN me.algo_pref=2 then timeline2 else CASE WHEN me.algo_pref=3 then timeline3 else CASE WHEN me.algo_pref=4 then timeline4 else [] end end end end end as timeline " +
			"return timeline.o.userid as userid, timeline.o.firstname_display as firstname_display, timeline.o.pronouns as pronouns, timeline.o.year as year, timeline.o.program as program, timeline.o.top_5_spotify as top_5_spotify, timeline.o.badges as badges, timeline.o.classes as classes, timeline.o.interests as interests, timeline.o.bio as bio, timeline.o.image0 as image0, timeline.o.image1 as image1, timeline.o.image2 as image2, timeline.o.image3 as image3")
	public List<FriendsProfileResult> getTimeline(@Param("userid") String userid, @Param("uids") String[] uids);
	
	@Query("match (u:FriendProfile) where u.userid=$userid " + 
			   "match (n:FriendProfile)-[:REQUESTED]->(u) " + 
			   "where n.deleted=false and not (exists((u)-[:BLOCKED]->(n)) OR exists((u)<-[:BLOCKED]-(n)) OR exists((u)-[:FRIENDS_WITH]->(n))) " +
			   "return n.firstname_display as firstname_display, n.image0 as image0, n.userid as userid")
	public List<FriendsProfileResult> getMyRequests(@Param("userid") String userid);
	
	@Query("match (u:FriendProfile) where u.userid=$userid " + 
			"match (n:FriendProfile) where n.userid=$rejectedid " +
			"match (n)-[r:REQUESTED]->(u) " + 
			"merge (u)-[:SEEN]->(n) " +
			"merge (u)-[:REJECTED_REQUEST]->(n) " +
			"delete r")
	public void rejectRequest(@Param("userid") String userid, @Param("rejectedid") String rejectedid);
	
	@Query("match (u:FriendProfile) where u.userid=$userid " + 
			   "match (n:FriendProfile)-[:REQUESTED]->(u) " + 
			   "where n.deleted=false and not (exists((u)-[:BLOCKED]->(n)) OR exists((u)<-[:BLOCKED]-(n)) OR exists((u)-[:FRIENDS_WITH]->(n))) " +
			   "return count(n)")
	public Integer getMyRequestsCount(@Param("userid") String userid);
	
	@Query("match (n:FriendProfile) where n.userid=$userid "
			+ "DETACH DELETE n")
	public void deleteUser(@Param("userid") String userid);
	
	@Query("match (n:FriendProfile) where n.userid=$userid "
			+ "return n.firstname_display as firstname_display, COALESCE(n.lastname,'') as lastname")
	public FriendsProfileResult getUserName(@Param("userid") String userid);
	
	
	////////////////////////
	//Search related queries
	////////////////////////
	@Query("match (me:FriendProfile) where me.userid=$userid " +
			  "match (u:Group) " +
			  "where toLower(COALESCE(u.name,'')) =~ $query_string " +
			  "and u.isPrivate=False " +
			  "and u.deleted=false " +
			"return u.name as name, u.image as image, u.groupid as groupid, u.isPrivate as isPrivate, " +
			"exists((me)-[:MEMBER_OF]->(u)) as isMember, exists((me)-[:CREATED]->(u)) as isGroupAdmin, 1 AS type limit 25")
	public List<SearchResult> searchGroups(@Param("userid") String userid, @Param("query_string") String query_string);
	
	@Query("match (me:FriendProfile) where me.userid=$userid " +
			  "match (u:FriendProfile) " +
			  "where toLower(COALESCE(u.firstname_display,'') + ' ' + COALESCE(u.lastname ,'')) =~ $query_string " +
			  "and not exists((me)-[:BLOCKED]->(u)) " +
			  "and not exists((u)-[:BLOCKED]->(me)) " +
			  "and u.show_me=True " +
			  "and u.deleted=false " +
			  "and u.userid<>$userid " +
			"return u.firstname_display as firstname_display, u.image0 as image0, u.userid as userid, " +
			"u.lastname as lastname, exists((me)-[:REQUESTED]->(u)) as requested, " +
			"exists((me)-[:FRIENDS_WITH]->(u)) as friends, 0 AS type limit 25")
	public List<SearchResult> searchUsers(@Param("userid") String userid, @Param("query_string") String query_string);
	
}
