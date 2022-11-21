package ca.rumine.backend.RU.Mine;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;

import ca.rumine.backend.RU.Mine.kafka.Producer;
import ca.rumine.backend.RU.Mine.kafka.payloads.Notification;
import ca.rumine.backend.RU.Mine.manager.MediaManager;
import ca.rumine.backend.RU.Mine.model.CreateGroup;
import ca.rumine.backend.RU.Mine.model.EditGroup;
import ca.rumine.backend.RU.Mine.model.Group;
import ca.rumine.backend.RU.Mine.model.GroupDetails;
import ca.rumine.backend.RU.Mine.model.GroupFriendManagement;
import ca.rumine.backend.RU.Mine.model.GroupMember;
import ca.rumine.backend.RU.Mine.model.GroupMembership;
import ca.rumine.backend.RU.Mine.model.GroupResult;
import ca.rumine.backend.RU.Mine.model.PostAndLikes;
import ca.rumine.backend.RU.Mine.model.ReportedGroup;
import ca.rumine.backend.RU.Mine.model.ReturnMessage;
import ca.rumine.backend.RU.Mine.repository.GroupDetailsRepository;
import ca.rumine.backend.RU.Mine.repository.GroupMembershipRepository;
import ca.rumine.backend.RU.Mine.repository.GroupRepository;
import ca.rumine.backend.RU.Mine.repository.ReportedGroupRepository;

@Controller
@RestController
public class GroupsController {
	
	private Producer producer = new Producer();

    @Autowired
    void KafkaController(Producer producer) {
        this.producer = producer;
    }

	@Autowired
	private GroupRepository groupRepository;
	
	@Autowired
	private GroupMembershipRepository gmr;
	
	@Autowired
	private ReportedGroupRepository rgr;
	
	@Autowired
	private GroupDetailsRepository gdr;

	@Autowired
	private TokenManager tokenManager;
	
