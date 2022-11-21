package ca.rumine.analythics.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ca.rumine.analythics.models.ReportingAnalytics;

@Repository
public interface ReportingAnalyticsRepository extends JpaRepository<ReportingAnalytics, Long> {
	
	@Query(value = "SELECT COUNT(*) FROM users WHERE registered > date_trunc('day', now())", nativeQuery = true) 
    Integer getNewUsers();
	
	@Query(value = "SELECT COUNT(*) FROM profiles WHERE created_at > date_trunc('day', now())", nativeQuery = true) 
    Integer getNewDatingProfiles();
	
	@Query(value = "SELECT COUNT(*) FROM messages WHERE matchid NOT LIKE 'gid$%' AND time_sent > date_trunc('day', now())", nativeQuery = true) 
    Integer getPersonalMessagesSent();
	
	@Query(value = "SELECT COUNT(*) FROM messages WHERE matchid LIKE 'gid$%' AND time_sent > date_trunc('day', now())", nativeQuery = true) 
    Integer getGroupMessagesSent();
	
	@Query(value = "SELECT COUNT(*) FROM profiles where last_seen > date_trunc('day', now())", nativeQuery = true) 
    Integer getActiveDatingProfiles();
	
	@Query(value = "SELECT userid FROM profiles where last_seen > date_trunc('day', now())", nativeQuery = true) 
    List<String> getActiveDatingProfilesUIDS();
	
	@Query(value = "SELECT COUNT(*) FROM deleted_accounts WHERE time > date_trunc('day', now())", nativeQuery = true) 
    Integer getDeletedAccounts();
	
	@Query(value = "SELECT COUNT(*) FROM swipe_history where time > date_trunc('day', now())", nativeQuery = true) 
    Integer getDatingSwipes();
	
	@Query(value = "SELECT COUNT(*) FROM reswipe_history where time > date_trunc('day', now())", nativeQuery = true) 
    Integer getDatingReswipes();
	
	@Query("SELECT ra FROM ReportingAnalytics ra WHERE ra.query_date > :fromDate ORDER BY ra.query_date DESC")
	List<ReportingAnalytics> getReportingAnalytics(@Param("fromDate") Date fromDate);
	
	@Transactional
	@Modifying
	@Query(value = "insert into newsletter select userid from (select userid from (select userid from profiles where userid not like '%-deleted%' union select userid from friends_profiles where userid not like '%-deleted%') as t2 where userid not in (select userid from newsletter)) as t", nativeQuery = true)
	void addNewUsersToNewsletter();
	
	@Transactional
	@Modifying
	@Query(value = "delete from newsletter where userid in (select userid from newsletter where userid not in (select userid from (select userid from profiles where userid not like '%-deleted%' union select userid from friends_profiles where userid not like '%-deleted%') as t ))", nativeQuery = true)
	void auditNewsletter();
	
	@Transactional
	@Modifying
	@Query(value = "INSERT INTO remote_debugger (debug_statement, logged_time) VALUES (:debugString, now());", nativeQuery = true)
	void addDebugData(@Param("debugString") String debugString);

}
