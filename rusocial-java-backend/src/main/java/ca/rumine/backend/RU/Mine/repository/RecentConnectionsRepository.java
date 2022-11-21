package ca.rumine.backend.RU.Mine.repository;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ca.rumine.backend.RU.Mine.model.RecentConnection;

@Repository
public interface RecentConnectionsRepository extends JpaRepository<RecentConnection, Long> {
	
	@Transactional
	@Modifying
	@Query(value = "DELETE FROM recent_connections WHERE ((userid=:userid AND connection_userid=:otherUserid) OR (userid=:otherUserid AND connection_userid=:userid)) AND type=:type", nativeQuery = true) 
    void removeFromRecentConnections(@Param("userid") String userid, @Param("otherUserid") String otherUserid, @Param("type") Integer type);
	
	@Query(value = "select rc.connection_userid as userid, coalesce(prof.image0,fprof.image0) as image0, coalesce(prof.firstname_display,fprof.firstname_display) as firstname_display, rc.type as type from recent_connections rc left outer join profiles prof on (prof.userid = rc.connection_userid and rc.type=0) left outer join friends_profiles fprof on (fprof.userid = rc.connection_userid and rc.type=1) where rc.userid=:userid ORDER BY rc.uniqid DESC", nativeQuery=true)
	ArrayList<String[]> getRecentConnections(@Param("userid") String userid);

}
