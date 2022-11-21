package ca.rumine.backend.RU.Mine.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "match_enc_keys")
public class MatchEncKeys {
	private String matchid;
	private String aes_key;
	
	public MatchEncKeys() {
		
	}
	
	
	public MatchEncKeys(String matchid, String aes_key) {
		this.matchid = matchid;
		this.aes_key = aes_key;
	}


	@Id
	@Column(name = "matchid", nullable = false)
	public String getMatchid() {
		return matchid;
	}
	public void setMatchid(String matchid) {
		this.matchid = matchid;
	}
	
	@Column(name = "aes_key", nullable = false)
	public String getAes_key() {
		return aes_key;
	}
	public void setAes_key(String aes_key) {
		this.aes_key = aes_key;
	}
	
	
}
