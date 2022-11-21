package ca.rumine.backend.RU.Mine.repository;


import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import ca.rumine.backend.RU.Mine.model.CommentsAndLikes;
import ca.rumine.backend.RU.Mine.model.GroupResult;
import ca.rumine.backend.RU.Mine.model.Post;
import ca.rumine.backend.RU.Mine.model.PostAndLikes;
import ca.rumine.backend.RU.Mine.model.UserResult;

public interface PostRepository extends Neo4jRepository<Post, Long> {
	
	@Query("match (p:Post) where p.postid=$postid "
			+ "match (n:FriendProfile) where n.userid=$userid "
			+ "merge (n)-[:POSTED]->(p)")
	public void connectPosterToPost(@Param("postid") String postid, @Param("userid") String userid);
	
	@Query("match (g:Group) where g.groupid=$groupid "
			+ "match (p:Post) where p.postid=$postid "
			+ "match (me:FriendProfile) where me.userid=$userid "
			+ "match (me)-[:MEMBER_OF]->(g) "
			+ "merge (p)-[:POSTED_IN]->(g)")
	public void addPostToGroup(@Param("postid") String postid, @Param("groupid") String groupid, @Param("userid") String userid);
	
	@Query("match (p:Post) where p.postid=$postid " +
			"match (n:FriendProfile) where n.userid=$userid " +
			"match (poster:FriendProfile)-[:POSTED]->(p) " +
			"where not (exists((n)-[:BLOCKED]->(poster)) or exists((n)<-[:BLOCKED]-(poster))) " +
			"call apoc.do.when(exists((n)-[:LIKED]->(p)), " +
			"'match (n)-[r:LIKED]->(p) delete r return false as created', " +
			"'create (n)-[:LIKED]->(p) return true as created', " +
			"{n:n,p:p}) yield value " +
			"return case when p.isAnon = true then \"Someone\" else n.firstname_display end as first_name, poster.userid as userid, value.created as created")
	public UserResult likePost(@Param("postid") String postid, @Param("userid") String userid);
	
	@Query("match (p:Post) where p.postid=$postid " +
			"match (g:Group) where g.groupid=$groupid " +
			"match (me:FriendProfile) where me.userid=$userid " +
			"match (poster:FriendProfile)-[:POSTED]->(p) where not (exists((poster)-[:BLOCKED]->(me)) " +
			"or exists((poster)<-[:BLOCKED]-(me))) " +
			"call apoc.do.when(exists((p)-[:SHARED_TO {userid: $userid}]->(g)), " +
			"'return false as created', " +
			"'create (p)-[r:SHARED_TO {userid: userid, name: name, shared_time: time}]->(g) " +
			"return true as created', {p:p, g:g, userid: $userid, name: $name, time: $time}) YIELD value " +
			"return poster.userid as userid, me.firstname_display as first_name, value.created as created")
	public UserResult sharePost(@Param("groupid") String groupid, @Param("postid") String postid, @Param("userid") String userid, @Param("name") String name, @Param("time") Date time);
	
	@Query("match (p:Post) where p.postid=$postid " + 
			"match (me:FriendProfile) where me.userid=$userid " + 
			"match (n:FriendProfile) " + 
			"match (o:FriendProfile) " + 
			"match (c:Comment {deleted: false}) " + 
			"match (c)-[:COMMENTED_ON]->(p) where p.deleted=false " + 
			"match (n)-[:COMMENTED]->(c) where n.deleted=false and not exists((me)-[:BLOCKED]->(n)) and not exists((me)<-[:BLOCKED]-(n)) " + 
			"match (o)-[:POSTED]->(p) where o.deleted=false and not exists((me)-[:BLOCKED]->(o)) and not exists((me)<-[:BLOCKED]-(o)) " +   
			"match (p)-[:POSTED_IN]->(g:Group) where (g.isPrivate=false OR exists((me)-[:MEMBER_OF]->(g))) " + 
			"optional match (:FriendProfile)-[lc:LIKED]->(c) " + 
			"call apoc.when(COALESCE(p.isAnon, false) = true,'return \"-1\" as userid, c.anon_name as first_name, \"\" as last_name, \"anon\" as profile_picture','return n.userid as userid, n.firstname_display as first_name, COALESCE(n.lastname, \"\") as last_name, n.image0 as profile_picture',{p:p,n:n,c:c}) yield value as poster_details " +
			"return " +
			"poster_details.userid as userid, poster_details.first_name as first_name, poster_details.profile_picture as profile_picture, poster_details.last_name as last_name, " + 
			"exists((me)-[:LIKED]->(c)) as liked, c.time_submitted as time_submitted, c.text as text, c.commentid as commentid, count(lc) as likes, exists((me)-[:COMMENTED]->(c)) as isMine order by c.time_submitted ASC")
	public List<CommentsAndLikes> getCommentsAndLikes(@Param("postid") String postid, @Param("userid") String userid);
	
