package ca.rumine.backend.RU.Mine.repository;

import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import ca.rumine.backend.RU.Mine.model.FriendsInterests;

public interface FriendsInterestsRepository extends Neo4jRepository<FriendsInterests, Long> {
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "match (i:FriendsInterests) where i.interest_name=$interest_name "
			+ "MERGE (u)-[:interested_in]->(i)")
	public void connectUserToInterest(@Param("userid") String userid, @Param("interest_name") String interest_name);

}
