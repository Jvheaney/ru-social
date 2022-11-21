package ca.rumine.backend.RU.Mine.repository;

import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import ca.rumine.backend.RU.Mine.model.FriendsArtist;

public interface FriendsArtistRepository extends Neo4jRepository<FriendsArtist, Long> {
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "match (a:FriendsArtist) where a.artist_id=$artist_id "
			+ "MERGE (u)-[:listens_to]->(a)")
	public void connectUserToArtist(@Param("userid") String userid, @Param("artist_id") String artist_id);

}