	@Query("match (me:FriendProfile) where me.userid=$userid " +
			"match (poster:FriendProfile)-[:POSTED]->(p) " +
			"where not (exists((poster)-[:BLOCKED]->(me)) or exists((poster)<-[:BLOCKED]-(me))) " +
			"and (poster.deleted is null or poster.deleted=false) " +
			"and p.postid in $postids and p.deleted=false " +
			"optional match (me)-[:MEMBER_OF]->(g)<-[:POSTED_IN]-(p)<-[:COMMENTED_ON]-(c:Comment)<-[:COMMENTED]-(n) " +
			"optional match (me)-[:MEMBER_OF]->(g)<-[:SHARED_TO]-(p)<-[:COMMENTED_ON]-(c:Comment)<-[:COMMENTED]-(n) " +
			"where not (exists((me)-[:BLOCKED]->(n)) or exists((n)<-[:BLOCKED]-(me))) and (n.deleted is null or n.deleted=false) " +
			"call apoc.cypher.run('match (p)-[:POSTED_IN]->(g:Group) where g.isPrivate=false and g.isAnon=false return collect(g.isPrivate)[0] as private', {p:p}) yield value as group " +
			"call apoc.cypher.run('match (p)-[:SHARED_TO|:POSTED_IN]->(g:Group)<-[:MEMBER_OF]-(me) return collect(g.name)[0] as name, collect(g.groupid)[0] as groupid', {p:p, me:me}) yield value as gname " +
			"call apoc.cypher.run('optional match (comment:Comment)-[r:COMMENTED_ON]->(p) return count(r) as count', {p:p}) yield value as noc " +
			"call apoc.cypher.run('optional match (p)-[r:SHARED_TO]->(g:Group) return count(r) as count', {p:p}) yield value as nos " +
			"call apoc.cypher.run('optional match (u:FriendProfile)-[r:LIKED]->(p) return count(r) as count', {p:p}) yield value as nol " +
			"call apoc.cypher.run('optional match (u:FriendProfile)-[r:LIKED]->(c) return count(r) as count', {c:c}) yield value as nocl " +
			"call apoc.when(COALESCE(p.isAnon, false) = true,'return \"-1\" as userid, p.anon_name as first_name, \"\" as last_name, \"anon\" as profile_picture','return poster.userid as userid, poster.firstname_display as first_name, COALESCE(poster.lastname,\"\") as last_name, poster.image0 as profile_picture',{p:p,poster:poster}) yield value as poster_details " +
			"return " +
			"poster_details.userid as userid, poster_details.first_name as first_name, poster_details.profile_picture as profile_picture, poster_details.last_name as last_name, " + 
			"case when p.isAnon = true then " +
			"collect({likes:nocl.count, first_name: c.anon_name, last_name: \"\", userid:\"-1\", text:c.text, " +
			"profile_picture:\"anon\", commentid: c.commentid, liked:exists((me)-[:LIKED]->(c))})[..1] " +
			"else " +
			"collect({likes:nocl.count, first_name: n.first_name, last_name: n.last_name, userid:n.userid, text:c.text, " +
				"profile_picture:n.profile_picture, commentid: c.commentid, liked:exists((me)-[:LIKED]->(c))})[..1] end as comment, " +
			"p.postid as postid, p.type as type, p.text as text, p.media as media, " +
			"p.time_submitted as time_submitted, nol.count as likes, noc.count as comments, nos.count as shares, " +
			"p.allowSharing as allowSharing, p.allowComments as allowComments, " +
			"CASE when p.isAnon = true then true when group.private is null then true else false end as isPrivate, exists((me)-[:LIKED]->(p)) as liked, gname.groupid as groupid, gname.name as name, exists((me)-[:POSTED]->(p)) as isMine")
	public List<PostAndLikes> getTimeline(@Param("userid") String userid, @Param("postids") Collection<String> postids);
	
