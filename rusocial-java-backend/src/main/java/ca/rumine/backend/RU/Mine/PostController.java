package ca.rumine.backend.RU.Mine;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
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
import ca.rumine.backend.RU.Mine.model.Comment;
import ca.rumine.backend.RU.Mine.model.CommentsAndLikes;
import ca.rumine.backend.RU.Mine.model.CreateComment;
import ca.rumine.backend.RU.Mine.model.CreatePost;
import ca.rumine.backend.RU.Mine.model.GroupResult;
import ca.rumine.backend.RU.Mine.model.LikePostComment;
import ca.rumine.backend.RU.Mine.model.Post;
import ca.rumine.backend.RU.Mine.model.PostAndLikes;
import ca.rumine.backend.RU.Mine.model.ReportedComment;
import ca.rumine.backend.RU.Mine.model.ReportedPost;
import ca.rumine.backend.RU.Mine.model.ReturnMessage;
import ca.rumine.backend.RU.Mine.model.SharePost;
import ca.rumine.backend.RU.Mine.model.UserResult;
import ca.rumine.backend.RU.Mine.repository.CommentRepository;
import ca.rumine.backend.RU.Mine.repository.PostRepository;
import ca.rumine.backend.RU.Mine.repository.ReportedCommentRepository;
import ca.rumine.backend.RU.Mine.repository.ReportedPostRepository;

@Controller
@RestController
public class PostController {
	
	private Producer producer = new Producer();

    @Autowired
    void KafkaController(Producer producer) {
        this.producer = producer;
    }
	
	@Autowired
	private PostRepository postRepository;
	
	@Autowired
	private CommentRepository commentRepository;
	
	@Autowired
	private ReportedPostRepository rpr;
	
	@Autowired
	private ReportedCommentRepository rcr;
	
	@Autowired
	private TokenManager tokenManager;
	
	@Autowired
	private MediaManager mediaManager;
	
	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
	
	@RequestMapping(value = "/p/n", method = RequestMethod.POST)
    public ResponseEntity < String > createPost(@ModelAttribute CreatePost cp, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {
    		
    		if(cp.getGroups().equals("") || cp.getGroups() == null || cp.getText() == null || cp.getAllowComments() == null || cp.getAllowSharing() == null) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Create Post] Incorrect data with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		
    		
    		String[] result = tokenManager.checkToken(cp.getToken(), ip);
    		
    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Create Post] Token fail with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		
    		String[] groupids = gson.fromJson(cp.getGroups(), String[].class);
    		Integer type = 0;
    		String[] mediaReferences;
    		try {
    			mediaReferences = gson.fromJson(cp.getMedia(), String[].class);
    			if(mediaReferences.length > 0) {
    				type = 1;
    			}
    		}
    		catch(Exception e) {
    			e.printStackTrace();
    			System.out.println("Has no images or failed");
    			mediaReferences = new String[0];
    		}
    		
