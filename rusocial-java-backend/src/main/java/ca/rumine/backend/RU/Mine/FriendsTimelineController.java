package ca.rumine.backend.RU.Mine;

import java.util.Collection;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;

import ca.rumine.backend.RU.Mine.kafka.Producer;
import ca.rumine.backend.RU.Mine.kafka.payloads.Notification;
import ca.rumine.backend.RU.Mine.manager.NotificationManager;
import ca.rumine.backend.RU.Mine.manager.SwipeManager;
import ca.rumine.backend.RU.Mine.model.FriendsProfileResult;
import ca.rumine.backend.RU.Mine.model.PushNotificationRequest;
import ca.rumine.backend.RU.Mine.model.SearchResult;
import ca.rumine.backend.RU.Mine.repository.FriendProfileRepository;
import ca.rumine.backend.RU.Mine.repository.NotificationRepository;
import ca.rumine.backend.RU.Mine.repository.RecentConnectionsRepository;

@Controller
@RestController
public class FriendsTimelineController {
	
	private Producer producer = new Producer();

    @Autowired
    void KafkaController(Producer producer) {
        this.producer = producer;
    }
	
	@Autowired
	private FriendProfileRepository fpr;
	
	@Autowired
	private NotificationRepository notificationRepository;
	
	@Autowired
	private TokenManager tokenManager;
	
	@Autowired
	private SwipeManager swipeManager;
	
	@Autowired
	private NotificationManager notificationManager;
	
	@Autowired
	private RecentConnectionsRepository rcr;
	
	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
	
	@RequestMapping(value = "/gw/ft/g", method = RequestMethod.POST)
    public ResponseEntity < String > getTimeline(@RequestParam String token, @RequestParam(value = "uids", required = false) String[] uids, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Get Friends Timeline] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		//Get the timeline
    		if(uids == null || uids.length == 0) {
    			System.out.println("UIDS is null");
    			uids = new String[0];
    		}
    		
    		List<FriendsProfileResult> result = fpr.getTimeline(checkTokenResp[1], uids);
    		
    		Gson gson = new Gson();
    		
    		String timeline = gson.toJson(result);
    		
