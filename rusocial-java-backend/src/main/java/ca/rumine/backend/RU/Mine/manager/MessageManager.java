package ca.rumine.backend.RU.Mine.manager;

import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.apache.commons.text.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import ca.rumine.backend.RU.Mine.RuMineApplication;
import ca.rumine.backend.RU.Mine.kafka.Producer;
import ca.rumine.backend.RU.Mine.kafka.payloads.Notification;
import ca.rumine.backend.RU.Mine.model.Message;
import ca.rumine.backend.RU.Mine.model.NotificationToken;
import ca.rumine.backend.RU.Mine.model.PushNotificationRequest;
import ca.rumine.backend.RU.Mine.model.UserProfile;
import ca.rumine.backend.RU.Mine.model.Match;
import ca.rumine.backend.RU.Mine.model.MatchEncKeys;
import ca.rumine.backend.RU.Mine.repository.MessageRepository;
import ca.rumine.backend.RU.Mine.repository.NotificationRepository;
import ca.rumine.backend.RU.Mine.repository.ProfileRepository;
import ca.rumine.backend.RU.Mine.repository.MatchEncKeysRepository;
import ca.rumine.backend.RU.Mine.repository.MatchRepository;

@Service
public class MessageManager {
	
	private Producer producer = new Producer();

    @Autowired
    void KafkaController(Producer producer) {
        this.producer = producer;
    }
	
	@Autowired
	private EntityManager em;
	
	@Autowired
	private MessageRepository messageRepository;
	
	@Autowired
	private MatchEncKeysRepository mecRepository;
	
	@Autowired
	private MatchRepository matchRepository;
	
	@Autowired
	private NotificationRepository notificationRepository;
	
	@Autowired
	private ProfileRepository profileRepository;
	
	@Autowired
	private NotificationManager notificationManager;
		
	public String sendMessage(String matchid, String userid, String message, Integer type, String name) {
		Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
		//Get public key
		MatchEncKeys mek = mecRepository.getKeySet(matchid);
		String aesKey = mek.getAes_key();
		//Encrypt message with public key
        String encryptedMessage = "";
        String cleanedMessage = StringEscapeUtils.escapeJson(message);
        try {
        	encryptedMessage = encryptAES(cleanedMessage, aesKey);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
	        lgr.log(Level.SEVERE, "exception for AES encryption");
	        lgr.log(Level.INFO, "Message: " + message);
	        lgr.log(Level.INFO, "Userid: " + userid);
	        return "server-error";
		}
		Message msg = new Message();
		msg.setMatchid(matchid);
		msg.setMsg(encryptedMessage);
		msg.setSenderid(userid);
		msg.setTime_sent(new Date());
		Message msgRet = messageRepository.save(msg);
		
		//Send notification here
		Gson gson = new Gson();
		Notification notif = new Notification();
		if(type == null || type == 0) {
			//Dating message
			notif.setType(0);
		}
		else if(type == 1) {
			//Friends message
			notif.setType(7);
			notif.setMessageContent(message);
		}
		notif.setSenderName(name);
		notif.setMatchid(matchid);
		notif.setSenderid(userid);
				
		this.producer.sendMessage("notifications", gson.toJson(notif));
		
        /*try {
        	Match recepientUseridObj = matchRepository.getRecepientUserid(matchid);
        	String recepientUserid = "";
        	if(recepientUseridObj.getUserid_1().equals(userid)){
        		recepientUserid = recepientUseridObj.getUserid_2();
        	}
        	else {
        		recepientUserid = recepientUseridObj.getUserid_1();
        	}
        	if(!recepientUserid.equals("")){
        		String notif_token = notificationRepository.getCurrentToken(recepientUserid);
        		if(!notif_token.equals("loggedout")) {
        			if(type == null || type == 0) {
        				UserProfile up = profileRepository.getUserProfile(userid);
        				PushNotificationRequest pnr = new PushNotificationRequest();
                		lgr.log(Level.INFO, "[Message handler notification type 0] FIRSTNAME : " + up.getFirstname_display());
                    	pnr.setTitle("New Message");
                    	pnr.setMessage(up.getFirstname_display() + " sent a message!");
                    	pnr.setToken(notif_token);
                    	pnr.setTopic("");
            			String[] dataToSend = new String[2];
            			dataToSend[0] = up.getFirstname_display();
            			notificationManager.sendDataToClient(notif_token, "message", dataToSend);
            			notificationManager.sendPushNotificationToToken(pnr);
        			}
        			else if(type == 1) {
        				String firstname = profileRepository.getUserFromFriends(userid);
        				PushNotificationRequest pnr = new PushNotificationRequest();
                		lgr.log(Level.INFO, "[Message handler notification type 1] FIRSTNAME : " + firstname);
                    	String messageToDisplay = message;
                    	String messageToSendInData = message;
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
        			}
                	
        		}
        		else {
            		lgr.log(Level.INFO, "[MESSAGE MANAGER] (SEND MESSAGE) Recepient is logged out, no notification sent.");

        		}
        	}
        }
        catch(Exception e) {
        	e.printStackTrace();
        }*/
		return msgRet.getMessage_id().toString();
	}
	
