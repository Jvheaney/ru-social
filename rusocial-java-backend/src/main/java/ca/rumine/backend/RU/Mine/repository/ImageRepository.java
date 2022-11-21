package ca.rumine.backend.RU.Mine.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ca.rumine.backend.RU.Mine.model.UploadedImage;

@Repository
public interface ImageRepository extends JpaRepository<UploadedImage, Long>{
	
	@Transactional
	@Modifying
	@Query("UPDATE UploadedImage SET deleted='t' WHERE userid = :userid AND imgnum=:imgnum") 
    void deleteOldPhoto(@Param("userid") String userid, @Param("imgnum") Integer imgnum);
	
	@Query("SELECT ui FROM UploadedImage ui WHERE userid = :userid AND deleted='f' ORDER BY imgnum") 
    UploadedImage[] getAllUserPhotos(@Param("userid") String userid);
	
}
