package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "users")
public class User {

	private String userid;
	private String email;
	private String firstname;
	private String lastname;
	private Boolean deleted;
	private Date registered;
	private String ip_address_registered;
	private Boolean profile_made;
	private Boolean allow_location_tracking;
	private Boolean allow_notifications;
	
	public User() {
		
	}
	
	public User(String userid, String email, String firstname, String lastname, Boolean deleted, Date registered, String ip_address_registered, Boolean profile_made, Boolean allow_location_tracking, Boolean allow_notifications) {
		this.userid = userid;
		this.email = email;
		this.firstname = firstname;
		this.lastname = lastname;
		this.deleted = deleted;
		this.registered = registered;
		this.ip_address_registered = ip_address_registered;
		this.profile_made = profile_made;
		this.allow_location_tracking = allow_location_tracking;
		this.allow_notifications = allow_notifications;
	}
	
	@Id
	@Column(name = "userid", nullable = false)
    public String getUserid() {
        return userid;
    }
	public void setUserid(String userid) {
        this.userid = userid;
    }
	
	@Column(name = "email", nullable = false)
    public String getEmail() {
        return email;
    }
	public void setEmail(String email) {
        this.email = email;
    }
	
	@Column(name = "firstname", nullable = false)
    public String getFirstname() {
        return firstname;
    }
	public void setFirstname(String firstname) {
        this.firstname = firstname;
    }
	
	@Column(name = "lastname", nullable = false)
    public String getLastname() {
        return lastname;
    }
	public void setLastname(String lastname) {
        this.lastname = lastname;
    }
	
	@Column(name = "deleted", nullable = false)
    public Boolean getDeleted() {
        return deleted;
    }
	public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }
	
	@Column(name = "registered", nullable = false)
    public Date getRegistered() {
        return registered;
    }
	public void setRegistered(Date registered) {
        this.registered = registered;
    }
	
	@Column(name = "ip_address_registered", nullable = false)
    public String getIPAddressRegistered() {
        return ip_address_registered;
    }
	public void setIPAddressRegistered(String ip_address_registered) {
        this.ip_address_registered = ip_address_registered;
    }
	
	@Column(name = "profile_made", nullable = false)
    public Boolean getProfileMade() {
        return profile_made;
    }
	public void setProfileMade(Boolean profile_made) {
        this.profile_made = profile_made;
    }
	
	@Column(name = "allow_location_tracking", nullable = false)
    public Boolean getAllowLocationTracking() {
        return allow_location_tracking;
    }
	public void setAllowLocationTracking(Boolean allow_location_tracking) {
        this.allow_location_tracking = allow_location_tracking;
    }
	
	@Column(name = "allow_notifications", nullable = false)
    public Boolean getAllowNotifications() {
        return allow_notifications;
    }
	public void setAllowNotifications(Boolean allow_notifications) {
        this.allow_notifications = allow_notifications;
    }
	
	@Override
	public String toString() {
		return "USER: [userid=" + userid + ", fname=" + firstname + ", lname=" + lastname +"]";
	}
	
}
