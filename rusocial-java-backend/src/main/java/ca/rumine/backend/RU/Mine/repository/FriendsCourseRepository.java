package ca.rumine.backend.RU.Mine.repository;

import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import ca.rumine.backend.RU.Mine.model.FriendsCourse;

public interface FriendsCourseRepository extends Neo4jRepository<FriendsCourse, Long> {
	
	@Query("match (u:FriendProfile) where u.userid=$userid "
			+ "match (c:FriendsCourse) where c.course_code=$course_code "
			+ "MERGE (u)-[:enrolled_in]->(c)")
	public void connectUserToClass(@Param("userid") String userid, @Param("course_code") String course_code);

}