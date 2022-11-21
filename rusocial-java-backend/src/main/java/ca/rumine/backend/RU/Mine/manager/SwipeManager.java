package ca.rumine.backend.RU.Mine.manager;

import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.time.Instant;

import org.apache.tomcat.jni.Time;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;

import ca.rumine.backend.RU.Mine.RuMineApplication;
import ca.rumine.backend.RU.Mine.kafka.Producer;
import ca.rumine.backend.RU.Mine.kafka.payloads.Notification;
import ca.rumine.backend.RU.Mine.model.UserProfile;
import ca.rumine.backend.RU.Mine.model.Swipe;
import ca.rumine.backend.RU.Mine.model.MatchEncKeys;
import ca.rumine.backend.RU.Mine.model.NotificationToken;
import ca.rumine.backend.RU.Mine.model.PushNotificationRequest;
import ca.rumine.backend.RU.Mine.model.RecentConnection;
import ca.rumine.backend.RU.Mine.model.Match;
import ca.rumine.backend.RU.Mine.repository.SwipeRepository;
import ca.rumine.backend.RU.Mine.repository.MatchEncKeysRepository;
import ca.rumine.backend.RU.Mine.repository.MatchRepository;
import ca.rumine.backend.RU.Mine.repository.NotificationRepository;
import ca.rumine.backend.RU.Mine.repository.RecentConnectionsRepository;
import ca.rumine.backend.RU.Mine.manager.NotificationManager;

@Service
public class SwipeManager {
	
	private Producer producer = new Producer();

    @Autowired
    void KafkaController(Producer producer) {
        this.producer = producer;
    }
	
	@Autowired
	private EntityManager em;
	
	@Autowired
	private SwipeRepository swipeRepository;
	
	@Autowired
	private MatchEncKeysRepository mecRepository;
	
	@Autowired
	private MatchRepository matchRepository;
	
	@Autowired
	private NotificationRepository notificationRepository;
	
	@Autowired
	private RecentConnectionsRepository rcr;
	
	@Autowired
	private NotificationManager notificationManager;
	
	@Transactional
	public void updateSwipeHistory(String swipeid, String userid, Boolean liked) {
		Query q = em.createNativeQuery("UPDATE swipe_history SET liked='f', time='now()' WHERE userid='nigebuWlY1QVVbmw13DNs-1586136482' AND swipeid='ZL3W0yZUlpFSmRElA4Cos-1580872723'");
		q.executeUpdate();
	}
	
	public String checkMatch(Swipe s) {
        Swipe res = swipeRepository.checkMatch(s.getUserid(), s.getSwipeid());
        if(res == null) {
    		String valuesToReturn = "success";
    		return valuesToReturn;
        }
        else {
    		String valuesToReturn = res.getUserid();
    		try {
				this.createMatchRecord(s.getUserid(), s.getSwipeid(), 0);
			} catch (NoSuchAlgorithmException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return "server-error";
			}
    		return valuesToReturn;
        }
	}
	
	public void toggleExistingMatch(String userid, String otherUserid, Boolean toggle_value) {
		matchRepository.toggleExistingMatch(userid, otherUserid, toggle_value);
	}
	
	public String startConversation(String userid, String otherUserid, Integer type) {
		String results_ret = matchRepository.startConversation(userid, otherUserid, type);
		if(results_ret == null || results_ret.equals("") || results_ret.equals("null")) {
			return "server-error";
		}
		else {
			String ret = "{\"matchid\":\"" + results_ret + "\"}";
			return ret;
		}
	}
	
	public void createMatchRecord(String userid, String swipeid, Integer type) throws NoSuchAlgorithmException {
		//1. Create matchid
		//2. Create RSA key pair
		//3. Save to db
		
		//Create matchid
		String matchid = getSaltString(5) + "-" + Instant.now().getEpochSecond();
        
		//Create RSA key pair
		Base64.Encoder encoder = Base64.getEncoder();
		KeyGenerator keyGen = KeyGenerator.getInstance("AES");
	    keyGen.init(256);
	    SecretKey secKey = keyGen.generateKey();
	    String base64Key = encoder.encodeToString(secKey.getEncoded());
        //Save matchid, enc keys
	    try {
	    	if(type == 1) {
	    		int affected = matchRepository.conditionalInsert(matchid, userid, swipeid, type);
	    		if(affected != 1) {
	    			toggleExistingMatch(userid, swipeid, true);
	    			return;
	    		}
	    	}
	    	else {
	    		Match match = new Match(matchid, userid, swipeid, new Date(), true, type);
		        matchRepository.save(match);
	    	}
	        
	        try {
	        	//Save as Recent Connection for both parties
		        RecentConnection rc = new RecentConnection(userid, swipeid, type);
		        RecentConnection rc2 = new RecentConnection(swipeid, userid, type);
		        
		        rcr.save(rc);
		        rcr.save(rc2);
	        }
	        catch(Exception e) {
	        	e.printStackTrace();
	        }
	        
	        MatchEncKeys mec = new MatchEncKeys(matchid, base64Key);
	        mecRepository.save(mec);
	        
	        if(type == 0) {
		        //Send notification
	    		Gson gson = new Gson();
				Notification notif = new Notification();
	    		notif.setType(6);
	    		notif.setRecipient(swipeid);
	    		
	    		this.producer.sendMessage("notifications", gson.toJson(notif));
	        }
	        
	    }
        catch(Exception e) {
        	e.printStackTrace();
        	if(type == 1) {
            	toggleExistingMatch(userid, swipeid, true);
        	}
        }
        
	}
	
	protected String getSaltString(int length) {
        String SALTCHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        StringBuilder salt = new StringBuilder();
        Random rnd = new Random();
        while (salt.length() < length) { // length of the random string.
            int index = (int) (rnd.nextFloat() * SALTCHARS.length());
            salt.append(SALTCHARS.charAt(index));
        }
        String saltStr = salt.toString();
        return saltStr;

    }
}
