package ca.rumine.backend.RU.Mine.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ca.rumine.backend.RU.Mine.model.GroupDetails;

@Repository
public interface GroupDetailsRepository extends JpaRepository<GroupDetails, Long> {

	@Transactional
	@Modifying
	@Query(value = "UPDATE group_details SET isactive='f' WHERE groupid=:groupid", nativeQuery = true) 
    void setGroupInactive(@Param("groupid") String groupid);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE group_details SET name=:name WHERE groupid=:groupid", nativeQuery = true) 
    void setGroupName(@Param("groupid") String groupid, @Param("name") String name);
	
	@Query(value = "SELECT name FROM group_details WHERE groupid=:groupid AND isactive", nativeQuery = true) 
    String getGroupName(@Param("groupid") String groupid);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE group_details SET image=:image WHERE groupid=:groupid", nativeQuery = true) 
    void setGroupImage(@Param("groupid") String groupid, @Param("image") String image);
	
}
