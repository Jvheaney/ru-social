package ca.rumine.backend.RU.Mine.repository;

import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import ca.rumine.backend.RU.Mine.model.Comment;
import ca.rumine.backend.RU.Mine.model.UserResult;


public interface CommentRepository extends Neo4jRepository<Comment, Long> {

	@Query("match (poster:FriendProfile)-[:POSTED]->(p:Post) where p.postid=$postid " +
			"match (n:FriendProfile) where n.userid=$userid " +
			"match (c:Comment) where c.commentid=$commentid " +
			"create (n)-[:COMMENTED]->(c) " +
			"create (c)-[:COMMENTED_ON]->(p) " +
			"with poster, p, n, c "
			+ "call apoc.do.when(COALESCE(p.isAnon, false) = true, "
			+ "'SET c.anon_name = poster.anon_name return poster, n', "
			+ "'return poster, n', {n:n, p:p, poster:poster, c:c}) yield value " +
			"return case when p.isAnon = true then \"Someone\" else n.firstname_display end as first_name, poster.userid as userid")
	public UserResult connectCommentToPostAndCommenterToComment(@Param("postid") String postid, @Param("commentid") String commentid, @Param("userid") String userid);

	
	@Query("match (c:Comment) where c.commentid=$commentid " +
			"match (n:FriendProfile) where n.userid=$userid " +
			"match (commenter:FriendProfile)-[:COMMENTED]->(c) " +
			"where not (exists((n)-[:BLOCKED]->(commenter)) or exists((n)<-[:BLOCKED]-(commenter))) " +
			"call apoc.do.when(exists((n)-[:LIKED]->(c)), " +
			"'match (n)-[r:LIKED]->(c) delete r return false as created', " +
			"'create (n)-[:LIKED]->(c) return true as created', " +
			"{n:n,c:c}) yield value " +
			"return case when c.anon_name is null then n.firstname_display else \"Someone\" end as first_name, commenter.userid as userid, value.created as created")
	public UserResult likeComment(@Param("commentid") String commentid, @Param("userid") String userid);
	
	@Query("match (me:FriendProfile) where me.userid=$userid " +
			"match (c:Comment) where c.commentid=$commentid " +
			"and exists((me)-[:COMMENTED]->(c)) " +
			"set c.deleted = true ")
	public void deleteComment(@Param("userid") String userid, @Param("commentid") String commentid);
	
}