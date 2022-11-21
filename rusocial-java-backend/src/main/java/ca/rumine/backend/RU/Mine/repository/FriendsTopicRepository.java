package ca.rumine.backend.RU.Mine.repository;

import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import ca.rumine.backend.RU.Mine.model.FriendsTopic;

public interface FriendsTopicRepository extends Neo4jRepository<FriendsTopic, Long> {
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "match (t:FriendsTopic) where t.topic_name=$topic_name "
			+ "MERGE (u)-[:interested_in]->(t)")
	public void connectUserToTopic(@Param("userid") String userid, @Param("topic_name") String topic_name);

}
