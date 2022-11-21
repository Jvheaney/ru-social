package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "refresh_tokens")
public class Token {
	private String reference;
	private String userid;
	private Date issued;
	private Date expiry;
	private String audience;
	private Boolean blacklist;
	private String ip_address;
	private Date blacklisted_at;
	
	public Token() {
		
	}
	
	
	public Token(String reference, String userid, Date issued, Date expiry, String audience, Boolean blacklist, String ip_address, Date blacklisted_at) {
		this.reference = reference;
		this.userid = userid;
		this.issued = issued;
		this.expiry = expiry;
		this.audience = audience;
		this.blacklist = blacklist;
		this.ip_address = ip_address;
		this.blacklisted_at = blacklisted_at;
	}



	@Id
	@Column(name = "reference", nullable = false)
	public String getReference() {
		return reference;
	}
	public void setReference(String reference) {
		this.reference = reference;
	}
	
	@Column(name = "userid", nullable = false)
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	
	@Column(name = "issued", nullable = false)
	public Date getIssued() {
		return issued;
	}
	public void setIssued(Date issued) {
		this.issued = issued;
	}
	
	@Column(name = "expiry", nullable = false)
	public Date getExpiry() {
		return expiry;
	}
	public void setExpiry(Date expiry) {
		this.expiry = expiry;
	}
	
	@Column(name = "audience", nullable = false)
	public String getAudience() {
		return audience;
	}
	public void setAudience(String audience) {
		this.audience = audience;
	}
	
	@Column(name = "blacklist", nullable = false)
	public Boolean getBlacklist() {
		return blacklist;
	}
	public void setBlacklist(Boolean blacklist) {
		this.blacklist = blacklist;
	}
	
	@Column(name = "ip_address", nullable = false)
	public String getIp_address() {
		return ip_address;
	}
	public void setIp_address(String ip_address) {
		this.ip_address = ip_address;
	}
	
	@Column(name = "blacklisted_at", nullable = true)
	public Date getBlacklisted_at() {
		return blacklisted_at;
	}
	public void setBlacklisted_at(Date blacklisted_at) {
		this.blacklisted_at = blacklisted_at;
	}
	
	
	
}
