package ca.rumine.backend.RU.Mine.kafka.payloads;

public class Notification {
	private Integer type; 
	//0 is personal dating message
	//1 is group message
	//2 is friend request
	//3 is friend accepted
	//4 is added to group
	//5 is new post
	//6 is new match
	//7 is personal friends message
	//8 is add batch to group
	//9 is for joining groups
	//10 is for comment added to post
	//11 is for liked comment
	//12 is for liked post
	private String senderid; //Used for messaging
	private String messageContent; //Used for messaging
	private String matchid; //Used for personal messaging
	private String groupid; //Used for group message, added to group, new post
	private String requester; //Used for friend request
	private String recipient; //Used for friend request, friend accepted, match
	private String accepter; //Used for friend accepted
	private String adder; //Used for adding to group
	private String addee; //Used for adding to group
	private String postid; //Used for new post
	private String postContent; //Used for new post
	private String poster; //Used for new post
	private String friendBatch; //Used for adding friends in batch
	private String joiner; //Used for joining
	private String commentid;
	private String commentContent;
	private String commenter;
	private String liker;
	private String senderName;
	
	
	public Notification() {
		
	}
	
	
	/**
	 * 0 is personal dating message, 1 is group message, 2 is friend request, 3 is friend accepted, 4 is added to group, 5 is new post, 6 is new match, 7 is personal friends message, 8 is for batch add friends, 9 is for joining group
	 */
	public Integer getType() {
		return type;
	}
	
	/**
	 * 0 is personal dating message, 1 is group message, 2 is friend request, 3 is friend accepted, 4 is added to group, 5 is new post, 6 is new match, 7 is personal friends message, 8 is for batch add friends, 9 is for joining group
	 */
	public void setType(Integer type) {
		this.type = type;
	}
	
	
	/**
	 * Used for messaging
	 */
	public String getSenderid() {
		return senderid;
	}
	
	/**
	 * Used for messaging
	 */
	public void setSenderid(String senderid) {
		this.senderid = senderid;
	}
	
	
	/**
	 * Used for messaging
	 */
	public String getMessageContent() {
		return messageContent;
	}
	
	/**
	 * Used for messaging
	 */
	public void setMessageContent(String messageContent) {
		this.messageContent = messageContent;
	}
	
	
	/**
	 * Used for personal messaging
	 */
	public String getMatchid() {
		return matchid;
	}
	
	/**
	 * Used for personal messaging
	 */
	public void setMatchid(String matchid) {
		this.matchid = matchid;
	}
	
	
	/**
	 * Used for group message, added to group, new post
	 */
	public String getGroupid() {
		return groupid;
	}
	
	/**
	 * Used for group message, added to group, new post
	 */
	public void setGroupid(String groupid) {
		this.groupid = groupid;
	}
	
	
	/**
	 * Used for friend request
	 */
	public String getRequester() {
		return requester;
	}
	
	/**
	 * Used for friend request
	 */
	public void setRequester(String requester) {
		this.requester = requester;
	}
	
	
	/**
	 * Used for friend request, friend accepted, match
	 */
	public String getRecipient() {
		return recipient;
	}
	
	/**
	 * Used for friend request, friend accepted, match
	 */
	public void setRecipient(String recipient) {
		this.recipient = recipient;
	}
	
	
	/**
	 * Used for friend accepted
	 */
	public String getAccepter() {
		return accepter;
	}
	
	/**
	 * Used for friend accepted
	 */
	public void setAccepter(String accepter) {
		this.accepter = accepter;
	}
	
	
	/**
	 * Used for adding to group
	 */
	public String getAdder() {
		return adder;
	}
	
	/**
	 * Used for adding to group
	 */
	public void setAdder(String adder) {
		this.adder = adder;
	}
	
	
	/**
	 * Used for adding to group
	 */
	public String getAddee() {
		return addee;
	}
	
	/**
	 * Used for adding to group
	 */
	public void setAddee(String addee) {
		this.addee = addee;
	}
	
	
	/**
	 * Used for new post
	 */
	public String getPostid() {
		return postid;
	}
	
	/**
	 * Used for new post
	 */
	public void setPostid(String postid) {
		this.postid = postid;
	}
	
	
	/**
	 * Used for new post
	 */
	public String getPostContent() {
		return postContent;
	}
	
	/**
	 * Used for new post
	 */
	public void setPostContent(String postContent) {
		this.postContent = postContent;
	}

	
	/**
	 * Used for friend batch adding
	 */
	public String getFriendBatch() {
		return friendBatch;
	}

	/**
	 * Used for friend batch adding
	 */
	public void setFriendBatch(String friendBatch) {
		this.friendBatch = friendBatch;
	}


	/**
	 * Used for group joining
	 */
	public String getJoiner() {
		return joiner;
	}


	/**
	 * Used for group joining
	 */
	public void setJoiner(String joiner) {
		this.joiner = joiner;
	}


	public String getPoster() {
		return poster;
	}


	public void setPoster(String poster) {
		this.poster = poster;
	}


	public String getCommentid() {
		return commentid;
	}


	public void setCommentid(String commentid) {
		this.commentid = commentid;
	}


	public String getCommentContent() {
		return commentContent;
	}


	public void setCommentContent(String commentContent) {
		this.commentContent = commentContent;
	}


	public String getCommenter() {
		return commenter;
	}


	public void setCommenter(String commenter) {
		this.commenter = commenter;
	}


	public String getLiker() {
		return liker;
	}


	public void setLiker(String liker) {
		this.liker = liker;
	}


	public String getSenderName() {
		return senderName;
	}


	public void setSenderName(String senderName) {
		this.senderName = senderName;
	}	
	
	
	
	
}
