package ca.rumine.backend.RU.Mine.consumers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;

import ca.rumine.backend.RU.Mine.kafka.payloads.Notification;
import ca.rumine.backend.RU.Mine.manager.NotificationManager;
import ca.rumine.backend.RU.Mine.model.Match;
import ca.rumine.backend.RU.Mine.model.PushNotificationRequest;
import ca.rumine.backend.RU.Mine.model.UserProfile;
import ca.rumine.backend.RU.Mine.repository.GroupDetailsRepository;
import ca.rumine.backend.RU.Mine.repository.GroupRepository;
import ca.rumine.backend.RU.Mine.repository.MatchRepository;
import ca.rumine.backend.RU.Mine.repository.NotificationItemRepository;
import ca.rumine.backend.RU.Mine.repository.NotificationRepository;
import ca.rumine.backend.RU.Mine.repository.ProfileRepository;

@Service
@ConditionalOnProperty(value = "kafka.enable", havingValue = "true", matchIfMissing = true)
public class Notifier {
	
	private final Logger logger = LoggerFactory.getLogger(Notifier.class);
	
	@Autowired
	private NotificationRepository notificationRepository;
	
	@Autowired
	private NotificationManager notificationManager;
	
	@Autowired
	private NotificationItemRepository nir;
	
	@Autowired
	private ProfileRepository profileRepository;
	
	@Autowired
	private GroupDetailsRepository gdr;
	
	@Autowired
	private MatchRepository matchRepository;
	
