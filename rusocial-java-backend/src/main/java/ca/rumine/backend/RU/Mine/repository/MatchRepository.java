package ca.rumine.backend.RU.Mine.repository;


import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ca.rumine.backend.RU.Mine.model.Match;
import ca.rumine.backend.RU.Mine.model.Message;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

	@Query(value = "SELECT isactive FROM matches WHERE matchid=:matchid AND (userid_1=:userid OR userid_2=:userid)", nativeQuery = true) 
    Boolean canAccessMatchConvo(@Param("userid") String userid, @Param("matchid") String matchid);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE matches SET isactive='f' WHERE matchid=:matchid AND (userid_1=:userid OR userid_2=:userid) AND type=0", nativeQuery = true) 
    void unmatch(@Param("userid") String userid, @Param("matchid") String matchid);
	
	@Query(value = "select mtchs.matchid, mtch_enc.aes_key, mtchs.matchedid as userid, msgs.message as message, msgs.time_read, msgs.senderid, prof.image0 as data, prof.firstname_display, match_time from (select matchid, userid_1 as matchedid, time as match_time from matches where userid_2 = :userid and isactive union select matchid, userid_2, time as match_time from matches where userid_1 = :userid and isactive order by match_time desc) mtchs left join (select matchid, max(message_id) as messageid from messages group by matchid) as msg_max on (mtchs.matchid = msg_max.matchid) left join match_enc_keys mtch_enc on (mtchs.matchid = mtch_enc.matchid) left join messages msgs on (msg_max.messageid = msgs.message_id) left join images img on (img.userid = mtchs.matchedid and not img.deleted and img.imgnum = 0) left join profiles prof on (prof.userid = mtchs.matchedid) ORDER BY msgs.message_id DESC, match_time DESC;", nativeQuery = true)
    ArrayList<String[]> getMatchConversations(@Param("userid") String userid);
    
    @Query(value = "select mtchs.matchid, mtch_enc.aes_key, mtchs.matchedid as userid, msgs.message as message, msgs.time_read, msgs.time_sent, msgs.senderid, coalesce(prof.image0,fprof.image0) as data, coalesce(prof.firstname_display,fprof.firstname_display) as firstname_display, match_time, mtchs.type, null as isread, null as group_fname, msgs.message_id from (select matchid, userid_1 as matchedid, time as match_time, type from matches where userid_2 = :userid and isactive union select matchid, userid_2, time as match_time, type from matches where userid_1 = :userid and isactive order by match_time desc) mtchs left join (select matchid, max(message_id) as messageid from messages where left(matchid, 3) <> 'gid' group by matchid) as msg_max on (mtchs.matchid = msg_max.matchid) left join match_enc_keys mtch_enc on (mtchs.matchid = mtch_enc.matchid) left join messages msgs on (msg_max.messageid = msgs.message_id) left outer join profiles prof on (prof.userid = mtchs.matchedid and mtchs.type=0) left outer join friends_profiles fprof on (fprof.userid = mtchs.matchedid and mtchs.type=1) where msgs.message is not null union select gm.groupid, null as aes_key, null as userid, msgs.message, msgs.time_read, time_sent, msgs.senderid, gd.image, gd.name, null as match_time, null as type, (msgs.time_sent < lgcc.check_time) as isread, fp.firstname_display as group_fname, msgs.message_id from group_membership gm left join group_details gd on (gm.groupid = gd.groupid) left join last_group_chat_check lgcc on (lgcc.groupid = gm.groupid and lgcc.userid=:userid) left join (select matchid, max(message_id) as messageid from messages where left(matchid, 3) = 'gid' group by matchid) as msg_max on (gm.groupid = msg_max.matchid) right join messages msgs on (gm.groupid = msgs.matchid) and (msgs.message_id = msg_max.messageid ) left join friends_profiles fp on (fp.userid = msgs.senderid) where gm.userid = :userid and gd.isactive and gm.isactive ORDER BY message_id DESC", nativeQuery=true)
    ArrayList<String[]> getConversations(@Param("userid") String userid);
    
    @Query("SELECT m FROM Match m WHERE matchid=:matchid") 
    Match getRecepientUserid(@Param("matchid") String matchid);
    
	@Query(value = "select mtchs.matchedid as userid, prof.firstname_display, prof.image0, mtchs.matchid as data from (select matchid, userid_1 as matchedid from matches where userid_2 = :userid and isactive and type=0 union select matchid, userid_2 from matches where userid_1 = :userid and isactive and type=0) mtchs left join profiles prof on (prof.userid = mtchs.matchedid) ORDER BY prof.firstname_display ASC;", nativeQuery = true) 
    ArrayList<String[]> getMatches(@Param("userid") String userid);
    
    @Transactional
	@Modifying
	@Query(value = "UPDATE matches SET isactive=:toggle_value WHERE type=1 AND ((userid_1=:userid AND userid_2=:otherUserid) OR (userid_1=:otherUserid AND userid_2=:userid))", nativeQuery = true) 
    void toggleExistingMatch(@Param("userid") String userid, @Param("otherUserid") String otherUserid, @Param("toggle_value") Boolean toggle_value);
    
    @Transactional
	@Modifying
	@Query(value = "INSERT INTO matches (matchid, userid_1, userid_2, time, isactive, type) SELECT :matchid, :userid_1, :userid_2, now(), 't', :type WHERE NOT exists(select matchid from matches where type=:type and ((userid_1=:userid_1 and userid_2=:userid_2) or (userid_1=:userid_2 and userid_2=:userid_1)));", nativeQuery = true) 
    int conditionalInsert(@Param("matchid") String matchid, @Param("userid_1") String userid_1, @Param("userid_2") String userid_2, @Param("type") Integer type);
    
    @Query(value="select mtchs.matchid as matchid from matches mtchs where ((userid_1=:userid AND userid_2=:otherUserid) OR (userid_1=:otherUserid AND userid_2=:userid)) AND type=:type AND isactive limit 1", nativeQuery=true) 
    String startConversation(@Param("userid") String userid, @Param("otherUserid") String otherUserid, @Param("type") Integer type);

}