	@Autowired
	private MediaManager mediaManager;
	
	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());

	@RequestMapping(value = "/g/c", method = RequestMethod.POST)
    public ResponseEntity < String > createGroup(@ModelAttribute CreateGroup createGroup, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		if(createGroup.getName() == null || createGroup.getName().equals("") || createGroup.getFriends() == null || createGroup.getFriends().equals("") || createGroup.getIsPrivate() == null) {
    			System.out.println(createGroup.getName());
    			System.out.println(createGroup.getFriends());
    			System.out.println(createGroup.getIsPrivate());
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Create Group] Incorrect data with ip: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		String[] friendids = gson.fromJson(createGroup.getFriends(), String[].class);

    		String[] result = tokenManager.checkToken(createGroup.getToken(), ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Create Group] Token fail with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		//Create the group
    		String groupid = "gid$" + Instant.now().getEpochSecond() + tokenManager.generateUserId(6);
    		Group group = new Group();
    		try {
    			group.setIsPrivate(createGroup.getIsPrivate());
    			group.setIsAnon(createGroup.getIsAnon());
    			group.setName(createGroup.getName());
    			group.setImage(createGroup.getImage());
    			group.setTime_created(new Date().getTime());
    			group.setTime_edited(new Date().getTime());
    			group.setDeleted(false);
    			group.setGroupid(groupid);
    			groupRepository.save(group);
    			
    			GroupDetails gd = new GroupDetails();
    			gd.setGroupid(groupid);
    			gd.setImage(createGroup.getImage());
    			gd.setIsActive(true);
    			gd.setName(createGroup.getName());
    			gdr.save(gd);
    			
    		}
    		catch(Exception e) {
    			e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Create Group] Server error (failed creating group) for user: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.INTERNAL_SERVER_ERROR);
    		}

    		try {
    			//Add CREATED and MEMBER_OF relationship for creator
        		groupRepository.addCreatorOfGroup(result[1], groupid);
    		}
    		catch(Exception e) {
    			groupRepository.removeGroup(groupid, result[1]);
    			e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Create Group] Server error (failed at add creator of group) for user: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.INTERNAL_SERVER_ERROR);
    		}

    		/*
    		 *
    		 * For production
    		 *
    		 */
    		//Send to Job Queuer to link friends
        	/*try {
        		Linking link = new Linking();
        		link.setUserid(result[1]);
        		link.setGroupid(groupid);
        		link.setType(0);
        		link.setFriendids(gson.toJson(friendids));
        		JobItem ji = new JobItem();
        		ji.setTime(new Date());
        		ji.setStatus(0); //0 means it has been queued
        		ji.setType(2); // 2 is linking
        		ji.setData(gson.toJson(link));
        		jobItemRepository.save(ji);
        	}
        	catch(Exception e) {
        		e.printStackTrace();
        		System.out.println("Failed to add linking to job queuer (type 0): " + groupid);
        	}*/

        	/*
        	 *
        	 * Good for testing, not for production
        	 *
        	 */
    		/*Linking link = new Linking();
    		link.setUserid(result[1]);
    		link.setGroupid(groupid);
    		link.setType(0);
    		link.setFriendids(gson.toJson(friendids));
    		this.producer.sendMessage("linking", gson.toJson(link));*/
    		
    		//Add self to get notifications
			GroupMembership gmOwner = new GroupMembership();
			gmOwner.setChatNotifs(true);
			gmOwner.setIsActive(true);
			gmOwner.setPostNotifs(true);
			gmOwner.setGroupid(groupid);
			gmOwner.setTime_joined(new Date());
			gmOwner.setUserid(result[1]); 		
    		gmr.save(gmOwner);
    		
    		
    		//Add MEMBER_OF relationship for friends
    		for(int i = 0; i<friendids.length; i++) {
    			try {
    				groupRepository.addFriendToGroup(friendids[i], groupid, result[1]);
    				
                	try {
                		GroupMembership gm = new GroupMembership();
        	    		gm.setChatNotifs(true);
        	    		gm.setIsActive(true);
        	    		gm.setPostNotifs(true);
        	    		gm.setGroupid(groupid);
        	    		gm.setTime_joined(new Date());
        	    		gm.setUserid(friendids[i]); 		
        	    		gmr.save(gm);
                	}
                	catch(Exception e) {
                		e.printStackTrace();
            			lgr.log(Level.INFO, "[Create Group] Failed to add group membership for user: " + result[1] + " for groupid: " + groupid);
                	}
    			}
    			catch(Exception e) {
    				e.printStackTrace();
        			lgr.log(Level.INFO, "[Create Group] Failed to connect user: " + friendids[i] + " to groupid: " + groupid);
    			}
    		}
    		
    		
    		//Send notification here
    		Notification notif = new Notification();
    		notif.setType(8);
    		notif.setGroupid(groupid);
    		notif.setAdder(result[1]);
    		notif.setFriendBatch(gson.toJson(friendids));
    		
    		this.producer.sendMessage("notifications", gson.toJson(notif));

    		Group g = new Group();
    		g.setGroupid(groupid);
    		g.setName(createGroup.getName());

    		returnMessage.setStatus("success");
    		returnMessage.setData(gson.toJson(g));
    		if(!result[0].equals("NA")) {
        		returnMessage.setToken(result[0]);
    		}
			lgr.log(Level.INFO, "[Create Group] Created group for userid: " + result[1]);
    		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Create Group] Incorrect data for ip: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}
	
	@RequestMapping(value = "/g/ep", method = RequestMethod.POST)
    public ResponseEntity < String > editGroupPicture(@RequestParam("token") String token, @RequestParam("groupid") String groupid, @RequestParam("imageFile") MultipartFile imageFile, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		String[] result = tokenManager.checkToken(token, ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Edit Group Photo] Token fail with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		
			byte[] imageBytes = imageFile.getBytes();
			
			String format = mediaManager.getFormat(imageBytes, imageFile.getOriginalFilename());
			
			if(!mediaManager.isValidFormat(format)) {
				returnMessage.setStatus("fail");
				returnMessage.setReason("Invalid format");
    			lgr.log(Level.INFO, "[Edit Group Picture] Invalid format with userid: " + result[1]);
				return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
			}
			else {
				String reference = mediaManager.saveMedia(imageBytes, result[1], ip, format, 1);
				try {
	    			Boolean allowChange = groupRepository.editGroupPicture(result[1], groupid, reference);
	    			
	    			//Should check if above query was successful before doing this [SECURITY]
	    			if(allowChange) {
	    				gdr.setGroupImage(groupid, reference);
	    			}
	    			
	    			returnMessage.setStatus("success");
	    			if(!result[0].equals("NA")) {
	        			returnMessage.setToken(result[0]);
	        		}
	    			returnMessage.setData(reference);
	    			lgr.log(Level.INFO, "[Edit Group Picture] Changed group picture for userid: " + result[1]);
	        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
	    		}
	    		catch(Exception e) {
	    			e.printStackTrace();
	    			returnMessage.setStatus("fail");
	    			returnMessage.setReason("server-error");
	    			lgr.log(Level.INFO, "[Edit Group Picture] Server error with userid: " + result[1]);
	    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.INTERNAL_SERVER_ERROR);
	    		}
			}

    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Edit Group Picture] Incorrect data with ip: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}

	@RequestMapping(value = "/g/e", method = RequestMethod.POST)
    public ResponseEntity < String > editGroup(@ModelAttribute EditGroup editGroup, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		if(editGroup.getName() == null || editGroup.getGroupid() == null || editGroup.getName().equals("") || editGroup.getGroupid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Edit Group] Incorrect data with ip: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		String[] result = tokenManager.checkToken(editGroup.getToken(), ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Edit Group] Token fail with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		try {
    			Boolean allowChange = groupRepository.updateName(editGroup.getGroupid(), editGroup.getName(), result[1]);
    			
    			//Should check if above query succeeded [SECURITY]
    			    			
    			if(allowChange) {
    				gdr.setGroupName(editGroup.getGroupid(), editGroup.getName());
    			}
    		}
    		catch(Exception e) {
    			e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Edit Group] Server fail with userid: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.INTERNAL_SERVER_ERROR);

    		}

    		returnMessage.setStatus("success");
    		if(!result[0].equals("NA")) {
        		returnMessage.setToken(result[0]);
    		}
			lgr.log(Level.INFO, "[Edit Group] Edited group for userid: " + result[1]);
    		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Edit Group] Incorrect data with ip: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}

	@RequestMapping(value = "/g/af", method = RequestMethod.POST)
    public ResponseEntity < String > addFriends(@ModelAttribute GroupFriendManagement gfm, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		if(gfm.getGroupid() == null || gfm.getGroupid().equals("") || gfm.getFriends() == null || gfm.getFriends().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Add Friend] Incorrect data for ip: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		String[] result = tokenManager.checkToken(gfm.getToken(), ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Add Friend] Token failed with ip: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		/*
    		 *
    		 * For production
    		 *
    		 */
    		//Send to Job Queuer to link friends
        	/*try {
        		Linking link = new Linking();
        		link.setUserid(result[1]);
        		link.setGroupid(gfm.getGroupid());
        		link.setType(0);
        		link.setFriendids(gson.toJson(gfm.getFriends()));
        		JobItem ji = new JobItem();
        		ji.setTime(new Date());
        		ji.setStatus(0); //0 means it has been queued
        		ji.setType(2); // 2 is linking
        		ji.setData(gson.toJson(link));
        		jobItemRepository.save(ji);
        	}
        	catch(Exception e) {
        		e.printStackTrace();
        		System.out.println("Failed to add linking to job queuer (type 0): " + gfm.getGroupid());
        	}*/

        	/*
        	 *
        	 * Good for testing, not for production
        	 *
        	 */
    		/*String[] friendsToAdd = gson.fromJson(gfm.getFriends(), String[].class);
    		Linking link = new Linking();
    		link.setUserid(result[1]);
    		link.setGroupid(gfm.getGroupid());
    		link.setType(0);
    		link.setFriendids(gson.toJson(friendsToAdd));
    		this.producer.sendMessage("linking", gson.toJson(link));*/

    		//Add MEMBER_OF relationship for friends
    		String[] friendsToAdd = gson.fromJson(gfm.getFriends(), String[].class);
    		for(int i = 0; i<friendsToAdd.length; i++) {
    			try {
    				groupRepository.addFriendToGroup(friendsToAdd[i], gfm.getGroupid(), result[1]);
                	try {
                		GroupMembership gm = new GroupMembership();
        	    		gm.setChatNotifs(true);
        	    		gm.setIsActive(true);
        	    		gm.setPostNotifs(true);
        	    		gm.setGroupid(gfm.getGroupid());
        	    		gm.setTime_joined(new Date());
        	    		gm.setUserid(friendsToAdd[i]); 		
        	    		gmr.save(gm);
                	}
                	catch(Exception e) {
                		e.printStackTrace();
            			lgr.log(Level.INFO, "[Add Friend] Failed to set group membership for userid: " + friendsToAdd[i] + " groupid: " + gfm.getGroupid());
                	}
    			}
    			catch(Exception e) {
    				e.printStackTrace();
        			lgr.log(Level.INFO, "[Add Friend] Failed to connect user: " + friendsToAdd[i] + " groupid: " + gfm.getGroupid());
    			}
    		}
    		
    		//Send notification here
    		Notification notif = new Notification();
    		notif.setType(8);
    		notif.setGroupid(gfm.getGroupid());
    		notif.setAdder(result[1]);
    		notif.setFriendBatch(gson.toJson(friendsToAdd));
    		
    		this.producer.sendMessage("notifications", gson.toJson(notif));

    		returnMessage.setStatus("success");
    		if(!result[0].equals("NA")) {
        		returnMessage.setToken(result[0]);
    		}
			lgr.log(Level.INFO, "[Add Friends] Added friends for userid: " + result[1]);
    		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Add Friends] Incorrect data for userid: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}

	@RequestMapping(value = "/g/rf", method = RequestMethod.POST)
    public ResponseEntity < String > removeFriend(@ModelAttribute GroupFriendManagement gfm, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		if(gfm.getGroupid() == null || gfm.getGroupid().equals("") || gfm.getFriend() == null || gfm.getFriend().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Remove Friend From Group] Incorrect data with ip: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		String[] result = tokenManager.checkToken(gfm.getToken(), ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Remove Friend From Group] Token fail with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		//remove MEMBER_OF relationship for friend
    		try {
        		Boolean failed = groupRepository.removeFriendFromGroup(gfm.getGroupid(),gfm.getFriend(), result[1]);
				if(!failed) {
					gmr.revokeGroupMembership(gfm.getGroupid(), gfm.getFriend());
				}	
    		}
    		catch(Exception e) {
    			e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-fail");
    			lgr.log(Level.INFO, "[Remove Friend From Group] Server fail with userid: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.INTERNAL_SERVER_ERROR);
    		}

    		returnMessage.setStatus("success");
    		if(!result[0].equals("NA")) {
        		returnMessage.setToken(result[0]);
    		}
			lgr.log(Level.INFO, "[Remove Friend From Group] Removed friend for userid: " + result[1]);
    		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Remove Friend From Group] Incorrect data with ip: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}

	@RequestMapping(value = "/g/d", method = RequestMethod.POST)
    public ResponseEntity < String > deleteGroup(@ModelAttribute EditGroup editGroup, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		if(editGroup.getGroupid() == null || editGroup.getGroupid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Delete Group] Incorrect data with ip: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		String[] result = tokenManager.checkToken(editGroup.getToken(), ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Delete Group] Token fail with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		//detach and delete group node
    		try {
        		Boolean allowChange = groupRepository.deleteGroup(editGroup.getGroupid(), result[1]);
        		        		
        		//Should check if above query succeeded [SECURITY]
        		if(allowChange) {
        			gdr.setGroupInactive(editGroup.getGroupid());
        		}
    		}
    		catch(Exception e) {
    			e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-fail");
    			lgr.log(Level.INFO, "[Delete Group] Server fail with userid: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		
    		gmr.setGroupInactive(editGroup.getGroupid());

    		returnMessage.setStatus("success");
    		if(!result[0].equals("NA")) {
        		returnMessage.setToken(result[0]);
    		}
			lgr.log(Level.INFO, "[Delete Group] Set group inactive for userid: " + result[1] + " groupid: " + editGroup.getGroupid());
    		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Delete Group] Incorrect data for ip: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}

	@RequestMapping(value = "/g/u", method = RequestMethod.POST)
    public ResponseEntity < String > getUserGroups(@ModelAttribute GroupFriendManagement gfm, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		String[] result = tokenManager.checkToken(gfm.getToken(), ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Get User Groups] Token fail with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		try {
    			List<GroupResult> groups = groupRepository.getAllUserGroups(result[1]);
        		returnMessage.setStatus("success");
        		returnMessage.setData(gson.toJson(groups));
        		if(!result[0].equals("NA")) {
            		returnMessage.setToken(result[0]);
        		}
    			lgr.log(Level.INFO, "[Get User Group] Fetched data for user: " + result[1]);
        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
        		e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Get User Group] Server error for userid: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Get User Group] Incorrect data for ip: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}

	@RequestMapping(value = "/g/m", method = RequestMethod.POST)
    public ResponseEntity < String > getGroupMembers(@ModelAttribute GroupFriendManagement gfm, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		if(gfm.getGroupid() == null || gfm.getGroupid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Get Group Members] Incorrect data for ip: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		String[] result = tokenManager.checkToken(gfm.getToken(), ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Get Group Members] Token fail with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		try {
    			List<GroupMember> groups = groupRepository.getAllGroupMembers(gfm.getGroupid(), result[1]);
        		returnMessage.setStatus("success");
        		returnMessage.setData(gson.toJson(groups));
        		if(!result[0].equals("NA")) {
            		returnMessage.setToken(result[0]);
        		}
    			lgr.log(Level.INFO, "[Get Group Members] Fetched data for userid: " + result[1]);
        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
        		e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Get Group Members] Server error for userid: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Get Group Members] Incorrect data for ip: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}

	@RequestMapping(value = "/g/l", method = RequestMethod.POST)
    public ResponseEntity < String > leaveGroup(@ModelAttribute GroupFriendManagement gfm, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		if(gfm.getGroupid() == null || gfm.getGroupid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Leave Group] Incorrect data with ip: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		String[] result = tokenManager.checkToken(gfm.getToken(), ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Leave Group] Token failed for ip: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		try {
    			Boolean failed = groupRepository.leaveGroup(gfm.getGroupid(),result[1]);
    			if(!failed) {
    				gmr.revokeGroupMembership(gfm.getGroupid(), result[1]);
    			}
        		returnMessage.setStatus("success");
        		if(!result[0].equals("NA")) {
            		returnMessage.setToken(result[0]);
        		}
    			lgr.log(Level.INFO, "[Leave Group] Left group for userid: " + result[1] + " groupid: " + gfm.getGroupid());
        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
        		e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Leave Group] Server error for userid: " + result[1] + " groupid: " + gfm.getGroupid());
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Leave Group] Incorrect data for ip: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}

	@RequestMapping(value = "/g/i", method = RequestMethod.POST)
    public ResponseEntity < String > getGroupDetails(@ModelAttribute GroupFriendManagement gfm, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		if(gfm.getGroupid() == null || gfm.getGroupid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Get Group Details] Incorrect data for ip: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		String[] result = tokenManager.checkToken(gfm.getToken(), ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Get Group Details] Token fail with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		try {
    			GroupResult gr = groupRepository.getDetails(gfm.getGroupid(),result[1]);
        		returnMessage.setStatus("success");
        		returnMessage.setData(gson.toJson(gr));
        		if(!result[0].equals("NA")) {
            		returnMessage.setToken(result[0]);
        		}
    			lgr.log(Level.INFO, "[Get Group Details] Fetched data for userid: " + result[1]);
        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
        		e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Get Group Details] Server error for userid: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Get Group Details] Incorrect data for ip: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}

	@RequestMapping(value = "/g/gp", method = RequestMethod.POST)
    public ResponseEntity < String > getGroupPosts(@RequestParam("offset") Integer offset, @RequestParam("before_time") Long before_time, @ModelAttribute GroupFriendManagement gfm, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		if(gfm.getGroupid() == null || gfm.getGroupid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Get Group Posts] Incorrect data for ip: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		String[] result = tokenManager.checkToken(gfm.getToken(), ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Get Group Posts] Token fail with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		try {
    			List<PostAndLikes> gr = groupRepository.getGroupPosts(gfm.getGroupid(),result[1], offset, before_time);
        		returnMessage.setStatus("success");
        		returnMessage.setData(gson.toJson(gr));
        		if(!result[0].equals("NA")) {
            		returnMessage.setToken(result[0]);
        		}
    			lgr.log(Level.INFO, "[Get Group Posts] Fetched posts for userid: " + result[1]);
        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
        		e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Get Group Posts] Server error for userid: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Get Group Posts] Incorrect data for ip: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}

	@RequestMapping(value = "/g/j", method = RequestMethod.POST)
    public ResponseEntity < String > joinGroup(@ModelAttribute GroupFriendManagement gfm, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		if(gfm.getGroupid() == null || gfm.getGroupid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Joined Group] Incorrect data for ip: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		String[] result = tokenManager.checkToken(gfm.getToken(), ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Join Group] Token fail with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		//Add MEMBER_OF relationship for userid
    		try {
    			groupRepository.joinGroup(result[1], gfm.getGroupid());
    		}
    		catch(Exception e) {
    			e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Join Group] Server error for userid: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		
    		GroupMembership gm = new GroupMembership();
    		gm.setChatNotifs(true);
    		gm.setIsActive(true);
    		gm.setPostNotifs(true);
    		gm.setGroupid(gfm.getGroupid());
    		gm.setTime_joined(new Date());
    		gm.setUserid(result[1]); 		
    		gmr.save(gm);
    		
    		//Send notification here
    		Notification notif = new Notification();
    		notif.setType(9);
    		notif.setGroupid(gfm.getGroupid());
    		notif.setJoiner(result[1]);
    		
    		this.producer.sendMessage("notifications", gson.toJson(notif));

    		returnMessage.setStatus("success");
    		if(!result[0].equals("NA")) {
        		returnMessage.setToken(result[0]);
    		}
			lgr.log(Level.INFO, "[Join Group] Joined group for userid: " + result[1]);
    		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Join Group] Incorrect data for ip: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}
	
	@RequestMapping(value = "/g/tpn", method = RequestMethod.POST)
    public ResponseEntity < String > togglePostNotifs(@ModelAttribute GroupFriendManagement gfm, @RequestParam("toggle") Boolean toggle, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		if(gfm.getGroupid() == null || gfm.getGroupid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Toggle Group Post Notifs] Incorrect data for ip: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		String[] result = tokenManager.checkToken(gfm.getToken(), ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Toggle Group Post Notifs] Token fail with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		try {
    			gmr.togglePostNotifs(gfm.getGroupid(), result[1], toggle);
        		returnMessage.setStatus("success");
        		if(!result[0].equals("NA")) {
            		returnMessage.setToken(result[0]);
        		}
    			lgr.log(Level.INFO, "[Toggle Group Post Notifs] Toggled data for userid: " + result[1]);
        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
        		e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Toggle Group Post Notifs] Server error for userid: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Toggle Group Post Notifs] Incorrect data for ip: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}
	
	@RequestMapping(value = "/g/tcn", method = RequestMethod.POST)
    public ResponseEntity < String > toggleChatNotifs(@ModelAttribute GroupFriendManagement gfm, @RequestParam("toggle") Boolean toggle, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		if(gfm.getGroupid() == null || gfm.getGroupid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Toggle Group Chat Notifs] Incorrect data for ip: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		String[] result = tokenManager.checkToken(gfm.getToken(), ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Toggle Group Chat Notifs] Token fail with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		try {
    			gmr.toggleChatNotifs(gfm.getGroupid(), result[1], toggle);
        		returnMessage.setStatus("success");
        		if(!result[0].equals("NA")) {
            		returnMessage.setToken(result[0]);
        		}
    			lgr.log(Level.INFO, "[Toggle Group Chat Notifs] Toggled data for userid: " + result[1]);
        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
        		e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Toggle Group Chat Notifs] Server error for userid: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Toggle Group Chat Notifs] Incorrect data for ip: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}
	
	@RequestMapping(value = "/g/ggns", method = RequestMethod.POST)
    public ResponseEntity < String > getGroupNotificationSettings(@ModelAttribute GroupFriendManagement gfm, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		if(gfm.getGroupid() == null || gfm.getGroupid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Get Group Notification Settings] Incorrect data for ip: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		String[] result = tokenManager.checkToken(gfm.getToken(), ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Get Group Notif Settings] Token fail with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		try {
    			GroupMembership res = gmr.getPermissions(gfm.getGroupid(), result[1]);
    			res.setGroupid(null);
    			res.setIsActive(null);
    			res.setTime_joined(null);
    			res.setUniqid(null);
    			res.setUserid(null);

        		returnMessage.setStatus("success");
        		returnMessage.setData(gson.toJson(res));
        		if(!result[0].equals("NA")) {
            		returnMessage.setToken(result[0]);
        		}
    			lgr.log(Level.INFO, "[Get Group Notif Settings] got permissions for userid: " + result[1]);
        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
        		e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Get Group Notif Settings] Server error for userid: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Get Group Notif Settings] Incorrect data for ip: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}
	
	@RequestMapping(value = "/g/rg", method = RequestMethod.POST)
    public ResponseEntity < String > reportGroup(@RequestParam("token") String token, @ModelAttribute ReportedGroup report, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		if(report.getGroupid() == null || report.getMessage() == null || report.getMessage().equals("") || report.getGroupid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		String[] result = tokenManager.checkToken(token, ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Report Group] Token fail with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		try {
    			if(report.getMessage().length() > 1024) {
    				report.setMessage(report.getMessage().substring(0, 1023));
    			}
    			report.setSubmissionTime(new Date());
    			report.setUserid(result[1]);
    			rgr.save(report);
        		returnMessage.setStatus("success");
        		if(!result[0].equals("NA")) {
            		returnMessage.setToken(result[0]);
        		}
    			lgr.log(Level.INFO, "[Report Group] Saved report for userid: " + result[1]);
        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
        		e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Report Group] Server error for userid: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Report Group] Incorrect data for ip: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}
	
	@RequestMapping(value = "/g/ggnam", method = RequestMethod.POST)
    public ResponseEntity < String > getGroupNameAndMembers(@RequestParam String groupid, HttpServletRequest request) {
    	/*String ip = request.getRemoteAddr();
    	
    	if(!ip.equals("127.0.0.1")) {
    		System.out.println(ip);
    		//lgr.log(Level.SEVERE, "[Get Group Name and Members] Not fetching data, not localhost: " + groupid);
       		return new ResponseEntity<String>("no-fetch", HttpStatus.UNAUTHORIZED);
    	}*/
    	
    	try {
    		
    		GroupResult gr = groupRepository.getGroupNameAndMembers(groupid);
    		
    		if(gr == null) {
    			lgr.log(Level.INFO, "[Get Group Name] Fetched null for groupid: " + groupid);
            	return new ResponseEntity<String>("server-error", HttpStatus.OK);
    		}
    		
    		Gson gson = new Gson();

       		lgr.log(Level.INFO, "[Get Group Name] Fetched name for groupid: " + groupid);
        	return new ResponseEntity<String>(gson.toJson(gr), HttpStatus.OK);
    	}
    	catch(Exception e) {
    		e.printStackTrace();
       		lgr.log(Level.SEVERE, "[Get Group Name] Server error for groupid: " + groupid);
       		return new ResponseEntity<String>("server-error", HttpStatus.INTERNAL_SERVER_ERROR);
   		}
    }
	
}
