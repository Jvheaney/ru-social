package ca.rumine.backend.RU.Mine.manager;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.vladmihalcea.hibernate.type.json.JsonNodeBinaryType;

import ca.rumine.backend.RU.Mine.RuMineApplication;
import ca.rumine.backend.RU.Mine.model.UserProfile;
import ca.rumine.backend.RU.Mine.repository.SwipeRepository;

@Service
public class TimelineManager {
	
	@Autowired
	private EntityManager em;
		
	public String getTimeline(String userid, Integer offset) {
		System.out.println(offset);
		if(offset < 0) {
			offset = 0;
		}
		//First get info about User
		Query q = em.createNativeQuery("SELECT interested_male, interested_female, interested_nb, interested_trans, interested_other, gender, start_age, end_age, reshow_profiles FROM profiles WHERE userid=:userid");
		q.setParameter("userid", userid);
		Object[] up = (Object[]) q.getSingleResult();
		
		//Setting our data
		Boolean interested_male = (Boolean) up[0];
		Boolean interested_female = (Boolean) up[1];
		Boolean interested_nb = (Boolean) up[2];
		Boolean interested_trans = (Boolean) up[3];
		Boolean interested_other = (Boolean) up[4];
		Integer gender = (Integer) up[5];
		Integer start_age = (Integer) up[6];
		Integer end_age = (Integer) up[7];
		Boolean reshow_profiles = (Boolean) up[8];
		
		//Begin created our query
		String query = "SELECT row_to_json(t) as json_content from (SELECT p.userid, p.firstname_display, p.birthdate, p.program, p.year, p.gender, p.bio, p.pronouns, p.lookingfor, p.image0, p.image1, p.image2, p.image3, p.badges, p.interests, p.top_5_spotify, (p.last_seen>now() - interval '24 hours') as recently_online FROM profiles p WHERE ";
		String query_f = "SELECT userid FROM profiles WHERE ";
		//Checking for users who are into this user's gender
		if(gender == 0) {
			//Male
			query += "interested_male='t' AND ";
			query_f += "interested_male='t' AND ";
		}
		else if(gender == 1) {
			//Female
			query += "interested_female='t' AND ";
			query_f += "interested_female='t' AND ";
		}
		else if (gender == 2) {
			//Non-Binary
			query += "interested_nb='t' AND ";
			query_f += "interested_nb='t' AND ";
		}
		else if(gender == 3 || gender == 4 || gender == 5) {
			//Transgender
			query += "interested_trans='t' AND ";
			query_f += "interested_trans='t' AND ";
		}
		else if(gender == 6) {
			//Other
			query += "interested_other='t' AND ";
			query_f += "interested_other='t' AND ";
		}
		//Now getting users who's gender are interests of this user
		String genderQueryPart = "(";
		if(interested_male) {
			genderQueryPart += "gender=0";
		}
		if(interested_female) {
			if(genderQueryPart != "(") {
				genderQueryPart += " OR ";
			}
			genderQueryPart += "gender=1";
		}
		if(interested_nb) {
			if(genderQueryPart != "(") {
				genderQueryPart += " OR ";
			}
			genderQueryPart += "gender=2";
		}
		if(interested_trans) {
			if(genderQueryPart != "(") {
				genderQueryPart += " OR ";
			}
			genderQueryPart += "gender=3 OR gender=4 OR gender=5";
		}
		if(interested_other) {
			if(genderQueryPart != "(") {
				genderQueryPart += " OR ";
			}
			genderQueryPart += "gender=6";
		}
		genderQueryPart += ")";
		
		String ageQueryPart = "";
		if(start_age != null && end_age != null) {
			ageQueryPart = " AND (";
			ageQueryPart += "EXTRACT(YEAR FROM age(now(), TO_TIMESTAMP(birthdate,'YYYY-MM-DD'))) >= :start_age";
			if(end_age != 40) {
				ageQueryPart += " AND EXTRACT(YEAR FROM age(now(), TO_TIMESTAMP(birthdate,'YYYY-MM-DD'))) <= :end_age";	
			}
			ageQueryPart += ")";
		}
		//Constructing final Query
		query += genderQueryPart + ageQueryPart + " AND p.userid != :userid AND p.show_me='t' AND NOT EXISTS (SELECT swipeid FROM swipe_history sw WHERE sw.swipeid = p.userid AND sw.userid = :userid)";
		query += " AND p.userid NOT IN (SELECT blockedid FROM blocked_users bu WHERE bu.userid = :userid) ORDER BY p.last_seen, p.edited DESC LIMIT 20 OFFSET :offset) t";
		
		System.out.println(query);
		
		Query q2 = em.createNativeQuery(query);
		q2.setParameter("userid", userid);
		if(start_age != null && end_age != null) {
			q2.setParameter("start_age", start_age);
			if(end_age != 40) {
				q2.setParameter("end_age", end_age);
			}
		}
		q2.setParameter("offset", offset);
		
		List<UserProfile> timeline = q2.unwrap(org.hibernate.query.NativeQuery.class).addScalar("json_content", JsonNodeBinaryType.INSTANCE).getResultList();
		
		String valuesToReturn = "[]";
				
				
		if(timeline.size() > 0) {
			valuesToReturn = "[";
			for(int i = 0; i<timeline.size(); i++) {
				valuesToReturn += timeline.get(i);
				if(i != timeline.size()-1) {
					valuesToReturn += ",";
				}
			}
			valuesToReturn += "]";
		}
		else if(reshow_profiles == null || reshow_profiles) {
			query_f += genderQueryPart + ageQueryPart + " AND userid != :userid AND sw.swipeid=userid) AND sw.swipeid NOT IN (SELECT blockedid FROM blocked_users bu WHERE bu.userid = :userid) ORDER BY p.last_seen DESC, sw.time ASC LIMIT 20 OFFSET :offset) t";
	        query_f = "SELECT row_to_json(t) as json_content from ( SELECT p.userid, p.firstname_display, p.birthdate, p.program, p.year, p.gender, p.bio, p.pronouns, p.lookingfor, p.image0, p.image1, p.image2, p.image3, p.badges, p.interests, p.top_5_spotify, (p.last_seen>now() - interval '24 hours') as recently_online FROM profiles p INNER JOIN swipe_history sw on p.userid = sw.swipeid WHERE p.show_me='t' AND sw.userid = :userid AND sw.liked='f' AND sw.time + INTERVAL '1 DAY' < NOW() AND EXISTS (" + query_f;
	        System.out.println(query_f);
	        Query q3 = em.createNativeQuery(query_f);
			q3.setParameter("userid", userid);
			if(start_age != null && end_age != null) {
				q3.setParameter("start_age", start_age);
				if(end_age != 40) {
					q3.setParameter("end_age", end_age);
				}
			}
			q3.setParameter("offset", offset);
			List<UserProfile> timeline_f = q3.unwrap(org.hibernate.query.NativeQuery.class).addScalar("json_content", JsonNodeBinaryType.INSTANCE).getResultList();
			valuesToReturn = "[";
			for(int i = 0; i<timeline_f.size(); i++) {
				valuesToReturn += timeline_f.get(i);
				if(i != timeline_f.size()-1) {
					valuesToReturn += ",";
				}
			}
			valuesToReturn += "]";
		}
		return valuesToReturn;
	}
}
