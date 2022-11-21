package ca.rumine.backend.RU.Mine.repository;

import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import ca.rumine.backend.RU.Mine.model.FriendsProgram;

public interface FriendsProgramRepository extends Neo4jRepository<FriendsProgram, Long> {
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "match (p:FriendsProgram) where p.program_name=$program_name "
			+ "MERGE (u)-[:belongs_to]->(p)")
	public void connectUserToProgram(@Param("userid") String userid, @Param("program_name") String program_name);

}
