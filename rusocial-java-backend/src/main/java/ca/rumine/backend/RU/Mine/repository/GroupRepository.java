package ca.rumine.backend.RU.Mine.repository;


import java.util.List;

import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import ca.rumine.backend.RU.Mine.model.Group;
import ca.rumine.backend.RU.Mine.model.GroupMember;
import ca.rumine.backend.RU.Mine.model.GroupResult;
import ca.rumine.backend.RU.Mine.model.PostAndLikes;

public interface GroupRepository extends Neo4jRepository<Group, Long> {

	@Query("match (me:FriendProfile) where me.userid=$useridMe "
			+ "match (n:FriendProfile) where n.userid=$userid "
			+ "and ((me)-[:FRIENDS_WITH]->(n) and not (exists((me)-[:BLOCKED]->(n)) or exists((me)<-[:BLOCKED]-(n)))) "
			+ "match (g:Group) where g.groupid=$groupid "
			+ "and exists((me)-[:MEMBER_OF]->(g)) "
			+ "merge (n)-[:MEMBER_OF]->(g)")
	public void addFriendToGroup(@Param("userid") String userid, @Param("groupid") String groupid, @Param("useridMe") String useridMe);
	
	@Query("match (n:FriendProfile) where n.userid=$userid "
			+ "match (g:Group) where g.groupid=$groupid "
			+ "merge (n)-[:MEMBER_OF]->(g)")
	public void joinGroup(@Param("userid") String userid, @Param("groupid") String groupid);
	
	@Query("match (n:FriendProfile) where n.userid=$userid "
			+ "match (g:Group) where g.groupid=$groupid "
			+ "create (n)-[:CREATED]->(g) "
			+ "create (n)-[:MEMBER_OF]->(g)")
	public void addCreatorOfGroup(@Param("userid") String userid, @Param("groupid") String groupid);
	
	@Query("match (g:Group) where g.groupid=$groupid "
			+ "match (me:FriendProfile) where me.userid=$userid "
			+ "match (me)-[:CREATED]->(g) "
			+ "set g.deleted=true")
	public void removeGroup(@Param("groupid") String groupid, @Param("userid") String userid);
	
	@Query("match (me:FriendProfile) where me.userid=$userid "
			+ "match (g:Group) where g.groupid=$groupid "
			+ "match (me)-[:CREATED]->(g) "
			+ "set g.name=$name "
			+ "return exists((me)-[:CREATED]->(g)) as allowChange")
	public Boolean updateName(@Param("groupid") String groupid, @Param("name") String name, @Param("userid") String userid);
	
	@Query("match (g:Group) where g.groupid=$groupid "
			+ "match (me:FriendProfile) where me.userid=$useridMe "
			+ "match (n:FriendProfile) where n.userid=$userid "
			+ "and (me)-[:FRIENDS_WITH]->(n) "
			+ "match (n)-[r:MEMBER_OF]->(g)<-[:CREATED]-(me) "
			+ "DELETE (r) "
			+ "return exists((n)-[:MEMBER_OF]->(g))")
	public Boolean removeFriendFromGroup(@Param("groupid") String groupid, @Param("userid") String userid, @Param("useridMe") String useridMe);
	
	@Query("match (g:Group) where g.groupid=$groupid "
			+ "match (n:FriendProfile) where n.userid=$userid "
			+ "match (g)<-[r:CREATED]-(n) "
			+ "set g.deleted = true "
			+ "return exists((n)-[:CREATED]->(g)) as allowChange")
	public Boolean deleteGroup(@Param("groupid") String groupid, @Param("userid") String userid);
	
	@Query("match (g:Group) where g.deleted=false "
			+ "match (n:FriendProfile) where n.userid=$userid "
			+ "match (g)<-[r:MEMBER_OF]-(n) "
			+ " return g.groupid as groupid, g.name as name, g.image as image, g.isPrivate as isPrivate, exists((n)-[:CREATED]->(g)) as isGroupAdmin")
	public List<GroupResult> getAllUserGroups(@Param("userid") String userid);
	
	@Query("match (g:Group) where g.groupid=$groupid and g.deleted=false "
			+ "match (me:FriendProfile) where me.userid=$userid "
			+ "match (me)-[:MEMBER_OF]->(g)<-[r:MEMBER_OF]-(n) where n.userid <> me.userid AND not (exists((me)-[:BLOCKED]->(n)) or exists((n)<-[:BLOCKED]-(me)))"
			+ " return n.firstname_display as first_name, COALESCE(n.lastname, \"\") as last_name, n.userid as userid, n.image0 as profile_picture ORDER BY n.firstname_display DESC")
	public List<GroupMember> getAllGroupMembers(@Param("groupid") String groupid, @Param("userid") String userid);
	
	@Query("match (g:Group) where g.groupid=$groupid and g.deleted=false "
			+ "match (n:FriendProfile) where n.userid=$userid "
			+ "match (g)<-[r:MEMBER_OF]-(n) "
			+ "delete r "
			+ "return exists((g)<-[:MEMBER_OF]-(n))")
	public Boolean leaveGroup(@Param("groupid") String groupid, @Param("userid") String userid);
	