	@Autowired
	private GroupRepository gr;
	
	
	@KafkaListener(topics = "notifications", groupId = "notification_workers")
    public void consume(String message) {
    	try {
    		Gson gson = new Gson();
    		Notification notif = gson.fromJson(message, Notification.class);
    		Integer type = notif.getType();
    		
    		logger.info("GOT MESSAGE FROM KAFKA: " + notif.getType());
    		if(type == 0) {
    			//Message from match
    			//Data received:
    			//Matchid
    			//Sender Name
    			//Senderid
    			
    			Match recepientUseridObj = matchRepository.getRecepientUserid(notif.getMatchid());
    			
            	String recepientUserid = "";
            	if(recepientUseridObj.getUserid_1().equals(notif.getSenderid())){
            		recepientUserid = recepientUseridObj.getUserid_2();
            	}
            	else {
            		recepientUserid = recepientUseridObj.getUserid_1();
            	}
            	if(!recepientUserid.equals("")){
            		String notif_token = notificationRepository.getCurrentToken(recepientUserid);
            		if(notif_token != null && !notif_token.equals("loggedout")) {
            			UserProfile up = profileRepository.getUserProfile(notif.getSenderid());
            			PushNotificationRequest pnr = new PushNotificationRequest();
                        pnr.setTitle("New Message");
                        pnr.setMessage(up.getFirstname_display() + " sent a message!");
                        pnr.setToken(notif_token);
                        pnr.setTopic("");
                		String[] dataToSend = new String[2];
                		dataToSend[0] = up.getFirstname_display();
                		notificationManager.sendDataToClient(notif_token, "message", dataToSend);
                		notificationManager.sendPushNotificationToToken(pnr);
            			logger.info("[NOTIFIER - MATCH MESSAGE] Sent notification for user: " + recepientUserid + " from " + notif.getSenderName());
                    	
            		}
            		else {
            			logger.info("[NOTIFIER - MATCH MESSAGE] User with id " + recepientUserid + " is signed out");
            		}
            	}
    			
    		}
    		else if(type == 1) {
    			//Message in groupchat
    			//Data received:
    			//groupid
    			//senderid
    			//messagecontent
    			//sendername
    			
    			
    			//Get group name
    			String groupName = gdr.getGroupName(notif.getGroupid());
    			
    			//Group is no longer active, do not send out notifications
    			if(groupName == null) {
    				return;
    			}
    			
    			//Get tokens for notifications enabled and group chat notifications enabled
            	List<String> notif_tokens = notificationRepository.getGroupChatTokens(notif.getGroupid(), notif.getSenderid());
    			
            	//Set name to display in notification
    			String nameToDisplay = notif.getSenderName();
    			
    			if(nameToDisplay.indexOf(" ") != -1) {
    				nameToDisplay = nameToDisplay.substring(0,nameToDisplay.indexOf(" "));
    			}
    			
    			//Set message to display in notification
    			String messageToDisplay = nameToDisplay + ": " + notif.getMessageContent().replaceAll("\\r?\\n","");
               	String messageToSendInData = nameToDisplay + ": " +  notif.getMessageContent().replaceAll("\\r?\\n","");
               	if(messageToDisplay.length() > 250) {
               		messageToDisplay = messageToDisplay.substring(0, 250) + "...";
               	}
               	if(messageToSendInData.length() > 50) {
               		messageToSendInData = messageToSendInData.substring(0, 50);
               	}
    			
               	//Prepare static data of the PNR
    			PushNotificationRequest pnr = new PushNotificationRequest();
    			pnr.setTopic("");
    			pnr.setTitle(groupName);
               	pnr.setMessage(messageToDisplay);
               	
               	String[] dataToSend = new String[2];
        		dataToSend[0] = groupName;
       			dataToSend[1] = messageToSendInData;
               	
    			
            	for(int i=0; i<notif_tokens.size(); i++) {
            		if(notif_tokens.get(i) != null && !notif_tokens.get(i).equals("loggedout")) {
            			pnr.setToken(notif_tokens.get(i));
                   		notificationManager.sendDataToClient(notif_tokens.get(i), "group-chat", dataToSend);
                   		notificationManager.sendPushNotificationToToken(pnr);
            		}
            	}
            	
                logger.info("[NOTIFIER - GROUP CHAT MESSAGE] Sent notifications for group: " + notif.getGroupid() + " from " + notif.getSenderName());          	
    		}
    		else if(type == 2) {
    			//Friend request sent
    			//Data received:
    			//requester
    			//recipient
    			
    			String[][] notif_token = notificationRepository.getCurrentTokenAndFriendsFirstname(notif.getRecipient(), notif.getRequester());
    			if(notif_token != null && notif_token.length > 0 && notif_token[0] != null && notif_token[0].length > 0 && !notif_token[0][0].equals("loggedout")) {
    				PushNotificationRequest pnr = new PushNotificationRequest();
    	            pnr.setTitle("New Request");
    	            pnr.setMessage(notif_token[0][1] + " sent you a friend request.");
    	            pnr.setToken(notif_token[0][0]);
    	            pnr.setTopic("");
    	    		String[] dataToSend = new String[2];
    	    		dataToSend[0] = notif_token[0][1] + " sent you a friend request.";
    	    		notificationManager.sendDataToClient(notif_token[0][0], "request", dataToSend);
    	    		notificationManager.sendPushNotificationToToken(pnr);
    	    		
        			logger.info("[NOTIFIER - FRIEND REQUEST] Sent request notification to user: " + notif.getRecipient());
    			}
    			else {
        			logger.info("[NOTIFIER - FRIEND REQUEST] Failed to send request to user: " + notif.getRecipient());
    			}
    		}
    		else if(type == 3) {
    			//Friend accepted
    			//Data received:
    			//Requester
    			//Recipient
    			
    			String[][] notif_token = notificationRepository.getCurrentTokenAndFriendsFirstname(notif.getRecipient(), notif.getRequester());
    			if(notif_token != null && notif_token.length > 0 && notif_token[0] != null && notif_token[0].length > 0 && !notif_token[0][0].equals("loggedout")) {
    				PushNotificationRequest pnr = new PushNotificationRequest();
    				pnr.setTitle("New Friend");
                	pnr.setMessage(notif_token[0][1] + " added you as a friend.");
                	pnr.setToken(notif_token[0][0]);
                	pnr.setTopic("");
        			String[] dataToSend = new String[2];
        			dataToSend[0] = notif_token[0][1] + " added you as a friend.";
        			notificationManager.sendDataToClient(notif_token[0][0], "friend", dataToSend);
        			notificationManager.sendPushNotificationToToken(pnr);
    	    		
        			logger.info("[NOTIFIER - FRIEND ACCEPTED] Sent added notification to user: " + notif.getRecipient());
    			}
    			else {
        			logger.info("[NOTIFIER - FRIEND ACCEPTED] Failed to send request to user: " + notif.getRecipient());
    			}
    			
    		}
    		else if(type == 4) {
    			//Added to group
    			//Data received:
    			//Not used
    		}
    		else if(type == 5) {
    			//New post made in group
    			//Data received:
    			//groupid
    			//poster
    			//postcontent
    			//postid
    			
    			//Get group name
    			String groupName = gdr.getGroupName(notif.getGroupid());
    			
    			//Group is no longer active, do not send out notifications
    			if(groupName == null) {
    				return;
    			}
    			
    			//Get tokens for notifications enabled and group chat notifications enabled
            	List<String> notif_tokens = notificationRepository.getGroupPostTokens(notif.getGroupid(), notif.getPoster());
    			
    			//Set message to display in notification
            	String messageToDisplay = "New Post: \"" + notif.getPostContent().replaceAll("\\r?\\n"," ") + "\"";
               	String messageToSendInData = "New Post: \"" + notif.getPostContent().replaceAll("\\r?\\n"," ") + "\"";
               	if(messageToDisplay.length() > 250) {
               		messageToDisplay = messageToDisplay.substring(0, 249) + "...\"";
               	}
               	if(messageToSendInData.length() > 50) {
               		messageToSendInData = messageToSendInData.substring(0, 46) + "...\"";
               	}
               	
               	
            	if(notif.getPostContent().trim().length() == 0) {
            		messageToDisplay = "New post added!";
            		messageToSendInData = "New post added!";
            	}
    			
               	//Prepare static data of the PNR
    			PushNotificationRequest pnr = new PushNotificationRequest();
    			pnr.setTopic("");
    			pnr.setTitle(groupName);
               	pnr.setMessage(messageToDisplay);
               	
               	String[] dataToSend = new String[2];
        		dataToSend[0] = groupName;
       			dataToSend[1] = messageToSendInData;
               	
    			
            	for(int i=0; i<notif_tokens.size(); i++) {
            		if(notif_tokens.get(i) != null && !notif_tokens.get(i).equals("loggedout")) {
            			pnr.setToken(notif_tokens.get(i));
                   		notificationManager.sendDataToClient(notif_tokens.get(i), "group-post", dataToSend);
           				notificationManager.sendPushNotificationToToken(pnr);
            		}
            	}
            	
                logger.info("[NOTIFIER - GROUP POST] Sent notifications for group: " + notif.getGroupid());
    			
    			
    		}
    		else if(type == 6) {
    			//Match made
    			//Data received:
    			//recipient
    			
    			try {
    				String notif_token = notificationRepository.getCurrentToken(notif.getRecipient());
    				if(notif_token != null && !notif_token.equals("loggedout")) {
    					PushNotificationRequest pnr = new PushNotificationRequest();
    					pnr.setTitle("You got a match!");
    					pnr.setMessage("Don't leave them waiting, send a message now!");
    					pnr.setToken(notif_token);
    					pnr.setTopic("");
    					String[] dataToSend = new String[2];
    					notificationManager.sendDataToClient(notif_token, "match", dataToSend);
    					notificationManager.sendPushNotificationToToken(pnr);
	        		
    					logger.info("[NOTIFIER - NEW MATCH] Sent match notification to user: " + notif.getRecipient());

    				}
    				else {
    					logger.info("[NOTIFIER - NEW MATCH] Failed to send match notification to user: " + notif.getRecipient());
    				}
    			}
    			catch(Exception e) {
    				e.printStackTrace();
					logger.info("[NOTIFIER - NEW MATCH] [EXCEPTION] Failed to send match notification to user: " + notif.getRecipient());
    			}
    		}
    		else if(type == 7) {
    			//Message from friend
    			//Data received:
    			//matchid
    			//sendername
    			//senderid
    			//messagecontent
    			
    			Match recepientUseridObj = matchRepository.getRecepientUserid(notif.getMatchid());
            	String recepientUserid = "";
            	if(recepientUseridObj.getUserid_1().equals(notif.getSenderid())){
            		recepientUserid = recepientUseridObj.getUserid_2();
            	}
            	else {
            		recepientUserid = recepientUseridObj.getUserid_1();
            	}
            	if(!recepientUserid.equals("")){
            		String notif_token = notificationRepository.getCurrentToken(recepientUserid);
            		if(notif_token != null && !notif_token.equals("loggedout")) {
            			String firstname = profileRepository.getUserFromFriends(notif.getSenderid());
        				PushNotificationRequest pnr = new PushNotificationRequest();
                    	String messageToDisplay = notif.getMessageContent().replaceAll("\\r?\\n","");
                    	String messageToSendInData = notif.getMessageContent().replaceAll("\\r?\\n","");
                    	if(messageToDisplay.length() > 250) {
                    		messageToDisplay = messageToDisplay.substring(0, 250) + "...";
                    	}
                    	if(messageToSendInData.length() > 50) {
                    		messageToSendInData = messageToSendInData.substring(0, 50);
                    	}
                    	pnr.setTitle(firstname);
                    	pnr.setMessage(messageToDisplay);
                    	pnr.setToken(notif_token);
                    	pnr.setTopic("");
            			String[] dataToSend = new String[2];
            			dataToSend[0] = firstname;
            			dataToSend[1] = messageToSendInData;
            			notificationManager.sendDataToClient(notif_token, "friend-message", dataToSend);
            			notificationManager.sendPushNotificationToToken(pnr);
            			logger.info("[NOTIFIER - FRIEND MESSAGE] Sent notification for user: " + recepientUserid + " from " + notif.getSenderName());
                    	
            		}
            		else {
            			logger.info("[NOTIFIER - FRIEND MESSAGE] User with id " + recepientUserid + " is signed out");
            		}
            	}
    			
    		}
    		else if(type == 8) {
    			//Batch add to group
    			//Data received:
    			//groupid
    			//adder
    			//friendbatch
    			
    			//Get group name
    			String groupName = gdr.getGroupName(notif.getGroupid());
    			
    			//Group is no longer active, do not send out notifications
    			if(groupName == null) {
    				return;
    			}
    			
    			String userName = profileRepository.getUserFromFriends(notif.getAdder());
    			
    			if(userName == null || userName.equals("")) {
    				return;
    			}
    			
    			
    			String[] friendids = gson.fromJson(notif.getFriendBatch(), String[].class);
    			
    			//Set message to display in notification
    			String messageToDisplay = userName + " added you to " + groupName + ".";
               	String messageToSendInData = userName + " added you to " + groupName + ".";
    			
               	//Prepare static data of the PNR
    			PushNotificationRequest pnr = new PushNotificationRequest();
    			pnr.setTopic("");
    			pnr.setTitle("New Group");
               	pnr.setMessage(messageToDisplay);
               	
               	String[] dataToSend = new String[2];
        		dataToSend[0] = "New Group";
       			dataToSend[1] = messageToSendInData;
               	
    			
            	for(int i=0; i<friendids.length; i++) {
            		String notif_token = notificationRepository.getCurrentToken(friendids[i]);
            		if(notif_token != null && !notif_token.equals("loggedout")) {
            			pnr.setToken(notif_token);
                   		notificationManager.sendDataToClient(notif_token, "group-add", dataToSend);
           				notificationManager.sendPushNotificationToToken(pnr);
            		}
            	}
            	
                logger.info("[NOTIFIER - GROUP ADD] Sent notifications for group: " + notif.getGroupid());
    			
    		}
    		else if(type == 9) {
    			//Joined group
    			//Data received:
    			//groupid
    			//joiner
    			
    			//Get group name
    			String groupName = gdr.getGroupName(notif.getGroupid());
    			
    			//Group is no longer active, do not send out notifications
    			if(groupName == null) {
    				return;
    			}
    			
    			//Get creator userid
    			String creatorUserid = gr.getGroupCreatorUserid(notif.getGroupid());
    			
    			if(creatorUserid == null || creatorUserid.equals("")) {
    				return;
    			}
    			
    			String userName = profileRepository.getUserFromFriends(notif.getJoiner());
    			
    			if(userName == null || userName.equals("")) {
    				return;
    			}
    			
    			//Get token for creator
    			String notif_token = notificationRepository.getCurrentToken(creatorUserid);
    			
    			if(notif_token == null || notif_token.equals("loggedout")) {
    				return;
    			}
    			
    			//Set message to display in notification
    			String messageToDisplay = userName + " joined your group " + groupName + ".";
               	String messageToSendInData = userName + " joined your group " + groupName + ".";
    			
               	//Prepare static data of the PNR
    			PushNotificationRequest pnr = new PushNotificationRequest();
    			pnr.setTopic("");
    			pnr.setTitle("New Group Member");
               	pnr.setMessage(messageToDisplay);
               	
               	String[] dataToSend = new String[2];
        		dataToSend[0] = "New Group Member";
       			dataToSend[1] = messageToSendInData;
               	
    			
                pnr.setToken(notif_token);
                notificationManager.sendDataToClient(notif_token, "group-join", dataToSend);
           		notificationManager.sendPushNotificationToToken(pnr);
            	
                logger.info("[NOTIFIER - GROUP JOIN] Sent notification for group: " + notif.getGroupid());
    			
    		}
    		else if(type == 10) {
    			//Left comment on post
    			//Data received:
    			//commentContent
    			//commentid
    			//commenter
    			//recipient
    			
    			//Get token for poster
    			String notif_token = notificationRepository.getCurrentToken(notif.getRecipient());
    			
    			if(notif_token == null || notif_token.equals("loggedout")) {
    				return;
    			}
    			
    			//Set message to display in notification
    			String messageToDisplay = notif.getCommenter() + " commented \"" + notif.getCommentContent() + "\"";
               	String messageToSendInData = notif.getCommenter() + " commented \"" + notif.getCommentContent() + "\"";
    			
               	//Prepare static data of the PNR
    			PushNotificationRequest pnr = new PushNotificationRequest();
    			pnr.setTopic("");
    			pnr.setTitle("New Comment");
               	pnr.setMessage(messageToDisplay);
               	
               	String[] dataToSend = new String[2];
        		dataToSend[0] = "New Comment";
       			dataToSend[1] = messageToSendInData;
               	
    			
                pnr.setToken(notif_token);
                notificationManager.sendDataToClient(notif_token, "post-comment", dataToSend);
           		notificationManager.sendPushNotificationToToken(pnr);
            	
                logger.info("[NOTIFIER - POST COMMENT] Sent notification to user: " + notif.getRecipient());
    			
    		}
    		else if(type == 11) {
    			//Liked comment
    			//Data received:
    			//liker
    			//recipient
    			//commentid
    			
    			//Get token for poster
    			String notif_token = notificationRepository.getCurrentToken(notif.getRecipient());
    			
    			if(notif_token == null || notif_token.equals("loggedout")) {
    				return;
    			}
    			
    			//Set message to display in notification
    			String messageToDisplay = notif.getLiker() + " liked your comment.";
               	String messageToSendInData = notif.getLiker() + " liked your comment.";
    			
               	//Prepare static data of the PNR
    			PushNotificationRequest pnr = new PushNotificationRequest();
    			pnr.setTopic("");
    			pnr.setTitle("Liked Comment");
               	pnr.setMessage(messageToDisplay);
               	
               	String[] dataToSend = new String[2];
        		dataToSend[0] = "Liked Comment";
       			dataToSend[1] = messageToSendInData;
               	
    			
                pnr.setToken(notif_token);
                notificationManager.sendDataToClient(notif_token, "liked-comment", dataToSend);
           		notificationManager.sendPushNotificationToToken(pnr);
            	
                logger.info("[NOTIFIER - LIKED COMMENT] Sent notification to user: " + notif.getRecipient());
    			
    			
    		}
    		else if(type == 12) {
    			//Liked post
    			//Data received:
    			//liker
    			//recipient
    			//postid
    			
    			//Get token for poster
    			String notif_token = notificationRepository.getCurrentToken(notif.getRecipient());
    			
    			if(notif_token == null || notif_token.equals("loggedout")) {
    				return;
    			}
    			
    			//Set message to display in notification
    			String messageToDisplay = notif.getLiker() + " liked your post.";
               	String messageToSendInData = notif.getLiker() + " liked your post.";
    			
               	//Prepare static data of the PNR
    			PushNotificationRequest pnr = new PushNotificationRequest();
    			pnr.setTopic("");
    			pnr.setTitle("Liked Post");
               	pnr.setMessage(messageToDisplay);
               	
               	String[] dataToSend = new String[2];
        		dataToSend[0] = "Liked Post";
       			dataToSend[1] = messageToSendInData;
               	
    			
                pnr.setToken(notif_token);
                notificationManager.sendDataToClient(notif_token, "liked-post", dataToSend);
           		notificationManager.sendPushNotificationToToken(pnr);
            	
                logger.info("[NOTIFIER - LIKED POST] Sent notification to user: " + notif.getRecipient());
    			
    		}
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		return;
    	}
        return;
    }
	
}