    		String postid = tokenManager.generateUserId(16) + Instant.now().getEpochSecond() + tokenManager.generateUserId(6);
    		Post post = new Post();
    		post.setText(cp.getText());
    		post.setTime_submitted(new Date().getTime());
    		post.setMedia(mediaReferences);
    		post.setPostid(postid);
    		post.setType(type);
    		post.setAllowComments(cp.getAllowComments());
    		post.setAllowSharing(cp.getAllowSharing());
    		post.setDeleted(false);
    		//Create post
    		try {
    			postRepository.save(post);
    			postRepository.connectPosterToPost(postid, result[1]);
    			/*PostingAnalytics pa = new PostingAnalytics(postid);
        		this.producer.sendMessage("new-post", gson.toJson(pa));*/
    		}
    		catch(Exception e) {
    			e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Create Post] Server Error with userid: " + result[1]);
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
        		link.setPostid(postid);
        		link.setType(1);
        		link.setGroupids(gson.toJson(cp.getGroups()));
        		JobItem ji = new JobItem();
        		ji.setTime(new Date());
        		ji.setStatus(0); //0 means it has been queued
        		ji.setType(2); // 2 is linking
        		ji.setData(gson.toJson(link));
        		jobItemRepository.save(ji);
        	}
        	catch(Exception e) {
        		e.printStackTrace();
        		System.out.println("Failed to add linking to job queuer (type 1): " + postid);
        	}*/
    		
        	/*
        	 * 
        	 * Good for testing, not for production
        	 * 
        	 */
    		//Link post to groups
    		/*Linking link = new Linking();
    		link.setUserid(result[1]);
    		link.setPostid(postid);
    		link.setType(1);
    		link.setGroupids(gson.toJson(groupids));
    		this.producer.sendMessage("linking", gson.toJson(link));*/
    		
    		for(int i = 0; i<groupids.length; i++) {
    			try {
    				postRepository.addPostToGroup(postid, groupids[i], result[1]);
    				//Send notification here
    	    		Notification notif = new Notification();
    	    		notif.setType(5);
    	    		notif.setGroupid(groupids[i]);
    	    		notif.setPoster(result[1]);
    	    		notif.setPostContent(cp.getText());
    	    		notif.setPostid(postid);
    	    		
    	    		this.producer.sendMessage("notifications", gson.toJson(notif));
    			}
    			catch(Exception e) {
        			e.printStackTrace();
        			System.out.println("Failed to add to group");
        			lgr.log(Level.INFO, "[Create Post] Failed to add post: " + postid + " to group: " + groupids[i]);
        		}
    		}
    		
    		
    		
    		returnMessage.setStatus("success");
    		returnMessage.setData(postid);
    		if(!result[0].equals("NA")) {
        		returnMessage.setToken(result[0]);
    		}
			lgr.log(Level.INFO, "[Create Post] Created Post for userid: " + result[1]);
    		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Create Post] Incorrect data with IP: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}
		
	}
	
	@RequestMapping(value = "/p/e", method = RequestMethod.POST)
    public ResponseEntity < String > editPost(@RequestParam("token") String token, @RequestParam("postid") String postid, @RequestParam("mediaRemoved") Boolean mediaRemoved, @RequestParam("mediaSizeChanged") Boolean mediaSizeChanged, @RequestParam("media") String media, @RequestParam("text") String text, @RequestParam("allowSharing") Boolean allowSharing, @RequestParam("allowComments") Boolean allowComments, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {
    		
    		String[] result = tokenManager.checkToken(token, ip);
    		
    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Edit Post] Token fail with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		String[] mediaToSave = gson.fromJson(media, String[].class);
    		
    		if(mediaRemoved) {
    			postRepository.editTextAndRemoveMedia(result[1], postid, text);
    		}
    		else if(mediaSizeChanged) {
    			//Get post's media by postid
    			String[] postMedia = postRepository.getPostMedia(postid).getMedia();
    			Boolean dnc = false;
    			for(int i = 0; i < mediaToSave.length; i++) {
    					System.out.println(mediaToSave[i]);
    			      if(!Arrays.asList(postMedia).contains(mediaToSave[i])) {
    			    	  dnc = true;
    			    	  break;
    			      }
    			}
    			
    			if(dnc) {
    				returnMessage.setStatus("fail");
    				returnMessage.setReason("Incorrect data");
        			lgr.log(Level.INFO, "[Edit Post] Incorrect data for userid: " + result[1]);
    				return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    			}
    			
    			//All good, save
    			postRepository.editTextAndMedia(result[1], postid, text, allowSharing, allowComments, mediaToSave);
    		}
    		else {
    			postRepository.editText(result[1], postid, text, allowSharing, allowComments);
    		}
    		
    		
    		returnMessage.setStatus("success");
    		if(!result[0].equals("NA")) {
        		returnMessage.setToken(result[0]);
    		}
			lgr.log(Level.INFO, "[Edit Post] Edited post for user: " + result[1]);
    		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Edit Post] Incorrect data with IP: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}
		
	}
	
	@RequestMapping(value = "/p/d", method = RequestMethod.POST)
    public ResponseEntity < String > deletePost(@RequestParam("token") String token, @RequestParam("postid") String postid, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {
    		
    		String[] result = tokenManager.checkToken(token, ip);
    		
    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Delete Post] Token fail with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		postRepository.deletePost(result[1], postid);
    		
    		returnMessage.setStatus("success");
    		if(!result[0].equals("NA")) {
        		returnMessage.setToken(result[0]);
    		}
			lgr.log(Level.INFO, "[Delete Post] Deleted post for userid: " + result[1]);
    		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Delete Post] Incorrect data with IP: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}
		
	}

	@RequestMapping(value = "/p/c", method = RequestMethod.POST)
    public ResponseEntity < String > commentOnPost(@ModelAttribute CreateComment cc, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {
    		
    		if(cc.getPostid() == null || cc.getPostid().equals("") || cc.getText() == null || cc.getText().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Comment On Post] Incorrect data with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		
    		String[] result = tokenManager.checkToken(cc.getToken(), ip);
    		
    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Comment On Post] Token failed with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		String commentid = tokenManager.generateUserId(16) + Instant.now().getEpochSecond() + tokenManager.generateUserId(6);
    		Comment comment = new Comment();
    		comment.setText(cc.getText());
    		comment.setTime_submitted(new Date().getTime());
    		comment.setCommentid(commentid);
    		comment.setDeleted(false);
    		
    		//Create comment and link
    		try {
    			commentRepository.save(comment);
    			System.out.println(result[1]);
    			UserResult up = commentRepository.connectCommentToPostAndCommenterToComment(cc.getPostid(), commentid, result[1]);
    			//PostingAnalytics pa = new PostingAnalytics(commentid);
        		//this.producer.sendMessage("new-comment", gson.toJson(pa));
        		
        		System.out.println(up.getUserid());
        		
        		if(!up.getUserid().equals(result[1])) {
        			try {
        				Notification notif = new Notification();
        	    		notif.setType(10);
        	    		notif.setCommentContent(cc.getText());
        	    		notif.setCommentid(commentid);
        	    		notif.setCommenter(up.getFirst_name()); //the person who left the comment
        	    		notif.setRecipient(up.getUserid()); //the person who made the original post
        	    		
        	    		this.producer.sendMessage("notifications", gson.toJson(notif));
            		}
            		catch(Exception e) {
            			e.printStackTrace();
            			lgr.log(Level.INFO, "[Comment On Post] Failed to send notification: " + up.getUserid());
            		}
        		}
    		}
    		catch(Exception e) {
    			e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Comment On Post] Server error for userid: " + result[1] + " postid: " + cc.getPostid());
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		
    		//PostingAnalytics pa = new PostingAnalytics(cc.getPostid(), true);
    		//this.producer.sendMessage("comment", gson.toJson(pa));
    		
    		returnMessage.setStatus("success");
    		returnMessage.setData(commentid);
    		if(!result[0].equals("NA")) {
        		returnMessage.setToken(result[0]);
    		}
			lgr.log(Level.INFO, "[Comment On Post] Made comment for user: " + result[1]);
    		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Comment On Post] Incorrect data with IP: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}
		
	}
	
	@RequestMapping(value = "/p/s", method = RequestMethod.POST)
    public ResponseEntity < String > sharePost(@ModelAttribute SharePost sp, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {
    		
    		if(sp.getGroupid() == null || sp.getGroupid().equals("") || sp.getPostid() == null || sp.getPostid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Share Post] Incorrect data with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		    		
    		String[] result = tokenManager.checkToken(sp.getToken(), ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		    		
    		try {
    			
    			/*Linking link = new Linking();
        		link.setUserid(result[1]);
        		link.setPostid(sp.getPostid());
        		link.setType(2); //linking shares
        		link.setGroupids(sp.getGroupid());
        		this.producer.sendMessage("linking", gson.toJson(link));*/
    			
    			//Link post to groups
    			postRepository.sharePost(sp.getGroupid(), sp.getPostid(), result[1], "Someone", new Date());
        		
        		returnMessage.setStatus("success");
        		if(!result[0].equals("NA")) {
            		returnMessage.setToken(result[0]);
        		}
        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
        		
        		
    		}
    		catch(Exception e) {
    			e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		
    		
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}
		
	}
	
	@RequestMapping(value = "/p/lp", method = RequestMethod.POST)
    public ResponseEntity < String > likePost(@ModelAttribute LikePostComment lpc, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {
    		
    		if(lpc.getPostid() == null || lpc.getPostid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Like Post] Incorrect data with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		
    		String[] result = tokenManager.checkToken(lpc.getToken(), ip);
    		
    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Like Post] Token failed with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		    		
    		try {
    			UserResult up = postRepository.likePost(lpc.getPostid(), result[1]);
    			
    			//PostingAnalytics pa = new PostingAnalytics(lpc.getPostid(), up.getCreated());
        		//this.producer.sendMessage("post-like", gson.toJson(pa));
        		if(up.getCreated() && !up.getUserid().equals(result[1])) {
        			try {
        				//Send notification
        				Notification notif = new Notification();
        	    		notif.setType(12);
        	    		notif.setLiker(up.getFirst_name()); //the person who liked the post
        	    		notif.setRecipient(up.getUserid()); //the person who made the original post
        	    		notif.setPostid(lpc.getPostid());
        	    		
        	    		this.producer.sendMessage("notifications", gson.toJson(notif));
            		}
            		catch(Exception e) {
            			e.printStackTrace();
            			lgr.log(Level.INFO, "[Like Post] Failed to send notification for userid: " + result[1]);
            		}
        		}
        		
        		returnMessage.setStatus("success");
        		if(!result[0].equals("NA")) {
            		returnMessage.setToken(result[0]);
        		}
    			lgr.log(Level.INFO, "[Like Post] Liked comment for user: " + result[1]);
        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Like Post] Server error for userid: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Like Post] Incorrect data with IP: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}
		
	}
	
	@RequestMapping(value = "/p/lc", method = RequestMethod.POST)
    public ResponseEntity < String > likeComment(@ModelAttribute LikePostComment lpc, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {
    		
    		if(lpc.getCommentid() == null || lpc.getCommentid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Like Comment] Incorrect data with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		
    		String[] result = tokenManager.checkToken(lpc.getToken(), ip);
    		
    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Like Comment] Token failed with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		
    		
    		try {
    			UserResult up = commentRepository.likeComment(lpc.getCommentid(), result[1]);
    			
    			//PostingAnalytics pa = new PostingAnalytics(lpc.getCommentid(), up.getCreated());
        		//this.producer.sendMessage("comment-like", gson.toJson(pa));
        		
        		if(up.getCreated() && !up.getUserid().equals(result[1])) {
        			try {
        				//Send notification
        				Notification notif = new Notification();
        	    		notif.setType(11);
        	    		notif.setLiker(up.getFirst_name()); //the person who liked the post
        	    		notif.setRecipient(up.getUserid()); //the person who made the original post
        	    		notif.setCommentid(lpc.getCommentid());
        	    		
        	    		this.producer.sendMessage("notifications", gson.toJson(notif));
            		}
            		catch(Exception e) {
            			e.printStackTrace();
            			lgr.log(Level.INFO, "[Like Comment] Failed to add notification for userid: " + up.getUserid());
            		}
        		}
        		
        		returnMessage.setStatus("success");
        		if(!result[0].equals("NA")) {
            		returnMessage.setToken(result[0]);
        		}
    			lgr.log(Level.INFO, "[Like Comment] Liked comment with userid: " + result[1]);
        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		
    		}
    		catch(Exception e) {
    			e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Like Comment] Server error with userid: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		
    		
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Like Comment] Incorrect data with IP: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}
		
	}
	
	@RequestMapping(value = "/p/dc", method = RequestMethod.POST)
    public ResponseEntity < String > deleteComment(@ModelAttribute LikePostComment lpc, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {
    		
    		if(lpc.getCommentid() == null || lpc.getCommentid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Delete Comment] Incorrect data with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		
    		String[] result = tokenManager.checkToken(lpc.getToken(), ip);
    		
    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Delete Comment] Token failed with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		
    		
    		try {
    			commentRepository.deleteComment(result[1],lpc.getCommentid());
        		
        		returnMessage.setStatus("success");
        		if(!result[0].equals("NA")) {
            		returnMessage.setToken(result[0]);
        		}
    			lgr.log(Level.INFO, "[Delete Comment] Deleted comment for userid: " + result[1] + " comment: " + lpc.getCommentid());
        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		
    		}
    		catch(Exception e) {
    			e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Delete Comment] Server error for user: " + result[1] + " comment: " + lpc.getCommentid());
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		
    		
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Delete Comment] Incorrect data with IP: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}
		
	}
	
	@RequestMapping(value = "/p/gp", method = RequestMethod.POST)
    public ResponseEntity < String > getPost(@ModelAttribute LikePostComment lpc, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {
    		
    		if(lpc.getPostid() == null || lpc.getPostid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Get Post] Incorrect data with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		
    		String[] result = tokenManager.checkToken(lpc.getToken(), ip);
    		
    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Get Post] Token failed with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		
    		try {
    			PostAndLikes pal = postRepository.getPostAndLikes(lpc.getPostid(), result[1]);
    			returnMessage.setStatus("success");
    			returnMessage.setData(gson.toJson(pal));
        		if(!result[0].equals("NA")) {
            		returnMessage.setToken(result[0]);
        		}
    			lgr.log(Level.INFO, "[Get Post] Fetched post for userid: " + result[1]);
        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Get Post] Server error for userid: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Get Post] Incorrect data with IP: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}
		
	}
	
	@RequestMapping(value = "/p/gc", method = RequestMethod.POST)
    public ResponseEntity < String > getCommentsForPost(@ModelAttribute LikePostComment lpc, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {
    		
    		if(lpc.getPostid() == null || lpc.getPostid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Get Comments For Post] Incorrect data with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		
    		String[] result = tokenManager.checkToken(lpc.getToken(), ip);
    		
    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Get Comments For Post] Token failed with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		
    		try {
    			List<CommentsAndLikes> cal = postRepository.getCommentsAndLikes(lpc.getPostid(), result[1]);
    			returnMessage.setStatus("success");
    			returnMessage.setData(gson.toJson(cal));
        		if(!result[0].equals("NA")) {
            		returnMessage.setToken(result[0]);
        		}
    			lgr.log(Level.INFO, "[Get Comments For Post] Got comments for post: " + result[1]);
        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Get Comments For Post] Server error: " + result[1] + " postid: " + lpc.getPostid());
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Get Comments For Post] Incorrect data with IP: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}
		
	}
	
	@RequestMapping(value = "/p/gg", method = RequestMethod.POST)
    public ResponseEntity < String > getPostGroups(@RequestParam("token") String token, @RequestParam("postid") String postid, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {
    		
    		if(postid == null || postid.equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Get Post Groups] Incorrect data with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		
    		String[] result = tokenManager.checkToken(token, ip);
    		
    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Get Post Groups] Token failed with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		
    		List<GroupResult> gr = postRepository.getPostInGroups(postid);
    		returnMessage.setStatus("success");
			returnMessage.setData(gson.toJson(gr));
    		if(!result[0].equals("NA")) {
        		returnMessage.setToken(result[0]);
    		}
			lgr.log(Level.INFO, "[Get Post Groups] Get post groups: " + result[1]);
    		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Get Post Groups] Incorrect data with IP: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}
		
	}
	
	@RequestMapping(value = "/p/rg", method = RequestMethod.POST)
    public ResponseEntity < String > removePostFromGroup(@RequestParam("token") String token, @RequestParam("postid") String postid,  @RequestParam("groupid") String groupid, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {
    		
    		if(postid == null || postid.equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Remove Post From Group] Incorrect data with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		
    		String[] result = tokenManager.checkToken(token, ip);
    		
    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Remove Post From Group] Token failed with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    		
    		Integer rel_left = postRepository.removePostInGroup(result[1], postid, groupid);
    		if(rel_left-1 == 0) {
    			//remove post
    			postRepository.removePostAndComments(result[1],postid);
    		}
    		returnMessage.setStatus("success");
    		if(!result[0].equals("NA")) {
        		returnMessage.setToken(result[0]);
    		}
			lgr.log(Level.INFO, "[Remove Post From Group] Removed post from group: " + result[1]);
    		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Remove Post From Group] Incorrect data with IP: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}
		
	}
	
	@RequestMapping(value = "/p/rp", method = RequestMethod.POST)
    public ResponseEntity < String > reportPost(@RequestParam("token") String token, @ModelAttribute ReportedPost report, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		if(report.getPostid() == null || report.getPostid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Report Post] Incorrect data with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		String[] result = tokenManager.checkToken(token, ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Report Post] Token failed with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		try {
    			report.setSubmissionTime(new Date());
    			report.setUserid(result[1]);
    			rpr.save(report);
        		returnMessage.setStatus("success");
        		if(!result[0].equals("NA")) {
            		returnMessage.setToken(result[0]);
        		}
    			lgr.log(Level.INFO, "[Report Post] Reported post for userid: " + result[1]);
        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
        		e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Report Post] Server error for userid: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Report Post] Incorrect data with IP: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}
	
	@RequestMapping(value = "/p/rc", method = RequestMethod.POST)
    public ResponseEntity < String > reportComment(@RequestParam("token") String token, @ModelAttribute ReportedComment report, HttpServletRequest request) {
		Gson gson = new Gson();
		ReturnMessage returnMessage = new ReturnMessage();
    	String ip = request.getRemoteAddr();
    	try {

    		if(report.getCommentid() == null || report.getCommentid().equals("")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Incorrect data");
    			lgr.log(Level.INFO, "[Report Comment] Incorrect data with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		String[] result = tokenManager.checkToken(token, ip);

    		if(result[1].equals("logout")) {
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("Token failed");
    			lgr.log(Level.INFO, "[Report Comment] Token failed with IP: " + ip);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}

    		try {
    			report.setSubmissionTime(new Date());
    			report.setUserid(result[1]);
    			rcr.save(report);
        		returnMessage.setStatus("success");
        		if(!result[0].equals("NA")) {
            		returnMessage.setToken(result[0]);
        		}
    			lgr.log(Level.INFO, "[Report Comment] Reported comment for userid: " + result[1]);
        		return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.OK);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
        		e.printStackTrace();
    			returnMessage.setStatus("fail");
    			returnMessage.setReason("server-error");
    			lgr.log(Level.INFO, "[Report Comment] Server error for userid: " + result[1]);
    			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    		}
    	}
    	catch(Exception e) {
    		e.printStackTrace();
			returnMessage.setStatus("fail");
			returnMessage.setReason("Incorrect data");
			lgr.log(Level.INFO, "[Report Comment] Incorrect data with IP: " + ip);
			return new ResponseEntity<String>(gson.toJson(returnMessage), HttpStatus.UNAUTHORIZED);
    	}

	}
}