	@Query("match (me:FriendProfile) where me.userid=$userid " +
			"match (g:Group) where g.groupid=$groupid and g.deleted=false " + 
			"return g.name as name, g.groupid as groupid, g.image as image, g.isPrivate as isPrivate, exists((me)-[:MEMBER_OF]->(g)) as isMember, exists((me)-[:CREATED]->(g)) as isGroupAdmin")
	public GroupResult getDetails(@Param("groupid") String groupid, @Param("userid") String userid);
	
	@Query("match (g:Group) where g.groupid=$groupid and g.deleted=false " +
			"match (me:FriendProfile) where me.userid=$userid " +
			"match (poster:FriendProfile)-[:POSTED]->(p {deleted: false})-[:POSTED_IN | :SHARED_TO]->(g) " +
			//"optional match (poster:UserProfile)-[:POSTED]->(p {deleted: false})-[:SHARED_TO]->(g) " +
			"where not (exists((poster)-[:BLOCKED]->(me)) or exists((poster)<-[:BLOCKED]-(me))) " +
			"and (poster.deleted is null or poster.deleted=false) " +
			"and p.time_submitted < $before_time " +
			"optional match (g)<-[:POSTED_IN]-(p)<-[:COMMENTED_ON]-(c:Comment {deleted: false})<-[:COMMENTED]-(n) " +
			//"optional match (g)<-[:SHARED_TO]-(p)<-[:COMMENTED_ON]-(c:Comment)<-[:COMMENTED]-(n) " + //adding this makes blocked user's comments appear, be careful!
			"where not (exists((me)-[:BLOCKED]->(n)) or exists((n)<-[:BLOCKED]-(me))) and (n.deleted is null or n.deleted=false) " +
			"call apoc.cypher.run('optional match (comment:Comment {deleted: false})-[r:COMMENTED_ON]->(p) return count(r) as count', {p:p}) yield value as noc " +
			"call apoc.cypher.run('optional match (p)-[r:SHARED_TO]->(g:Group) return count(r) as count', {p:p}) yield value as nos " +
			"call apoc.cypher.run('optional match (u:FriendProfile)-[r:LIKED]->(p) return count(r) as count', {p:p}) yield value as nol " +
			"call apoc.cypher.run('optional match (u:FriendProfile)-[r:LIKED]->(c) return count(r) as count', {c:c}) yield value as nocl " +
			"call apoc.when(COALESCE(p.isAnon,false) = true,'return \"-1\" as userid, p.anon_name as first_name, \"\" as last_name, \"anon\" as profile_picture','return poster.userid as userid, poster.firstname_display as first_name, COALESCE(poster.lastname,\"\") as last_name, poster.image0 as profile_picture',{p:p,poster:poster}) yield value as poster_details " +
			"return " +
			"poster_details.userid as userid, poster_details.first_name as first_name, poster_details.profile_picture as profile_picture, COALESCE(poster_details.last_name,\"\") as last_name, " + 
			"case when p.isAnon = true then " +
			"collect({likes:nocl.count, first_name: c.anon_name, last_name: \"\", userid:\"-1\", text:c.text, " +
			"profile_picture:\"anon\", commentid: c.commentid, liked:exists((me)-[:LIKED]->(c))})[..1] " +
			"else " +
			"collect({time_submitted: c.time_submitted, likes:nocl.count, first_name: n.firstname_display, last_name: COALESCE(n.lastname,\"\"), userid:n.userid, text:c.text, " +
				"profile_picture:n.image0, commentid: c.commentid, liked:exists((me)-[:LIKED]->(c)), isMine:exists((me)-[:COMMENTED]->(c))})[..1] end as comment, " +
			"p.postid as postid, p.text as text, p.type as type, p.media as media, " +
			"p.allowSharing as allowSharing, p.allowComments as allowComments, " +
			"p.time_submitted as time_submitted, nol.count as likes, noc.count as comments, nos.count as shares, " +
			"CASE when g.isPrivate = true then true when p.isAnon = true then true else false end as isPrivate, exists((me)-[:LIKED]->(p)) as liked, exists((me)-[:POSTED]->(p)) as isMine order by p.time_submitted DESC skip $offset limit 15")
	public List<PostAndLikes> getGroupPosts(@Param("groupid") String groupid, @Param("userid") String userid, @Param("offset") Integer offset, @Param("before_time") Long before_time);
	
	@Query("match (me:FriendProfile) where me.userid=$userid "
			+ "match (g:Group) where g.groupid=$groupid "
			+ "match (me)-[:CREATED]->(g) "
			+ "set g.image=$reference "
			+ "return exists((me)-[:CREATED]->(g)) as allowChange")
	public Boolean editGroupPicture(@Param("userid") String userid, @Param("groupid") String groupid, @Param("reference") String reference);
	
	@Query("match (g:Group) where g.groupid=$groupid and g.deleted=false " + 
			"match (u:FriendProfile)-[:CREATED]->(g) where u.deleted=False " +
			"return u.userid as userid")
	public String getGroupCreatorUserid(@Param("groupid") String groupid);
	
	@Query("match (g:Group) where g.groupid=$groupid and g.deleted=false " + 
			"optional match (u:FriendProfile)-[r:MEMBER_OF]->(g) " +
			"return g.name as name, g.image as image, count(r) as numberOfMembers")
	public GroupResult getGroupNameAndMembers(@Param("groupid") String groupid);

}
