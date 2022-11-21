package ca.rumine.backend.RU.Mine.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ca.rumine.backend.RU.Mine.model.Swipe;


@Repository
public interface SwipeRepository extends JpaRepository<Swipe, Long> {
	
	@Query("SELECT s FROM Swipe s WHERE userid = :swipeid AND swipeid=:userid AND liked='t'") 
    Swipe checkMatch(@Param("userid") String userid, @Param("swipeid") String swipeid);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE swipe_history SET liked= :liked, time='now()' WHERE userid=:userid AND swipeid=:swipeid", nativeQuery = true) 
    void updateSwipeHistory(@Param("swipeid") String swipeid, @Param("userid") String userid, @Param("liked") Boolean liked);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE tracker SET value=value + 1 WHERE tracking_item='swipes'", nativeQuery = true) 
    void incrementSwipe();
	
	@Transactional
	@Modifying
	@Query(value = "INSERT INTO reswipe_history (userid, swipeid, liked, time) VALUES (:userid, :swipeid, :liked, 'now()')", nativeQuery = true) 
    void saveReswipe(@Param("userid") String userid, @Param("swipeid") String swipeid, @Param("liked") Boolean liked);
}
