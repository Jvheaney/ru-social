package ca.rumine.backend.RU.Mine;

import java.util.ArrayList;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.TextMessage;

import com.google.gson.Gson;

import ca.rumine.backend.RU.Mine.model.MatchConversation;
import ca.rumine.backend.RU.Mine.model.Message;
import ca.rumine.backend.RU.Mine.model.RecentConnectionResult;
import ca.rumine.backend.RU.Mine.manager.MessageManager;
import ca.rumine.backend.RU.Mine.manager.SwipeManager;
import ca.rumine.backend.RU.Mine.repository.MatchRepository;
import ca.rumine.backend.RU.Mine.repository.RecentConnectionsRepository;

@Controller
@RestController
public class MessageController {
	
	@Autowired
	private MessageManager messageManager;
	
	@Autowired
	private SwipeManager swipeManager;
	
	@Autowired
	private TokenManager tokenManager;
	
	@Autowired
	private RecentConnectionsRepository rcr;
	
	@Autowired
	private MatchRepository matchRepository;
    
    @RequestMapping(value = "/gw/m/c/{offset}", method = RequestMethod.POST)
    public ResponseEntity < String > getConversation(@PathVariable(value ="offset") String offset, @ModelAttribute Message msg, HttpServletRequest request) {
    	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(msg.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
    		 lgr.log(Level.INFO, "[Get Conversation] User told to logout ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else {
            if(msg.getMatchid() != null && offset != null) {
            	int offset_pass = 0;
            	try {
            		offset_pass = Integer.parseInt(offset);
            	}
            	catch(Exception e){
           		 	lgr.log(Level.WARNING, "[Get Conversation] No offset for user: " + checkTokenResp[1]);
            		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
                	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
            	}
            	String resp = "";
            	if(msg.getMatchid().equals("system")) {
            		resp = messageManager.getSystemConversation();
            	}
            	else {
            		resp = messageManager.getConversation(msg.getMatchid(), offset_pass, checkTokenResp[1]);
            	}
       		 	lgr.log(Level.INFO, "[Get Conversation] Returned convo for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"data\":" + resp + "}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
            }
            else {
       		 	lgr.log(Level.WARNING, "[Get Conversation] Wrong data on: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
            }
    	}
    }
    
    @RequestMapping(value = "/gw/m/gc/{offset}", method = RequestMethod.POST)
    public ResponseEntity < String > getGroupConversation(@PathVariable(value ="offset") String offset, @ModelAttribute Message msg, HttpServletRequest request) {
    	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(msg.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
    		 lgr.log(Level.INFO, "[Get Group Conversation] User told to logout ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else {
            if(msg.getMatchid() != null && offset != null) {
            	int offset_pass = 0;
            	try {
            		offset_pass = Integer.parseInt(offset);
            	}
            	catch(Exception e){
           		 	lgr.log(Level.WARNING, "[Get Group Conversation] No offset for user: " + checkTokenResp[1]);
            		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
                	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
            	}
            	String resp = "";
            	if(msg.getMatchid().equals("system")) {
            		resp = messageManager.getSystemConversation();
            	}
            	else {
            		resp = messageManager.getGroupConversation(msg.getMatchid(), offset_pass, checkTokenResp[1]);
            	}
       		 	lgr.log(Level.INFO, "[Get Group Conversation] Returned convo for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"data\":" + resp + "}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
            }
            else {
       		 	lgr.log(Level.WARNING, "[Get Group Conversation] Wrong data on: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
            }
    	}
    }
    
    @RequestMapping(value = "/gw/m/un", method = RequestMethod.POST)
    public ResponseEntity < String > unmatch(@ModelAttribute Message msg, @RequestParam String userid, HttpServletRequest request) {
    	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(msg.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Unmatch] User told to logout ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else {
            if(msg.getMatchid() != null) {
       		 	lgr.log(Level.INFO, "[Unmatch] User unmatched, submitted by userid: " + checkTokenResp[1]);
        		matchRepository.unmatch(checkTokenResp[1], msg.getMatchid());
        		//Remove from recent connections
        		rcr.removeFromRecentConnections(checkTokenResp[1], userid, 0);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"data\":\"success\"}";
                return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
            }
            else {
       		 	lgr.log(Level.WARNING, "[Unmatch] Wrong data for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
            }
    	}
    }
    
    @RequestMapping(value = "/gw/m/sc", method = RequestMethod.POST)
    public ResponseEntity < String > startConversation(@ModelAttribute Message msg, @RequestParam String userid, @RequestParam Integer type, HttpServletRequest request) {
    	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(msg.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Start Conversation] User told to logout ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else {
    		if(type != 0 && type != 1) {
    			lgr.log(Level.WARNING, "[Start Conversation] Wrong data for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"wrongdata\"}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.BAD_REQUEST);
    		}
    		
    		String ret = swipeManager.startConversation(checkTokenResp[1], userid, type);
    		
    		if(ret.equals("server-error")) {
    			lgr.log(Level.WARNING, "[Start Conversation] Server error for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
            	return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    		
       		lgr.log(Level.INFO, "[Start Conversation] Returning conversation data for user: " + checkTokenResp[1]);
        	String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"data\":" + ret + "}";
            return new ResponseEntity<String>(tokenResponse, HttpStatus.OK);
    	}
    }
    
    @RequestMapping(value = "/gw/m/grc", method = RequestMethod.POST)
    public ResponseEntity < String > getRecentConnections(@ModelAttribute Message msg, HttpServletRequest request) {
    	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(msg.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Get Recent Connections] User told to logout ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else {
    		try {
    			ArrayList<String[]> connections = rcr.getRecentConnections(checkTokenResp[1]);
    			//build the return json
    			String dataArray = "[";
    			String dataJson = "";
    			Gson gson = new Gson();
    			RecentConnectionResult rcr = new RecentConnectionResult();
    			for(int i=0; i<connections.size(); i++) {
    				rcr.setUserid(connections.get(i)[0]);
    				rcr.setImage0(connections.get(i)[1]);
    				rcr.setFirstname_display(connections.get(i)[2]);
    				rcr.setType(connections.get(i)[3]);
    				dataJson = gson.toJson(rcr);
    				if(i+1 != connections.size()) {
    					dataJson+=",";
    				}
    				dataArray += dataJson;
    			}
    			//
    			dataArray += "]";
       		 	lgr.log(Level.INFO, "[Get Recent Connections] Returned Recent Connections, submitted by userid: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"data\":" + dataArray + "}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    		}
    		catch(Exception e) {
    			e.printStackTrace();
       		 	lgr.log(Level.SEVERE, "[Get Recent Connections] Server-error fetching Recent Connections for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/m/gc", method = RequestMethod.POST)
    public ResponseEntity < String > getConversations(@ModelAttribute Message msg, HttpServletRequest request) {
    	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(msg.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Get Conversations] User told to logout ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else {
    		try {
    			ArrayList<String[]> conversations = matchRepository.getConversations(checkTokenResp[1]);
    			//build the return json
    			String dataArray = "[";
    			String dataJson = "";
    			Gson gson = new Gson();
    			MatchConversation mc = new MatchConversation();
    			for(int i=0; i<conversations.size(); i++) {
    				if(conversations.get(i)[2] == null){
    					//Is group
    					mc.setMatchid(conversations.get(i)[0]); //Groupid
    					mc.setMessage(conversations.get(i)[3]);
    					mc.setRead(Boolean.parseBoolean(conversations.get(i)[11])); //isRead
    					mc.setTime_sent(conversations.get(i)[5]);
    					mc.setName(conversations.get(i)[8]);
    					mc.setData(conversations.get(i)[7]);
    					mc.setGroup_fname(conversations.get(i)[12]);
    					if(conversations.get(i)[6] != null && conversations.get(i)[6].equals(checkTokenResp[1])) {
        					mc.setSentby("me");
    					}
    					else {
    						mc.setSentby("else");
    					}
    					mc.setType("2");
    				}
    				else {
    					mc.setMatchid(conversations.get(i)[0]);
        				mc.setUserid(conversations.get(i)[2]);
        				if(conversations.get(i)[3] != null) {
        					try {
        						String message = StringEscapeUtils.unescapeJson(messageManager.decryptAES(conversations.get(i)[3], conversations.get(i)[1]));
        						if(message.length() > 47) {
        							message = message.substring(0, 47) +  "...";
        						}
        						mc.setMessage(message);
        					} catch (Exception e) {
        						// TODO Auto-generated catch block
        						e.printStackTrace();
        						mc.setMessage("");
        					}
        				}
        				else{
        					mc.setMessage("");
        				}
        				if((conversations.get(i)[4] == null || conversations.get(i)[4].equals("")) && conversations.get(i)[5] != null && !conversations.get(i)[5].equals(checkTokenResp[1])) {
        					mc.setRead(false);
        				}
        				else {
        					mc.setRead(true);
        				}
        				mc.setTime_sent(conversations.get(i)[5]);
        				if(conversations.get(i)[6] != null && conversations.get(i)[6].equals(checkTokenResp[1])) {
        					mc.setSentby("me");
        				}
        				else {
        					mc.setSentby("else");
        				}
        				mc.setData(conversations.get(i)[7]);
        				mc.setName(conversations.get(i)[8]);
        				mc.setType(conversations.get(i)[10]);
    				}
    				dataJson = gson.toJson(mc);
    				if(i+1 != conversations.size()) {
    					dataJson+=",";
    				}
    				dataArray += dataJson;
    			}
    			//
    			dataArray += "]";
       		 	lgr.log(Level.INFO, "[Get Conversations] Returned Conversations, submitted by userid: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"data\":" + dataArray + "}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Get Conversations] Server-error fetching Conversations for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/m/c", method = RequestMethod.POST)
    public ResponseEntity < String > getMatchConversations(@ModelAttribute Message msg, HttpServletRequest request) {
    	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(msg.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Get Match Screen] User told to logout ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else {
    		try {
    			ArrayList<String[]> conversations = matchRepository.getMatchConversations(checkTokenResp[1]);
    			//build the return json
    			String dataArray = "[";
    			String dataJson = "";
    			Gson gson = new Gson();
    			MatchConversation mc = new MatchConversation();
    			for(int i=0; i<conversations.size(); i++) {
    				mc.setMatchid(conversations.get(i)[0]);
    				mc.setUserid(conversations.get(i)[2]);
    				if(conversations.get(i)[3] != null) {
    					try {
    						String message = StringEscapeUtils.unescapeJson(messageManager.decryptAES(conversations.get(i)[3], conversations.get(i)[1]));
    						if(message.length() > 47) {
    							message = message.substring(0, 47) +  "...";
    						}
    						mc.setMessage(message);
    					} catch (Exception e) {
    						// TODO Auto-generated catch block
    						e.printStackTrace();
    						mc.setMessage("Don't leave your match waiting, send a message!");
    					}
    				}
    				else{
    					mc.setMessage("Don't leave your match waiting, send a message!");
    				}
    				if((conversations.get(i)[4] == null || conversations.get(i)[4].equals("")) && conversations.get(i)[5] != null && !conversations.get(i)[5].equals(checkTokenResp[1])) {
    					mc.setRead(false);
    				}
    				else {
    					mc.setRead(true);
    				}
    				if(conversations.get(i)[5] != null && conversations.get(i)[5].equals(checkTokenResp[1])) {
    					mc.setSentby("me");
    				}
    				else if(conversations.get(i)[5] == null) {
    					mc.setSentby("newmatch");
    				}
    				else {
    					mc.setSentby("else");
    				}
    				mc.setData("https://rumine.ca/_i/s/i.php?i=" + conversations.get(i)[6]);
    				mc.setName(conversations.get(i)[7]);
    				dataJson = gson.toJson(mc);
    				dataJson+=",";
    				dataArray += dataJson;
    			}
    			mc.setMatchid("system");
    			mc.setUserid("awLhtRlCjOumHvFeFqyaa-1585024945");
    			mc.setData("https://rumine.ca/_i/s/i.php?i=rg4oof6cMS9N1mffKspvuIxpRWSTF1Oa");
    			mc.setMessage("Welcome to RU Mine!");
    			mc.setRead(true);
    			mc.setSentby("else");
    			mc.setName("RU Mine");
    			dataJson = gson.toJson(mc);
    			dataArray += dataJson;
    			//
    			dataArray += "]";
       		 	lgr.log(Level.INFO, "[Get Match Screen] Returned matches, submitted by userid: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"data\":" + dataArray + "}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Get Match Screen] Server-error fetching matches for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @RequestMapping(value = "/gw/m/gm", method = RequestMethod.POST)
    public ResponseEntity < String > getMatches(@ModelAttribute Message msg, HttpServletRequest request) {
    	Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
    	String ip = request.getRemoteAddr();
    	String[] checkTokenResp = tokenManager.checkToken(msg.getToken(), ip);
    	if(checkTokenResp[1] == "logout") {
   		 	lgr.log(Level.INFO, "[Get Matches] User told to logout ip: " + ip);
    		return new ResponseEntity<String>("\"logout\"", HttpStatus.UNAUTHORIZED);
    	}
    	else {
    		try {
    			ArrayList<String[]> matches = matchRepository.getMatches(checkTokenResp[1]);
    			
    			//build the return json
    			String dataArray = "[";
    			String dataJson = "";
    			Gson gson = new Gson();
    			MatchConversation mc = new MatchConversation();
    			for(int i=0; i<matches.size(); i++) {
    				mc.setUserid(matches.get(i)[0]);
    				mc.setName(matches.get(i)[1]);
    				mc.setData(matches.get(i)[2]);
    				mc.setMatchid(matches.get(i)[3]);
    				dataJson = gson.toJson(mc);
    				if(i+1 != matches.size()) {
    					dataJson+=",";
    				}
    				dataArray += dataJson;
    			}
    			//
    			dataArray += "]";
    			
    			
    			
       		 	lgr.log(Level.INFO, "[Get Matches] Returned matches, submitted by userid: " + checkTokenResp[1]);
        		String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"data\":" + dataArray + "}";
        		return new ResponseEntity<String>(tokenResponse, HttpStatus.CREATED);
    		}
    		catch(Exception e) {
       		 	lgr.log(Level.SEVERE, "[Get Matches] Server-error fetching matches for user: " + checkTokenResp[1]);
    			String tokenResponse = "{\"token\":\"" + checkTokenResp[0] + "\", \"status\":\"server-error\"}";
    			return new ResponseEntity<String>(tokenResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    	}
    }
    
    @MessageMapping("/m/{matchid}")
    @SendTo("/mt/t/{matchid}")
    public Message handleMessages(org.springframework.messaging.Message<?> msg, @DestinationVariable("matchid") String matchid, @RequestBody Message message) throws Exception {
		Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
		StompHeaderAccessor headerAccessor= StompHeaderAccessor.wrap(msg);
		Object token = headerAccessor.getFirstNativeHeader("authtoken");
		if(token == null) {
   		 	lgr.log(Level.WARNING, "[Handle Messages] No token");
			throw new Exception("No token, not authorized to send message");
		}
		else {
			if(message.getMsg() != null && matchid.equals(message.getMatchid())) {
		    	String checkTokenResp = tokenManager.getUserId(token.toString());
                lgr.log(Level.INFO, "[Handle Messages] User sending message: " + checkTokenResp);
                if(!checkTokenResp.equals("logout") && message.getMatchid().contains("gid$")) {
                	String resp = messageManager.sendGroupMessage(message.getMatchid(), checkTokenResp, message.getMsg(), message.getType(), message.getName());
	        		message.setTime_sent(new Date());
	        		message.setSenderid(checkTokenResp);
	        		message.setMessage_id(Integer.parseInt(resp));
	    	    	return message; //this is what gets sent to everyone at the end
                }
                else if(!checkTokenResp.equals("logout") && !message.getMatchid().equals("system")) {
	        		String resp = messageManager.sendMessage(message.getMatchid(), checkTokenResp, message.getMsg(), message.getType(), message.getName());
	        		message.setTime_sent(new Date());
	        		message.setSenderid(checkTokenResp);
	        		message.setMessage_id(Integer.parseInt(resp));
	    	    	return message; //this is what gets sent to everyone at the end
		    	}
		    	else if(message.getMatchid().equals("system")) {
	        		message.setTime_sent(new Date());
	        		message.setSenderid(checkTokenResp);
	        		message.setMessage_id(0);
	    	    	return message; 
		    	}
		    	else {
		   		 	lgr.log(Level.WARNING, "[Handle Messages] User not logged in");
	    			throw new Exception("Not logged in");
		    	}

            }
            else {
                lgr.log(Level.WARNING, "[Handle Messages] MATCHID in throw : " + matchid);
                lgr.log(Level.WARNING, "[Handle Messages] messageGetMatchId : " + message.getMatchid());
                lgr.log(Level.WARNING, "[Handle Messages] message get msg : " + message.getMsg());
    			throw new Exception("Not proper data");
            }
		}
    }
    
    @MessageMapping("/mr/{matchid}")
    public void markRead(org.springframework.messaging.Message<?> msg, @DestinationVariable("matchid") String matchid, @RequestBody Message message) throws Exception {
		Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
		StompHeaderAccessor headerAccessor= StompHeaderAccessor.wrap(msg);
		Object token = headerAccessor.getFirstNativeHeader("authtoken");
		if(token == null) {
			throw new Exception("No token, not authorized to read message");
		}
		else {
			if(matchid.equals(message.getMatchid()) && matchid.contains("gid$")) {
				String checkTokenResp = tokenManager.getUserId(token.toString());
				messageManager.markGroupRead(matchid, checkTokenResp);
			}
			else if(message.getMessage_id() != null && matchid.equals(message.getMatchid())) {
				if(message.getMessage_id() == 0) {
				}
				else{
			    	String checkTokenResp = tokenManager.getUserId(token.toString());
	        		messageManager.markRead(message.getMessage_id(), message.getMatchid(), checkTokenResp);
				}
            }
            else {
                lgr.log(Level.WARNING, "[Mark Read] Matchid mismatch or no message number. url_id: " + matchid + " token_id: " + message.getMatchid());
                lgr.log(Level.WARNING, "[Mark Read] Message number: " + message.getMessage_id());
    			throw new Exception("Not proper data");
            }
		}
    }
    
    @MessageMapping("/rm/{matchid}")
    @SendTo("/mt/t/{matchid}")
    public Message reactToMessage(org.springframework.messaging.Message<?> msg, @DestinationVariable("matchid") String matchid, @RequestBody Message message) throws Exception {
		Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
		StompHeaderAccessor headerAccessor= StompHeaderAccessor.wrap(msg);
		Object token = headerAccessor.getFirstNativeHeader("authtoken");
		if(token == null) {
			throw new Exception("No token, not authorized to read message");
		}
		else {
			if(message.getMessage_id() != null && matchid.equals(message.getMatchid())) {
				if(message.getMessage_id() == 0) {
				}
				else{
			    	String checkTokenResp = tokenManager.getUserId(token.toString());
	        		messageManager.addReact(message.getMessage_id(), message.getMatchid(), message.getReact(), checkTokenResp);
				}
				return message;
            }
            else {
                lgr.log(Level.WARNING, "[Add React] Matchid mismatch or no message number. url_id: " + matchid + " token_id: " + message.getMatchid());
                lgr.log(Level.WARNING, "[Add React] Message number: " + message.getMessage_id());
    			throw new Exception("Not proper data");
            }
		}
    }
    
}