	public String sendGroupMessage(String groupid, String userid, String message, Integer type, String name) {
		Logger lgr = Logger.getLogger(RuMineApplication.class.getName());
        String cleanedMessage = StringEscapeUtils.escapeJson(message);
		Message msg = new Message();
		msg.setMatchid(groupid);
		msg.setMsg(message);
		msg.setSenderid(userid);
		msg.setTime_sent(new Date());
		Message msgRet = messageRepository.save(msg);
		
		//Send notification here
		Gson gson = new Gson();
		Notification notif = new Notification();
		notif.setType(1);
		notif.setGroupid(groupid);
		notif.setSenderid(userid);
		notif.setMessageContent(message);
		notif.setSenderName(name);
		this.producer.sendMessage("notifications", gson.toJson(notif));
		return msgRet.getMessage_id().toString();
	}
	
	public void markRead(int message_id, String matchid, String userid) {
		messageRepository.setRead(message_id, matchid, userid);
	}
	
	public void markGroupRead(String matchid, String userid) {
		messageRepository.setLastCheckIn(userid, matchid);
	}
	
	public void addReact(int message_id, String matchid, String react, String userid) {
		if(react.equals("")) {
			messageRepository.removeReact(message_id, matchid, userid);
		}
		else {
			messageRepository.addReact(message_id, matchid, react, userid);
		}
	}
	
	public String getConversation(String matchid, int offset, String userid) {
		MatchEncKeys mek = mecRepository.getKeySet(matchid);
		String aesKey = mek.getAes_key();
		Message[] messages = messageRepository.getConversation(matchid, offset);
		messageRepository.setRead(matchid, userid);
		String data = "[";
		for(int i=0; i<messages.length; i++) {
			data += "{ \"_id\":";
			data += messages[i].getMessage_id();
			if(messages[i].getReact() != null) {
				data += ", \"react\":\"";
				data += messages[i].getReact();
				data += "\"";
			}
			data += ", \"text\":\"";
			try {
				data += decryptAES(messages[i].getMsg(), aesKey);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				data += "";
			}
			data += "\", \"createdAt\":\"";
			data += messages[i].getTime_sent();
			data += "\", \"user\":{\"_id\":\"";
			if(messages[i].getSenderid().equals(userid)) {
				data += "0";
			}
			else {
				data += "1";
			}
			data += "\"}}";
			if(i != messages.length-1) {
				data+= ",";
			}
		}
		data+="]";
		return data;
	}
	
	public String getGroupConversation(String matchid, int offset, String userid) {
		Message[] messages = messageRepository.getGroupConversation(matchid, offset);
		messageRepository.setLastCheckIn(userid, matchid);
		String data = "[";
		for(int i=0; i<messages.length; i++) {
			data += "{ \"_id\":";
			data += messages[i].getMessage_id();
			if(messages[i].getReact() != null) {
				data += ", \"react\":\"";
				data += messages[i].getReact();
				data += "\"";
			}
			data += ", \"text\":\"";
			data += StringEscapeUtils.escapeJson(messages[i].getMsg());
			data += "\", \"createdAt\":\"";
			data += messages[i].getTime_sent();
			data += "\", \"user\":{\"_id\":\"";
			if(messages[i].getSenderid().equals(userid)) {
				data += "0";
			}
			else {
				data += messages[i].getSenderid();
			}
			data += "\",\"name\":\"";
			data += messages[i].getName();
			data += "\",\"avatar\":\"";
			data += messages[i].getAvatar();
			data += "\"}}";
			if(i != messages.length-1) {
				data+= ",";
			}
		}
		data+="]";
		return data;
	}
	
	public String getSystemConversation() {
		String data = "[";
		data += "{\"_id\":4, \"text\":\"Stay safe and have fun!\", \"createdAt\":\"" + new Date() +"\", \"user\":{\"_id\":1}},";
		data += "{\"_id\":3, \"text\":\"You can video chat using apps like WhatsApp, Facebook Messenger, Facetime, or traditional calling.\", \"createdAt\":\"" + new Date() +"\", \"user\":{\"_id\":1}},";
		data += "{\"_id\":2, \"text\":\"Please be mindful of the pandemic that is occurring now. Due to COVID-19, we suggest that you do not meet your matches just yet.\", \"createdAt\":\"" + new Date() +"\", \"user\":{\"_id\":1}},";
		data += "{\"_id\":1, \"text\":\"Here you can find important messages from us.\", \"createdAt\":\"" + new Date() +"\", \"user\":{\"_id\":1}},";
		data += "{\"_id\":0, \"text\":\"Welcome to RU Mine!\", \"createdAt\":\"" + new Date() +"\", \"user\":{\"_id\":1}}";
		data +="]";
		return data;
	}
	
	public String encryptAES(String text, String aes_key) throws Exception {

	    byte[] encoded = Base64.getDecoder().decode(aes_key);
	    SecretKey originalKey = new SecretKeySpec(encoded, 0, encoded.length, "AES");
	    Cipher aesCipher = Cipher.getInstance("AES");
	    aesCipher.init(Cipher.ENCRYPT_MODE, originalKey);
	    byte[] encrypted = aesCipher.doFinal(text.getBytes());

	    return Base64.getEncoder().encodeToString(encrypted);
	}
	
	public String decryptAES(String enctext, String aes_key) throws Exception {

	    byte[] encoded = Base64.getDecoder().decode(enctext);
	    
	    byte[] encodedKey = Base64.getDecoder().decode(aes_key);
	    
	    SecretKey originalKey = new SecretKeySpec(encodedKey, 0, encodedKey.length, "AES");
	    Cipher aesCipher = Cipher.getInstance("AES");
	    aesCipher.init(Cipher.DECRYPT_MODE, originalKey);
        return new String(aesCipher.doFinal(encoded), "UTF-8");
	}
	

}
