package ca.rumine.backend.RU.Mine.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ca.rumine.backend.RU.Mine.model.SettingsToggle;

@Repository
public interface SettingsRepository extends JpaRepository<SettingsToggle, Long> {
	
	@Transactional
	@Modifying
	@Query("UPDATE SettingsToggle SET allow_notifications=:toggle WHERE userid = :userid") 
    void setAllowNotification(@Param("userid") String userid, @Param("toggle") Boolean toggle);
	
	@Transactional
	@Modifying
	@Query("UPDATE SettingsToggle SET allow_location_tracking=:toggle WHERE userid = :userid") 
    void setAllowLocation(@Param("userid") String userid, @Param("toggle") Boolean toggle);
	
	@Transactional
	@Modifying
	@Query("UPDATE SettingsToggle SET profile_made='t' WHERE userid = :userid") 
    void setProfileMade(@Param("userid") String userid);
}
