package ca.rumine.backend.RU.Mine.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ca.rumine.backend.RU.Mine.model.MatchEncKeys;
import ca.rumine.backend.RU.Mine.model.UploadedImage;

@Repository
public interface MatchEncKeysRepository extends JpaRepository<MatchEncKeys, Long> {

	@Query("SELECT mek FROM MatchEncKeys mek WHERE matchid = :matchid") 
    MatchEncKeys getKeySet(@Param("matchid") String matchid);
	
}
