package ca.rumine.backend.RU.Mine;
import java.time.Instant;

import java.util.Date;
import java.util.Random;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;

import ca.rumine.backend.RU.Mine.model.User;
import ca.rumine.backend.RU.Mine.model.Token;
import ca.rumine.backend.RU.Mine.repository.UserRepository;
import ca.rumine.backend.RU.Mine.repository.TokenRepository;
import ca.rumine.backend.RU.Mine.repository.GroupMembershipRepository;
import ca.rumine.backend.RU.Mine.repository.MatchRepository;


@Service
public class TokenManager {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TokenRepository tokenRepository;

	@Autowired
	private MatchRepository matchRepository;

	@Autowired
	private GroupMembershipRepository gmr;

    private Algorithm algorithm = Algorithm.HMAC256("");

	private int MINUTES_TO_EXPIRY = 30;

	public String[] isAccountCreated(String email) {
		String[] ret = new String[2];
		User user = userRepository.findByEmail(email);
		if(user == null) {
			ret[0] = "dne";
			return ret;
		}
		else if(user.getProfileMade()) {
			ret[0] = "profilemade";
			ret[1] = user.getUserid();
			return ret;
		}
		else {
			ret[0] = "noprofile";
			ret[1] = user.getUserid();
			return ret;
		}
	}

	public String createAccount(String email, String fname, String lname, String ip) {
		User user = new User();
		user.setUserid(getSaltString(21) + "-" + Instant.now().getEpochSecond());
		user.setEmail(email);
		user.setFirstname(fname);
		user.setLastname(lname);
		user.setDeleted(false);
		user.setRegistered(new Date());
		user.setIPAddressRegistered(ip);
		user.setProfileMade(false);
		user.setAllowLocationTracking(false);
		user.setAllowNotifications(false);
		User resp = userRepository.save(user);
		return generateTokenPair(resp.getUserid(),ip);
	}

	public String generateTokenPair(String userid, String ip) {
		String reference = getSaltString(32);
		Date now = new Date();
		Date exp = new Date();
		Date exp_jwt = new Date();
		String token;
		exp.setTime(exp.getTime() + 18*1000*60*60*24);
		exp_jwt.setTime(exp_jwt.getTime() + MINUTES_TO_EXPIRY*1000*60);
		try {
		    token = JWT.create()
		    	.withClaim("ref", reference)
		    	.withClaim("uid", userid)
		    	.withExpiresAt(exp_jwt)
		    	.withIssuedAt(now)
		        .withIssuer("RUMINE")
		        .withAudience("rumine-app")
		        .sign(algorithm);
		} catch (JWTCreationException exception){
		    return "jwterror";
		}
		Token refreshToken = new Token();
		refreshToken.setReference(reference);
		refreshToken.setUserid(userid);
		refreshToken.setIssued(now);
		refreshToken.setExpiry(exp);
		refreshToken.setAudience("rumine-app");
		refreshToken.setBlacklist(false);
		refreshToken.setIp_address(ip);
		tokenRepository.blackListAllTokens(userid);
		Token resp = tokenRepository.save(refreshToken);
		return token;
	}

	public String refreshTokenPair(String userid, String ref, String ip) {
		Date now = new Date();
		Token old_token = tokenRepository.getExpiryTime(ref, new Date(now.getTime() - 5000));
		if(old_token == null) {
			return "logout";
		}
		else if(old_token.getBlacklisted_at() != null) {
			return "NA";
		}
		else if(now.before(old_token.getExpiry())) {
			String reference = getSaltString(32);
			Date exp = new Date();
			Date exp_jwt = new Date();
			String token;
			exp.setTime(exp.getTime() + 18*1000*60*60*24);
			exp_jwt.setTime(exp_jwt.getTime() + MINUTES_TO_EXPIRY*1000*60);
			try {
			    token = JWT.create()
			    	.withClaim("ref", reference)
			    	.withClaim("uid", userid)
			    	.withExpiresAt(exp_jwt)
			    	.withIssuedAt(now)
			        .withIssuer("RUMINE")
			        .withAudience("rumine-app")
			        .sign(algorithm);
			} catch (JWTCreationException exception){
			    return "jwterror";
			}
			Token refreshToken = new Token();
			refreshToken.setReference(reference);
			refreshToken.setUserid(userid);
			refreshToken.setIssued(now);
			refreshToken.setExpiry(exp);
			refreshToken.setAudience("rumine-app");
			refreshToken.setBlacklist(false);
			refreshToken.setIp_address(ip);
			tokenRepository.blackListAllTokens(userid);
			Token resp = tokenRepository.save(refreshToken);
			return token;
		}
		else {
			return "logout";
		}
	}

	public String[] checkToken(String token, String ip) {
		Date now = new Date();
		String[] ret = new String[2];
		try {
		    DecodedJWT jwt = JWT.decode(token);
		    if(now.after(jwt.getExpiresAt())) {
		    	//try to refresh the token
		    	String result = refreshTokenPair(jwt.getClaim("uid").asString(), jwt.getClaim("ref").asString(), ip);
		    	if(result == "logout") {
		    		ret[0] = "logout";
		    		ret[1] = "logout";
		    		return ret;
		    	}
		    	else {
		    		ret[0] = result;
		    		ret[1] = jwt.getClaim("uid").asString();
		    		return ret;
		    	}
		    }
		    else {
	    		ret[0] = "NA";
	    		ret[1] = jwt.getClaim("uid").asString();
		    	return ret;
		    }
		} catch (JWTDecodeException exception){
    		ret[0] = "logout";
    		ret[1] = "logout";
    		return ret;
		}
	}

	public Boolean checkTokenIntercept(String token, String matchid) {
		Date now = new Date();
		Boolean ret = false;
		try {
		    DecodedJWT jwt = JWT.decode(token);
		    if(now.after(new Date(jwt.getExpiresAt().getTime() + MINUTES_TO_EXPIRY*1000*60))) {
		    	return false;
		    }
		    else {
	    		ret = matchRepository.canAccessMatchConvo(jwt.getClaim("uid").asString(), matchid);
		    	return ret;
		    }
		} catch (JWTDecodeException exception){
    		return false;
		}
	}

	public Boolean checkTokenInterceptForGroups(String token, String groupid) {
		Date now = new Date();
		Boolean ret = false;
		try {
		    DecodedJWT jwt = JWT.decode(token);
		    if(now.after(new Date(jwt.getExpiresAt().getTime() + MINUTES_TO_EXPIRY*1000*60))) {
		    	return false;
		    }
		    else {
	    		ret = gmr.canAccessGroupChat(jwt.getClaim("uid").asString(), groupid);
		    	return ret;
		    }
		} catch (JWTDecodeException exception){
    		return false;
		}
	}

	public Boolean checkJustTokenIntercept(String token) {
		Date now = new Date();
		try {
		    DecodedJWT jwt = JWT.decode(token);
		    if(now.after(new Date(jwt.getExpiresAt().getTime() + 30*1000*60))) {
		    	return false;
		    }
		    else {
		    	return true;
		    }
		} catch (JWTDecodeException exception){
    		return false;
		}
	}

	public String getUserId(String token) {
		String ret = "";
		try {
		    DecodedJWT jwt = JWT.decode(token);
	    	ret = jwt.getClaim("uid").asString();
		    return ret;
		} catch (JWTDecodeException exception){
    		return "logout";
		}
	}

	public String generateUserId(int length) {
		return getSaltString(length);
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
