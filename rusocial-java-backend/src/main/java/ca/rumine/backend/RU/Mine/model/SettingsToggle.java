package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "users")
public class SettingsToggle {
	@Transient String token;
	private Boolean toggle_value;
	
	public SettingsToggle() {
		
	}
	
	public SettingsToggle(String token, Boolean toggle_value) {
		this.token = token;
		this.toggle_value = toggle_value;
	}
	
	@Transient
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	
	@Id
	@Column(name = "allow_notifications", nullable = false)
	public Boolean getToggle_value() {
		return this.toggle_value;
	}
	public void setToggle_value(Boolean toggle_value) {
		this.toggle_value = toggle_value;
	}
	
	
}
