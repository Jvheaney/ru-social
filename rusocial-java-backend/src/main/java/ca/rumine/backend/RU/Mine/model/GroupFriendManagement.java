package ca.rumine.backend.RU.Mine.model;

public class GroupFriendManagement {
	public String token;
	public String groupid;
	public String friends;
	public String friend;
	
	public GroupFriendManagement() {
		
	}
	
	public GroupFriendManagement(String token, String groupid, String friends, String friend) {
		this.token = token;
		this.groupid = groupid;
		this.friends = friends;
		this.friend = friend;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
	
	public String getGroupid() {
		return groupid;
	}
	
	public void setGroupid(String groupid) {
		this.groupid = groupid;
	}

	public String getFriends() {
		return friends;
	}

	public void setFriends(String friends) {
		this.friends = friends;
	}
	
	public String getFriend() {
		return friend;
	}
	
	public void setFriend(String friend) {
		this.friend = friend;
	}
	
}