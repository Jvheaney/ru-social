package ca.rumine.backend.RU.Mine;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptorAdapter;
import org.springframework.stereotype.Controller;

@Controller
@SuppressWarnings("deprecation")
public class TopicSubscriptionInterceptor extends ChannelInterceptorAdapter {
	
	@Autowired
	TokenManager tokenManager;	
	
	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		StompHeaderAccessor headerAccessor= StompHeaderAccessor.wrap(message);
		if (StompCommand.SUBSCRIBE.equals(headerAccessor.getCommand())) {
			Object token = headerAccessor.getFirstNativeHeader("authtoken");
			if(token == null) {
				throw new IllegalArgumentException("No permission to connect");
			}
			if(!headerAccessor.getDestination().equals("/mt/t/system")){
				if(!validateSubscription(token.toString(), headerAccessor.getDestination()))
				{
					throw new IllegalArgumentException("No permission for this topic");
				}
			}
		}
		else if (StompCommand.CONNECT.equals(headerAccessor.getCommand())) {
			Object token = headerAccessor.getFirstNativeHeader("authtoken");
			if(token == null) {
				throw new IllegalArgumentException("No permission to connect");
			}
			if(!validateToken(token.toString()))
			{
				throw new IllegalArgumentException("No permission to connect");
			}
		}
		return message;
	}

	private boolean validateToken(String token)
	{
		if (token == null) {
			// unauthenticated user
			return false;
		}
    	Boolean checkTokenResp = tokenManager.checkJustTokenIntercept(token);
    	if(checkTokenResp != null && checkTokenResp == true) {
    		return true;
    	}
    	else {
    		return false;
    	}
	}
	
	private boolean validateSubscription(String token, String topicDestination)
	{
		if (token == null) {
			// unauthenticated user
			return false;
		}
		String matchid = topicDestination.substring(6);
		System.out.println(matchid);
		if(matchid.contains("gid$")) {
			System.out.println("isGroup");
			//It is a group, check against group table
	    	Boolean checkTokenResp = tokenManager.checkTokenInterceptForGroups(token, matchid);
	    	if(checkTokenResp != null && checkTokenResp == true) {
	    		System.out.println("hasPermission");
	    		return true;
	    	}
	    	else {
	    		System.out.println("hasNoPermission");
	    		return false;
	    	}
		}
		else {
	    	Boolean checkTokenResp = tokenManager.checkTokenIntercept(token, matchid);
	    	if(checkTokenResp != null && checkTokenResp == true) {
	    		return true;
	    	}
	    	else {
	    		return false;
	    	}
		}
	}
}