       		lgr.log(Level.INFO, "[Get Friends Timeline] Got timeline for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":" + timeline + "}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Get Friends Timeline] Error getting timeline for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/ft/sfr", method = RequestMethod.POST)
    public ResponseEntity < String > sendFriendRequest(@RequestParam String token, @RequestParam String userid, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Send Friend Request] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		//Send friend request
    		String result = fpr.requestFriend(checkTokenResp[1], userid);
    		
    		//Mark user as seen
    		fpr.markUserAsSeen(checkTokenResp[1], userid);
    		
    		//Result could be added or sent
    		if(result.equals("added")) {
    			//create conversation
    			swipeManager.createMatchRecord(checkTokenResp[1], userid, 1);
    			//Send notification
        		Gson gson = new Gson();
    			Notification notif = new Notification();
        		notif.setType(3);
        		notif.setRequester(checkTokenResp[1]);
        		notif.setRecipient(userid);
        		
        		this.producer.sendMessage("notifications", gson.toJson(notif));
    			
    		}
    		else {
    			//Send notification
        		Gson gson = new Gson();
    			Notification notif = new Notification();
        		notif.setType(2);
        		notif.setRequester(checkTokenResp[1]);
        		notif.setRecipient(userid);
        		
        		this.producer.sendMessage("notifications", gson.toJson(notif));
    		}
    		
    		
       		lgr.log(Level.INFO, "[Send Friend Request] Sent friend request for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"" + result + "\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Send Friend Request] Error sending friend request for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }

	@RequestMapping(value = "/gw/ft/ru", method = RequestMethod.POST)
    public ResponseEntity < String > reportUser(@RequestParam String token, @RequestParam String userid, @RequestParam String message, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Report Friend User] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		//Record report
    		
       		lgr.log(Level.INFO, "[Report Friend User] Made report for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Report Friend User] Error creating report for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/ft/bu", method = RequestMethod.POST)
    public ResponseEntity < String > blockUser(@RequestParam String token, @RequestParam String userid, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Block Friend User] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		//Block user
    		fpr.blockUser(userid, checkTokenResp[1]);
    		
    		//Remove from recent connections
    		rcr.removeFromRecentConnections(checkTokenResp[1], userid, 1);
    		
    		//Disable chat if exists
    		swipeManager.toggleExistingMatch(checkTokenResp[1], userid, false);
    		
       		lgr.log(Level.INFO, "[Block Friend User] Blocked user for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Block Friend User] Error blocking user for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/ft/ms", method = RequestMethod.POST)
    public ResponseEntity < String > markSeen(@RequestParam String token, @RequestParam String userid, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Friend Mark Seen] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		//Mark seen
    		fpr.markUserAsSeen(checkTokenResp[1], userid);
    		
       		lgr.log(Level.INFO, "[Friend Mark Seen] Marked seen for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Friend Mark Seen] Error marking seen for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/ft/sp", method = RequestMethod.POST)
    public ResponseEntity < String > savePreference(@RequestParam String token, @RequestParam Integer option, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Friend Save Preferences] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		//0 is classes first
    		//1 is program first
    		//2 is interests first
    		//3 is music first
    		//4 is random
    		
    		if(option < 0 || option > 4) {
    			lgr.log(Level.INFO, "[Friend Save Preferences] Wrong data: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrong-data\"}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.BAD_REQUEST);
    		}
    		
    		//Save preferences
    		fpr.saveAlgoPreference(checkTokenResp[1], option);
    		
       		lgr.log(Level.INFO, "[Friend Save Preferences] Saved preferences for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Friend Save Preferences] Error saving preferences for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/ft/ar", method = RequestMethod.POST)
    public ResponseEntity < String > acceptRequest(@RequestParam String token, @RequestParam String userid, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Accept Friend Request] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		//Accept request
    		fpr.addFriend(checkTokenResp[1], userid);
    		
    		//Create conversation
			swipeManager.createMatchRecord(checkTokenResp[1], userid, 1);
    		
			
			//Send notification
    		Gson gson = new Gson();
			Notification notif = new Notification();
    		notif.setType(3);
    		notif.setRequester(checkTokenResp[1]);
    		notif.setRecipient(userid);
    		
    		this.producer.sendMessage("notifications", gson.toJson(notif));
			
    		//Send notif to other user
			/*String[][] notif_token = notificationRepository.getCurrentTokenAndFriendsFirstname(userid, checkTokenResp[1]);
    		
			if(notif_token != null && notif_token.length > 0 && notif_token[0] != null && notif_token[0].length > 0 && !notif_token[0][0].equals("loggedout")) {
				PushNotificationRequest pnr = new PushNotificationRequest();
	        	lgr.log(Level.INFO, "[Accept Friend Request] Sending added notification to user : " + userid);
	            pnr.setTitle("New Friend");
	            pnr.setMessage(notif_token[0][1] +  " added you as a friend.");
	            pnr.setToken(notif_token[0][0]);
	            pnr.setTopic("");
	    		String[] dataToSend = new String[2];
	    		dataToSend[0] = notif_token[0][1] +  " added you as a friend.";
	    		notificationManager.sendDataToClient(notif_token[0][0], "friend", dataToSend);
	    		notificationManager.sendPushNotificationToToken(pnr);
			}*/
    		
       		lgr.log(Level.INFO, "[Accept Friend Request] Accepted request for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Accept Friend Request] Error accepting request for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/ft/grs", method = RequestMethod.POST)
    public ResponseEntity < String > getRequestsSent(@RequestParam String token, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Get Sent Friend Requests] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		//Get requests sent
    		List<FriendsProfileResult> requests = fpr.getRequestsSent(checkTokenResp[1]);
    		
    		Gson gson = new Gson();
    		
    		String data = gson.toJson(requests);
    		
       		lgr.log(Level.INFO, "[Get Sent Friend Requests] Got sent requests for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":"+data+"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Get Sent Friend Requests] Error getting sent requests for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/ft/gmr", method = RequestMethod.POST)
    public ResponseEntity < String > getMyRequests(@RequestParam String token, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Get My Friend Requests] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		//Get requests sent
    		List<FriendsProfileResult> requests = fpr.getMyRequests(checkTokenResp[1]);
    		
    		Gson gson = new Gson();
    		
    		String data = gson.toJson(requests);
    		
       		lgr.log(Level.INFO, "[Get My Friend Requests] Got my requests for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":"+data+"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Get My Friend Requests] Error getting my requests for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/ft/rsr", method = RequestMethod.POST)
    public ResponseEntity < String > removeSentRequest(@RequestParam String token, @RequestParam String userid, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Remove Sent Request] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		//Remove sent request
    		fpr.cancelRequest(checkTokenResp[1], userid);
    		
       		lgr.log(Level.INFO, "[Remove Sent Request] Removed set request for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Remove Sent Request] Error removing sent request for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/ft/uf", method = RequestMethod.POST)
    public ResponseEntity < String > unfriend(@RequestParam String token, @RequestParam String userid, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Unfriend User] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		//Unfriend User
    		fpr.deleteFriend(checkTokenResp[1], userid);
    		
    		//Remove from recent connections
    		rcr.removeFromRecentConnections(checkTokenResp[1], userid, 1);
    		
    		//Disable chat if exists
    		swipeManager.toggleExistingMatch(checkTokenResp[1], userid, false);
    		
       		lgr.log(Level.INFO, "[Unfriend User] Unfriended user for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Unfriend User] Error unfriending user for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/ft/gbu", method = RequestMethod.POST)
    public ResponseEntity < String > getBlockedUsers(@RequestParam String token, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Get Blocked Users] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		//get blocked users
    		List<FriendsProfileResult> results = fpr.getBlockedUsers(checkTokenResp[1]);
    		
    		Gson gson = new Gson();
    		String data = gson.toJson(results);
    		
       		lgr.log(Level.INFO, "[Get Blocked Users] Got blocked users for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":"+data+"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Get Blocked Users] Error getting blocked users for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/ft/gaf", method = RequestMethod.POST)
    public ResponseEntity < String > getAllFriends(@RequestParam String token, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Get All Friends] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		//get all friends
    		List<FriendsProfileResult> results = fpr.getFriends(checkTokenResp[1]);
    		
    		Gson gson = new Gson();
    		String data = gson.toJson(results);
    		
       		lgr.log(Level.INFO, "[Get All Friends] Got all friends for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":"+data+"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Get All Friends] Error getting all friends for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/ft/ubu", method = RequestMethod.POST)
    public ResponseEntity < String > unblock(@RequestParam String token, @RequestParam String userid, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Unblock User] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		//Unblock User
    		fpr.unblockUser(userid, checkTokenResp[1]);
    		
    		//Re-enable chat if exists
    		swipeManager.toggleExistingMatch(checkTokenResp[1], userid, true);
    		
       		lgr.log(Level.INFO, "[Unblock User] Unblocked user for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Unblock User] Error unblocking user for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/ft/dfr", method = RequestMethod.POST)
    public ResponseEntity < String > deleteFriendRequest(@RequestParam String token, @RequestParam String userid, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Delete Friend Request] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		//Reject Friend Request
    		fpr.rejectRequest(checkTokenResp[1], userid);
    		
       		lgr.log(Level.INFO, "[Delete Friend Request] Deleted friend request for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"success\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Delete Friend Request] Error deleting friend request for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/ft/gfrc", method = RequestMethod.POST)
    public ResponseEntity < String > getFriendRequestsCount(@RequestParam String token, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Get Friend Request Count] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		//Get Friend Request Count
    		Integer count = fpr.getMyRequestsCount(checkTokenResp[1]);
    		
       		lgr.log(Level.INFO, "[Get Friend Request Count] Got friend request count for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"" + count + "\"}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Get Friend Request Count] Error getting friend request count for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
	@RequestMapping(value = "/gw/ft/search", method = RequestMethod.POST)
    public ResponseEntity < String > search(@RequestParam String token, @RequestParam String search_query, @RequestParam Integer search_type, HttpServletRequest request) {
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(token, ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Search] User told to signout with ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	
    	try {
    		
    		String toSearch = "";
    		    		
    		toSearch = search_query.trim();
    		
    		if(toSearch.length() <= 0) {
    			lgr.log(Level.INFO, "[Search] No query, returning empty search results for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"data\":" + "[]" + "}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    		}
    		
    		toSearch = ".*" + Pattern.quote(toSearch.toLowerCase()) + ".*";
    		
    		System.out.println(toSearch);
    		
    		Gson gson = new Gson();
    		List<SearchResult> results;
    		//Search 0 == users, 1 == groups
    		if(search_type == 0) {
        		 results = fpr.searchUsers(checkTokenResp[1], toSearch);
    		}
    		else {
        		results = fpr.searchGroups(checkTokenResp[1], toSearch);
    		}
    		
       		lgr.log(Level.INFO, "[Search] Got search results for user: " + checkTokenResp[1]);
			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"data\":" + gson.toJson(results) + "}";
        	return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Search] Error getting search results for user: " + checkTokenResp[1]);
    		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
       		return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }

}