	@Query("match (me:FriendProfile) where me.userid=$userid " +
			"match (poster:FriendProfile)-[:POSTED]->(p) " +
			"where not (exists((poster)-[:BLOCKED]->(me)) or exists((poster)<-[:BLOCKED]-(me))) " +
			"and (poster.deleted is null or poster.deleted=false) " +
			"and p.postid = $postid and p.deleted=false " +
			"call apoc.cypher.run('match (p)-[:POSTED_IN]->(g:Group) where g.isPrivate=false and (g.isAnon=false OR g.isAnon is null) return collect(g.isPrivate)[0] as private', {p:p}) yield value as group " +
			"call apoc.cypher.run('match (p)-[:SHARED_TO|:POSTED_IN]->(g:Group) where (exists((me)-[:MEMBER_OF]->(g)) OR g.isPrivate=false) return collect({name:g.name, groupid:g.groupid})[0] as gd', {p:p, me:me}) yield value as group_details " +
			"call apoc.cypher.run('optional match (comment:Comment {deleted: false})-[r:COMMENTED_ON]->(p) return count(r) as count', {p:p}) yield value as noc " +
			"call apoc.cypher.run('optional match (p)-[r:SHARED_TO]->(g:Group) return count(r) as count', {p:p}) yield value as nos " +
			"call apoc.cypher.run('optional match (u:FriendProfile)-[r:LIKED]->(p) return count(r) as count', {p:p}) yield value as nol " +
			"call apoc.when(COALESCE(p.isAnon, false) = true,'return \"-1\" as userid, p.anon_name as first_name, \"\" as last_name, \"anon\" as profile_picture','return poster.userid as userid, poster.firstname_display as first_name, COALESCE(poster.lastname,\"\") as last_name, poster.image0 as profile_picture',{p:p,poster:poster}) yield value as poster_details " +
			"return " +
			"poster_details.userid as userid, poster_details.first_name as first_name, poster_details.profile_picture as profile_picture, poster_details.last_name as last_name, " + 
			"p.postid as postid, p.type as type, p.text as text, p.media as media, " +
			"p.allowSharing as allowSharing, p.allowComments as allowComments, " +
			"p.time_submitted as time_submitted, nol.count as likes, noc.count as comments, nos.count as shares, " +
			"CASE when p.isAnon = true then true when group.private is null then true  else false end as isPrivate, exists((me)-[:LIKED]->(p)) as liked, group_details.gd.name as name, group_details.gd.groupid as groupid, exists((me)-[:POSTED]->(p)) as isMine")
	public PostAndLikes getPostAndLikes(@Param("postid") String postid, @Param("userid") String userid);
	
	@Query("match (p:Post) where p.postid=$postid " +
			"return p.media as media")
	public PostAndLikes getPostMedia(@Param("postid") String postid);
	
	@Query("match (me:FriendProfile) where me.userid=$userid " +
			"match (p:Post) where p.postid=$postid " +
			"and exists((me)-[:POSTED]->(p)) " +
			"set p.text = $text " + 
			"set p.media = [] " + 
			"set p.type = 0")
	public void editTextAndRemoveMedia(@Param("userid") String userid, @Param("postid") String postid, @Param("text") String text);
	
	@Query("match (me:FriendProfile) where me.userid=$userid " +
			"match (p:Post) where p.postid=$postid " +
			"and exists((me)-[:POSTED]->(p)) " +
			"set p.text = $text " + 
			"set p.allowSharing = $allowSharing " +
			"set p.allowComments = $allowComments " +
			"set p.media = $media ")
	public void editTextAndMedia(@Param("userid") String userid, @Param("postid") String postid, @Param("text") String text, @Param("allowSharing") Boolean allowSharing, @Param("allowComments") Boolean allowComments, @Param("media") String[] media);
	
	@Query("match (me:FriendProfile) where me.userid=$userid " +
			"match (p:Post) where p.postid=$postid " +
			"and exists((me)-[:POSTED]->(p)) " +
			"set p.text = $text " +
			"set p.allowSharing = $allowSharing " +
			"set p.allowComments = $allowComments")
	public void editText(@Param("userid") String userid, @Param("postid") String postid, @Param("text") String text, @Param("allowSharing") Boolean allowSharing, @Param("allowComments") Boolean allowComments);
	
	@Query("match (me:FriendProfile) where me.userid=$userid " +
			"match (p:Post) where p.postid=$postid " +
			"and exists((me)-[:POSTED]->(p)) " +
			"set p.deleted = true ")
	public void deletePost(@Param("userid") String userid, @Param("postid") String postid);
	
	@Query("match (p:Post)-[:POSTED_IN|:SHARED_TO]->(g:Group) where p.postid = $postid " + 
			"and (g.deleted = false or g.deleted is null) " +
			"return g.name as name, g.image as image, g.groupid as groupid, EXISTS((p)-[:SHARED_TO]->(g)) as shared")
	public List<GroupResult> getPostInGroups(@Param("postid") String postid);
	
	@Query("match (me:FriendProfile) where me.userid = $userid " + 
			"match (me)-[:POSTED]->(p:Post)-[r]->(g:Group) " +
			"where p.postid = $postid and g.groupid = $groupid " +
			"delete r " + 
			"return count(r)")
	public Integer removePostInGroup(@Param("userid") String userid, @Param("postid") String postid, @Param("groupid") String groupid);
	
	@Query("match (me:FriendProfile) where me.userid = $userid " + 
			"match (me)-[:POSTED]->(p:Post) " +
			"where p.postid = $postid " +
			"set p.deleted=true")
	public void removePostAndComments(@Param("userid") String userid, @Param("postid") String postid);

}
