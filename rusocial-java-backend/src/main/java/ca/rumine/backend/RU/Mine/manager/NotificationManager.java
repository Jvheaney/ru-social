package ca.rumine.backend.RU.Mine.manager;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import ca.rumine.backend.RU.Mine.FCMInitializer;
import ca.rumine.backend.RU.Mine.FCMService;
import ca.rumine.backend.RU.Mine.HeaderRequestInterceptor;
import ca.rumine.backend.RU.Mine.model.PushNotificationRequest;
import ca.rumine.backend.RU.Mine.model.HttpNotification;
import ca.rumine.backend.RU.Mine.model.NotificationData;

@Service
public class NotificationManager {

	@Value("#{${app.notifications.defaults}}")
    private Map<String, String> defaults;

    @Autowired
    public FCMService fcmService;

    public void PushNotificationService(FCMService fcmService) {
        this.fcmService = fcmService;
    }

    @Scheduled(initialDelay = 60000, fixedDelay = 60000)
    public void sendSamplePushNotification() {
        try {
            fcmService.sendMessageWithoutData(getSamplePushNotificationRequest());
        } catch (InterruptedException | ExecutionException e) {
        }
    }

    public void sendPushNotification(PushNotificationRequest request) {
        try {
            fcmService.sendMessage(getSamplePayloadData(), request);
        } catch (InterruptedException | ExecutionException e) {
        }
    }

    public void sendPushNotificationWithoutData(PushNotificationRequest request) {
        try {
            fcmService.sendMessageWithoutData(request);
        } catch (InterruptedException | ExecutionException e) {
        }
    }


    public void sendPushNotificationToToken(PushNotificationRequest request) {
        try {
            fcmService.sendMessageToToken(request);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }

    public void sendDataToClient(String token, String type, String[] data) {
    	HttpNotification notif = new HttpNotification();
    	NotificationData notif_data = new NotificationData();
		Gson gson = new Gson();
		notif_data.setType(type);
    	if(type.equals("message")) {
    		notif.setTo(token);
    		notif_data.setName(data[0]);
    		notif.setData(notif_data);
    	}
    	else if(type.equals("match")) {
    		notif.setTo(token);
    		notif.setData(notif_data);
    	}
    	else if(type.equals("announcement")) {
    		notif.setTo(token);
    		notif_data.setTitle(data[0]);
    		notif_data.setSubtitle(data[1]);
    		notif.setData(notif_data);
    	}
    	else if(type.equals("friend-message")) {
    		notif.setTo(token);
    		notif_data.setName(data[0]);
    		notif_data.setSubtitle(data[1]);
    		notif.setData(notif_data);
    	}
    	else if(type.equals("request")) {
    		notif.setTo(token);
    		notif_data.setSubtitle(data[0]);
    		notif.setData(notif_data);
    	}
    	else if(type.equals("friend")) {
    		notif.setTo(token);
    		notif_data.setSubtitle(data[0]);
    		notif.setData(notif_data);
    	}
    	else {
    		notif.setTo(token);
    		notif_data.setName(data[0]);
    		notif_data.setSubtitle(data[1]);
    		notif.setData(notif_data);
    	}
    	URL url;
    	String sendData = gson.toJson(notif);
		try {
			url = new URL("https://fcm.googleapis.com/fcm/send");
	    	HttpURLConnection con = (HttpURLConnection) url.openConnection();
	    	con.setRequestMethod("POST");
	    	con.setDoOutput(true);
	    	con.setRequestProperty("Content-Type", "application/json");
	    	con.setRequestProperty("Authorization", "key=");
	    	con.setConnectTimeout(5000);
	    	DataOutputStream out = new DataOutputStream(con.getOutputStream());
	    	out.writeBytes(sendData);
	    	out.flush();
	    	out.close();
	    	int status = con.getResponseCode();
	    	if (status > 299) {
	    	} else {
	    	}
	    	con.disconnect();


		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

    }


    private Map<String, String> getSamplePayloadData() {
        Map<String, String> pushData = new HashMap<>();
        pushData.put("messageId", defaults.get("payloadMessageId"));
        pushData.put("text", defaults.get("payloadData") + " " + LocalDateTime.now());
        return pushData;
    }


    private PushNotificationRequest getSamplePushNotificationRequest() {
        PushNotificationRequest request = new PushNotificationRequest(defaults.get("title"),
                defaults.get("message"),
                defaults.get("topic"));
        return request;
    }
}
