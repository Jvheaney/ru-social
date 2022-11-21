package ca.rumine.backend.RU.Mine.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ca.rumine.backend.RU.Mine.model.GroupMembership;

@Repository
public interface GroupMembershipRepository extends JpaRepository<GroupMembership, Long> {

	@Query("SELECT gm FROM GroupMembership gm WHERE groupid = :groupid AND userid = :userid") 
    GroupMembership getPermissions(@Param("groupid") String groupid, @Param("userid") String userid);
	
	@Transactional
	@Modifying
	@Query(value = "DELETE FROM group_membership WHERE groupid=:groupid AND userid=:userid", nativeQuery = true) 
    void revokeGroupMembership(@Param("groupid") String groupid, @Param("userid") String userid);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE group_membership SET isactive='f' WHERE groupid=:groupid", nativeQuery = true) 
    void setGroupInactive(@Param("groupid") String groupid);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE group_membership SET post_notifs_enabled=:toggle WHERE groupid=:groupid AND userid=:userid", nativeQuery = true) 
    void togglePostNotifs(@Param("groupid") String groupid, @Param("userid") String userid, @Param("toggle") Boolean toggle);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE group_membership SET chat_notifs_enabled=:toggle WHERE groupid=:groupid AND userid=:userid", nativeQuery = true) 
    void toggleChatNotifs(@Param("groupid") String groupid, @Param("userid") String userid, @Param("toggle") Boolean toggle);
	
	@Query(value = "SELECT isactive FROM group_membership WHERE groupid=:groupid AND userid=:userid", nativeQuery = true) 
    Boolean canAccessGroupChat(@Param("userid") String userid, @Param("groupid") String groupid);
	
	
	
}
