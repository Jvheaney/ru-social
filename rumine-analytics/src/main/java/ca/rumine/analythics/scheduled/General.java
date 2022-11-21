package ca.rumine.analythics.scheduled;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import ca.rumine.analythics.models.ReportingAnalytics;
import ca.rumine.analythics.repositories.NeoRepository;
import ca.rumine.analythics.repositories.ReportingAnalyticsRepository;


@Service
public class General {
	
	@Autowired
	private ReportingAnalyticsRepository rar;
	
	@Autowired
	private NeoRepository nr;
	
	@Scheduled(cron = "45 59 23 ? * *")
    public void collectAnalytics() {
    	Logger lgr = Logger.getLogger(General.class.getName());
    	
    	//Get today's date
    	Calendar c = new GregorianCalendar();
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        Date d1 = c.getTime();
        
        //Setting defaults
        Long midnight = d1.getTime();
        Date query_date = d1;
    	Date start_time = new Date();
    	Integer new_users = 0;
    	Integer new_friend_profiles = 0;
    	Integer new_dating_profiles = 0;
    	Integer active_users_total = 0;
    	Integer active_dating_users = 0;
    	Integer active_friend_users = 0;
    	Integer messages_sent_personal = 0;
    	Integer messages_sent_group = 0;
    	Integer groups_created = 0;
    	Integer posts_created = 0;
    	Integer comments_created = 0;
    	Integer dating_swipes = 0;
    	Integer friend_swipes = 0;
    	Integer deleted_accounts = 0;
    	Integer total_friend_requests = 0;
    	Integer total_friends = 0;
    	lgr.log(Level.INFO, "[Collect Analytics] Starting to collect analytics");
    	
    	//New users
    	try {
    		new_users = rar.getNewUsers();
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		lgr.log(Level.INFO, "[Collect Analytics] Failed to get new users");
    	}
    	
    	//New friend profiles
    	try {
    		new_friend_profiles = nr.getNewFriendProfiles(midnight);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		lgr.log(Level.INFO, "[Collect Analytics] Failed to get new friend profiles");
    	}
    	
    	//New dating profiles
    	try {
    		new_dating_profiles = rar.getNewDatingProfiles();
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		lgr.log(Level.INFO, "[Collect Analytics] Failed to get new dating profiles");
    	}
    	
    	//Active dating users
    	try {
    		active_dating_users = rar.getActiveDatingProfiles();
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		lgr.log(Level.INFO, "[Collect Analytics] Failed to get active dating users");
    	}	
    	
    	//Active friend users
    	try {
    		active_friend_users = nr.getActiveFriendProfiles(midnight);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		lgr.log(Level.INFO, "[Collect Analytics] Failed to get active friend users");
    	}
    	
    	//Active users total
    	try {
    		List<String> uids = rar.getActiveDatingProfilesUIDS();
    		Integer total_exclusive = nr.getActiveFriendProfilesExclusion(midnight, uids);
    		active_users_total = total_exclusive + active_dating_users;
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		lgr.log(Level.INFO, "[Collect Analytics] Failed to get total active users");
    	}
    	
    	//Messages sent personal
    	try {
    		messages_sent_personal = rar.getPersonalMessagesSent();
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		lgr.log(Level.INFO, "[Collect Analytics] Failed to get personal messages");
    	}
    	
    	//Messages sent groups
    	try {
    		messages_sent_group = rar.getGroupMessagesSent();
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		lgr.log(Level.INFO, "[Collect Analytics] Failed to get group messages");
    	}
    	
    	//Groups created
    	try {
    		groups_created = nr.getGroupsCreated(midnight);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		lgr.log(Level.INFO, "[Collect Analytics] Failed to get groups created");
    	}
    	
    	//Posts created
    	try {
    		posts_created = nr.getPostsCreated(midnight);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		lgr.log(Level.INFO, "[Collect Analytics] Failed to get posts created");
    	}
    	
    	//Comments created
    	try {
    		comments_created = nr.getCommentsCreated(midnight);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		lgr.log(Level.INFO, "[Collect Analytics] Failed to get comments created");
    	}
    	
    	//Dating swipes
    	try {
    		Integer s1 = rar.getDatingSwipes();
    		Integer s2 = rar.getDatingReswipes();
    		dating_swipes = s1 + s2;
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		lgr.log(Level.INFO, "[Collect Analytics] Failed to get dating swipes");
    	}
    	
    	//Friend swipes
    	try {
    		friend_swipes = nr.getFriendSwipes(midnight);
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		lgr.log(Level.INFO, "[Collect Analytics] Failed to get friend swipes");
    	}
    	
    	//Deleted accounts
    	try {
    		deleted_accounts = rar.getDeletedAccounts();
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		lgr.log(Level.INFO, "[Collect Analytics] Failed to get deleted accounts");
    	}
    	
    	//Total friend requests
    	try {
    		total_friend_requests = nr.getTotalFriendRequests();
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		lgr.log(Level.INFO, "[Collect Analytics] Failed to get total friend requests");
    	}
    	
    	//Total friends
    	try {
    		total_friends = nr.getTotalFriends();
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		lgr.log(Level.INFO, "[Collect Analytics] Failed to get total friends");
    	}
    	
    	lgr.log(Level.INFO, "[Collect Analytics] Finished collecting analytics");
    	
    	Date finish_time = new Date();
    	
    	//Create model
    	ReportingAnalytics ra = new ReportingAnalytics();
    	ra.setQuery_date(query_date);
    	ra.setStart_time(start_time);
    	ra.setFinish_time(finish_time);
    	ra.setNew_users(new_users);
    	ra.setNew_friend_profiles(new_friend_profiles);
    	ra.setNew_dating_profiles(new_dating_profiles);
    	ra.setActive_users_total(active_users_total);
    	ra.setActive_dating_users(active_dating_users);
    	ra.setActive_friend_users(active_friend_users);
    	ra.setMessages_sent_personal(messages_sent_personal);
    	ra.setMessages_sent_group(messages_sent_group);
    	ra.setGroups_created(groups_created);
    	ra.setPosts_created(posts_created);
    	ra.setComments_created(comments_created);
    	ra.setDating_swipes(dating_swipes);
    	ra.setFriend_swipes(friend_swipes);
    	ra.setDeleted_accounts(deleted_accounts);
    	ra.setTotal_friend_requests(total_friend_requests);
    	ra.setTotal_friends(total_friends);
    	
    	lgr.log(Level.INFO, "[Collect Analytics] Created analytics model");
    	
    	//Save model to database
    	try {
    		rar.save(ra);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		lgr.log(Level.INFO, "[Collect Analytics] Failed to save analytics model");
    	}
    	
    	
    	lgr.log(Level.INFO, "[Collect Analytics] Saved model to database. Completed.");
    	
    	
    }
	
	@Scheduled(cron = "0 50 23 ? * *")
    public void newsletter() {
    	Logger lgr = Logger.getLogger(General.class.getName());
    	lgr.log(Level.INFO, "[Newsletter] Starting process.");
    	
    	rar.addNewUsersToNewsletter();
    	
    	lgr.log(Level.INFO, "[Newsletter] Added new users to newsletter. Starting audit.");
    	
    	rar.auditNewsletter();

    	lgr.log(Level.INFO, "[Newsletter] Audit completed. Process finished.");
    	
    }
}
