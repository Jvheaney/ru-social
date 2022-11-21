package ca.rumine.backend.RU.Mine.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ca.rumine.backend.RU.Mine.model.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

	@Query(value = "SELECT * FROM messages WHERE matchid = :matchid ORDER BY time_sent DESC LIMIT 25 OFFSET :offset", nativeQuery = true) 
    Message[] getConversation(@Param("matchid") String matchid, @Param("offset") int offset);
	
	@Query(value = "SELECT m.matchid as matchid, m.senderid as senderid, m.message as message, m.time_sent as time_sent, m.time_read as time_read, m.message_id as message_id, m.react as react, fp.firstname_display || ' ' || COALESCE(fp.lastname,'') as name, fp.image0 as avatar FROM messages m LEFT JOIN friends_profiles fp on (m.senderid = fp.userid) WHERE matchid = :matchid AND fp.firstname_display is not null ORDER BY time_sent DESC LIMIT 25 OFFSET :offset", nativeQuery = true) 
    Message[] getGroupConversation(@Param("matchid") String matchid, @Param("offset") int offset);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE messages SET time_read='now()' WHERE matchid=:matchid AND senderid != :userid AND time_read IS NULL", nativeQuery = true) 
    void setRead(@Param("matchid") String matchid, @Param("userid") String userid);
	
	@Transactional
	@Modifying
	@Query(value = "INSERT INTO last_group_chat_check (groupid, userid, check_time) VALUES (:groupid, :userid, now()) ON CONFLICT ON CONSTRAINT gid_uid_lc DO UPDATE SET check_time=now() WHERE last_group_chat_check.groupid=:groupid AND last_group_chat_check.userid=:userid", nativeQuery = true) 
    void setLastCheckIn(@Param("userid") String userid, @Param("groupid") String groupid);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE messages SET time_read='now()' WHERE message_id=:message_id AND matchid=:matchid AND senderid != :userid AND time_read IS NULL", nativeQuery = true) 
    void setRead(@Param("message_id") int message_id, @Param("matchid") String matchid, @Param("userid") String userid);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE messages SET react=:react WHERE message_id=:message_id AND matchid=:matchid AND senderid != :userid", nativeQuery = true) 
    void addReact(@Param("message_id") int message_id, @Param("matchid") String matchid, @Param("react") String react, @Param("userid") String userid);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE messages SET react=NULL WHERE message_id=:message_id AND matchid=:matchid AND senderid != :userid", nativeQuery = true) 
    void removeReact(@Param("message_id") int message_id, @Param("matchid") String matchid, @Param("userid") String userid);
}
