package ca.rumine.analythics.repositories;

import java.util.List;

import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import ca.rumine.analythics.models.NeoModel;

public interface NeoRepository extends Neo4jRepository<NeoModel, Long> {
	
	@Query("MATCH (b:FriendProfile) WHERE b.createdAt > $midnight RETURN COUNT(b)")
	public Integer getNewFriendProfiles(@Param("midnight") Long midnight);
	
	@Query("MATCH (g:Group) WHERE g.time_created > $midnight RETURN COUNT(g)")
	public Integer getGroupsCreated(@Param("midnight") Long midnight);
	
	@Query("MATCH (p:Post) WHERE p.time_submitted > $midnight RETURN COUNT(p)")
	public Integer getPostsCreated(@Param("midnight") Long midnight);
	
	@Query("MATCH (c:Comment) WHERE c.time_submitted > $midnight RETURN COUNT(c)")
	public Integer getCommentsCreated(@Param("midnight") Long midnight);
	
	@Query("MATCH (b:FriendProfile) WHERE b.last_seen > $midnight RETURN COUNT(b)")
	public Integer getActiveFriendProfiles(@Param("midnight") Long midnight);
	
	@Query("MATCH (b:FriendProfile) WHERE NOT b.userid IN $uids AND b.last_seen > $midnight RETURN COUNT(b)")
	public Integer getActiveFriendProfilesExclusion(@Param("midnight") Long midnight, @Param("uids") List<String> uids);
	
	@Query("MATCH (b:FriendProfile) MATCH (b2:FriendProfile) MATCH (b)-[r:SEEN]->(b2) WHERE r.time is not null and apoc.date.parse(replace(substring(toString(r.time),0,19), 'T', ' ')) > $midnight return count(r)")
	public Integer getFriendSwipes(@Param("midnight") Long midnight);
	
	@Query("MATCH (b:FriendProfile) MATCH (b2:FriendProfile) MATCH (b)-[r:FRIENDS_WITH]->(b2) RETURN COUNT(r)")
	public Integer getTotalFriends();
	
	@Query("MATCH (b:FriendProfile) MATCH (b2:FriendProfile) MATCH (b)-[r:REQUESTED]->(b2) RETURN COUNT(r)")
	public Integer getTotalFriendRequests();
	
}
