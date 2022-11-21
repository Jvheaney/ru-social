package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "locations")
public class Location {
	@Transient String token;
	private String userid;
	private Double longitude;
	private Double latitude;
	private Integer accuracy;
	private Double altitude;
	private Date time;
	private long id;
	
	public Location() {
		
	}
	
	public Location(String token, String userid, Double longitude, Double latitude, Integer accuracy, Double altitude, Date time, long id) {
		this.token = token;
		this.userid = userid;
		this.longitude = longitude;
		this.latitude = latitude;
		this.accuracy = accuracy;
		this.altitude = altitude;
		this.time = time;
		this.id = id;
	}
	
	@Transient
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "uniqid", nullable = false)
    public long getId() {
        return id;
    }
	public void setId(long id) {
		this.id = id;
	}
	
	@Column(name = "userid", nullable = false)
	public String getUserid() {
		return this.userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	
	@Column(name = "longitude", nullable = false)
	public Double getLongitude() {
		return this.longitude;
	}
	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}
	
	@Column(name = "latitude", nullable = false)
	public Double getLatitude() {
		return this.latitude;
	}
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}
	
	@Column(name = "accuracy", nullable = false)
	public Integer getAccuracy() {
		return this.accuracy;
	}
	public void setAccuracy(Integer accuracy) {
		this.accuracy = accuracy;
	}
	
	@Column(name = "altitude", nullable = false)
	public Double getAltitude() {
		return this.altitude;
	}
	public void setAltitude(Double altitude) {
		this.altitude = altitude;
	}
	
	@Column(name = "time", nullable = false)
	public Date getTime() {
		return this.time;
	}
	public void setTime(Date time) {
		this.time = time;
	}
	
	
}
