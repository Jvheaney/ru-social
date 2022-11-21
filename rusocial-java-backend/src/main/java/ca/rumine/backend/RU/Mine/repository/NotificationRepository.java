package ca.rumine.backend.RU.Mine.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ca.rumine.backend.RU.Mine.model.NotificationToken;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationToken, Long> {
	
	@Query(value = "SELECT nt.notification_token FROM notification_tokens nt LEFT JOIN users u ON nt.userid = u.userid WHERE u.allow_notifications='t' AND u.userid = :userid", nativeQuery= true) 
    String getCurrentToken(@Param("userid") String userid);
	
	@Query(value = "select count(*) from messages m left join matches mtch on mtch.matchid = m.matchid where m.time_read is NULL and (mtch.userid_1 = :userid or mtch.userid_2 =:userid) and m.senderid != :userid and mtch.isactive='t'", nativeQuery= true) 
    String getNotificationCount(@Param("userid") String userid);
	
	@Query(value = "SELECT nt.notification_token, fp.firstname_display FROM notification_tokens nt LEFT JOIN users u ON nt.userid = u.userid LEFT JOIN friends_profiles fp ON fp.userid=:other_userid WHERE u.allow_notifications='t' AND u.userid = :userid", nativeQuery= true) 
    String[][] getCurrentTokenAndFriendsFirstname(@Param("userid") String userid, @Param("other_userid") String other_userid);
	
	@Query(value = "SELECT nt.notification_token FROM notification_tokens nt LEFT JOIN group_membership gm ON nt.userid = gm.userid LEFT JOIN users u ON gm.userid=u.userid WHERE u.allow_notifications='t' AND gm.chat_notifs_enabled='t' AND gm.groupid = :groupid AND gm.userid != :userid", nativeQuery= true) 
    List<String> getGroupChatTokens(@Param("groupid") String groupid, @Param("userid") String userid);
	
	@Query(value = "SELECT nt.notification_token FROM notification_tokens nt LEFT JOIN group_membership gm ON nt.userid = gm.userid LEFT JOIN users u ON gm.userid=u.userid WHERE u.allow_notifications='t' AND gm.post_notifs_enabled='t' AND gm.groupid = :groupid AND gm.userid != :userid", nativeQuery= true) 
    List<String> getGroupPostTokens(@Param("groupid") String groupid, @Param("userid") String userid);
	
	@Query(value = "SELECT nt.notification_token FROM notification_tokens nt LEFT JOIN group_membership gm ON nt.userid = gm.userid LEFT JOIN users u ON gm.userid=u.userid WHERE u.allow_notifications='t' AND gm.post_notifs_enabled='t' AND gm.groupid = :groupid AND gm.userid = :userid", nativeQuery= true) 
    List<String> getSingularPostToken(@Param("groupid") String groupid, @Param("userid") String userid);
}
