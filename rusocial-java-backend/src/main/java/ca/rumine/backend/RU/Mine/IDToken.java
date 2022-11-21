package ca.rumine.backend.RU.Mine;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import ca.rumine.backend.RU.Mine.model.TokenPayload;


public class IDToken {
	private String idToken;

	public IDToken(String idToken) {
		this.idToken = idToken;
	}

	public String getIDToken() {
		return this.idToken;
	}

	public void setIDToken(String idToken) {
		this.idToken = idToken;
	}

	public TokenPayload getUserEmail() {
		HttpTransport transport = new NetHttpTransport();
		JacksonFactory jsonFactory = new JacksonFactory();
		GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
				.setAudience(Collections.singletonList(""))
				.build();
		GoogleIdToken tokenResponse;
		try {
			tokenResponse = verifier.verify(this.idToken);
		} catch (GeneralSecurityException e) {
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
		if(tokenResponse != null) {
			 Payload payload = tokenResponse.getPayload();
			 TokenPayload userPayload = new TokenPayload(payload.getEmail(),(String) payload.get("given_name"), (String) payload.get("family_name"));
			 return userPayload;
		}
		else {
			return null;
		}
	}
}
