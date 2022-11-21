package ca.rumine.analythics.models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "reporting_analytics")
public class ReportingAnalytics {

	private Date query_date;
	private Date start_time;
	private Date finish_time;
	private Integer new_users;
	private Integer new_friend_profiles;
	private Integer new_dating_profiles;
	private Integer active_users_total;
	private Integer active_dating_users;
	private Integer active_friend_users;
	private Integer messages_sent_personal;
	private Integer messages_sent_group;
	private Integer groups_created;
	private Integer posts_created;
	private Integer comments_created;
	private Integer dating_swipes;
	private Integer friend_swipes;
	private Integer deleted_accounts;
	private Integer total_friend_requests;
	private Integer total_friends;
	private Integer uniqid;
	
	public ReportingAnalytics() {
		
	}

	public ReportingAnalytics(Date query_date, Date start_time, Date finish_time, Integer new_users,
			Integer new_friend_profiles, Integer new_dating_profiles, Integer active_users_total,
			Integer active_dating_users, Integer active_friend_users, Integer messages_sent_personal,
			Integer messages_sent_group, Integer groups_created, Integer posts_created, Integer comments_created,
			Integer dating_swipes, Integer friend_swipes, Integer deleted_accounts, Integer total_friend_requests,
			Integer total_friends, Integer uniqid) {
		this.query_date = query_date;
		this.start_time = start_time;
		this.finish_time = finish_time;
		this.new_users = new_users;
		this.new_friend_profiles = new_friend_profiles;
		this.new_dating_profiles = new_dating_profiles;
		this.active_users_total = active_users_total;
		this.active_dating_users = active_dating_users;
		this.active_friend_users = active_friend_users;
		this.messages_sent_personal = messages_sent_personal;
		this.messages_sent_group = messages_sent_group;
		this.groups_created = groups_created;
		this.posts_created = posts_created;
		this.comments_created = comments_created;
		this.dating_swipes = dating_swipes;
		this.friend_swipes = friend_swipes;
		this.deleted_accounts = deleted_accounts;
		this.total_friend_requests = total_friend_requests;
		this.total_friends = total_friends;
		this.uniqid = uniqid;
	}

	@Column(name = "query_date", nullable = false)
	public Date getQuery_date() {
		return query_date;
	}

	public void setQuery_date(Date query_date) {
		this.query_date = query_date;
	}

	@Column(name = "start_time", nullable = false)
	public Date getStart_time() {
		return start_time;
	}

	public void setStart_time(Date start_time) {
		this.start_time = start_time;
	}

	@Column(name = "finish_time", nullable = false)
	public Date getFinish_time() {
		return finish_time;
	}

	public void setFinish_time(Date finish_time) {
		this.finish_time = finish_time;
	}

	@Column(name = "new_users", nullable = false)
	public Integer getNew_users() {
		return new_users;
	}

	public void setNew_users(Integer new_users) {
		this.new_users = new_users;
	}

	@Column(name = "new_friend_profiles", nullable = false)
	public Integer getNew_friend_profiles() {
		return new_friend_profiles;
	}

	public void setNew_friend_profiles(Integer new_friend_profiles) {
		this.new_friend_profiles = new_friend_profiles;
	}

	@Column(name = "new_dating_profiles", nullable = false)
	public Integer getNew_dating_profiles() {
		return new_dating_profiles;
	}

	public void setNew_dating_profiles(Integer new_dating_profiles) {
		this.new_dating_profiles = new_dating_profiles;
	}

	@Column(name = "active_users_total", nullable = false)
	public Integer getActive_users_total() {
		return active_users_total;
	}

	public void setActive_users_total(Integer active_users_total) {
		this.active_users_total = active_users_total;
	}

	@Column(name = "active_dating_users", nullable = false)
	public Integer getActive_dating_users() {
		return active_dating_users;
	}

	public void setActive_dating_users(Integer active_dating_users) {
		this.active_dating_users = active_dating_users;
	}

	@Column(name = "active_friend_users", nullable = false)
	public Integer getActive_friend_users() {
		return active_friend_users;
	}

	public void setActive_friend_users(Integer active_friend_users) {
		this.active_friend_users = active_friend_users;
	}

	@Column(name = "messages_sent_personal", nullable = false)
	public Integer getMessages_sent_personal() {
		return messages_sent_personal;
	}

	public void setMessages_sent_personal(Integer messages_sent_personal) {
		this.messages_sent_personal = messages_sent_personal;
	}

	@Column(name = "messages_sent_group", nullable = false)
	public Integer getMessages_sent_group() {
		return messages_sent_group;
	}

	public void setMessages_sent_group(Integer messages_sent_group) {
		this.messages_sent_group = messages_sent_group;
	}

	@Column(name = "groups_created", nullable = false)
	public Integer getGroups_created() {
		return groups_created;
	}

	public void setGroups_created(Integer groups_created) {
		this.groups_created = groups_created;
	}

	@Column(name = "posts_created", nullable = false)
	public Integer getPosts_created() {
		return posts_created;
	}

	public void setPosts_created(Integer posts_created) {
		this.posts_created = posts_created;
	}

	@Column(name = "comments_created", nullable = false)
	public Integer getComments_created() {
		return comments_created;
	}

	public void setComments_created(Integer comments_created) {
		this.comments_created = comments_created;
	}

	@Column(name = "dating_swipes", nullable = false)
	public Integer getDating_swipes() {
		return dating_swipes;
	}

	public void setDating_swipes(Integer dating_swipes) {
		this.dating_swipes = dating_swipes;
	}

	@Column(name = "friend_swipes", nullable = false)
	public Integer getFriend_swipes() {
		return friend_swipes;
	}

	public void setFriend_swipes(Integer friend_swipes) {
		this.friend_swipes = friend_swipes;
	}

	@Column(name = "deleted_accounts", nullable = false)
	public Integer getDeleted_accounts() {
		return deleted_accounts;
	}

	public void setDeleted_accounts(Integer deleted_accounts) {
		this.deleted_accounts = deleted_accounts;
	}

	@Column(name = "total_friend_requests", nullable = false)
	public Integer getTotal_friend_requests() {
		return total_friend_requests;
	}

	public void setTotal_friend_requests(Integer total_friend_requests) {
		this.total_friend_requests = total_friend_requests;
	}

	@Column(name = "total_friends", nullable = false)
	public Integer getTotal_friends() {
		return total_friends;
	}

	public void setTotal_friends(Integer total_friends) {
		this.total_friends = total_friends;
	}
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "uniqid", nullable = true)
	public Integer getUniqid() {
		return uniqid;
	}
	
	public void setUniqid(Integer uniqid) {
		this.uniqid = uniqid;
	}
	
	
	
}
