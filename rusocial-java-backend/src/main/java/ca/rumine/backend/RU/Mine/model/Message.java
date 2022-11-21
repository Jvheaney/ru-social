package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.Formula;

@Entity
@Table(name = "messages")
public class Message {
	@Transient String token;
	private String matchid;
	private String senderid;
	private String msg;
	private Date time_sent;
	private Date time_read;
	private Integer message_id;
	private String react;
	private String name;
	private String avatar;
	@Transient private Integer type;
	@Transient private String guid;
	
	public Message() {
		
	}
	
	
	public Message(String token, String matchid, String senderid, String msg, Date time_sent, Date time_read, Integer message_id, String react, String guid, Integer type, String name, String avatar) {
		this.token = token;
		this.matchid = matchid;
		this.senderid = senderid;
		this.msg = msg;
		this.time_sent = time_sent;
		this.time_read = time_read;
		this.message_id = message_id;
		this.react = react;
		this.guid = guid;
		this.type = type;
		this.name = name;
		this.avatar = avatar;
	}
	
	@Transient
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}

	@Column(name = "matchid", nullable = false)
	public String getMatchid() {
		return matchid;
	}
	public void setMatchid(String matchid) {
		this.matchid = matchid;
	}
	
	@Column(name = "senderid", nullable = false)
	public String getSenderid() {
		return senderid;
	}
	public void setSenderid(String senderid) {
		this.senderid = senderid;
	}
	
	@Column(name = "message", nullable = false)
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	
	@Column(name = "time_sent", nullable = false)
	public Date getTime_sent() {
		return time_sent;
	}
	public void setTime_sent(Date time_sent) {
		this.time_sent = time_sent;
	}
	
	@Column(name = "time_read", nullable = true)
	public Date getTime_read() {
		return time_read;
	}
	public void setTime_read(Date time_read) {
		this.time_read = time_read;
	}
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "message_id", nullable = false)
	public Integer getMessage_id() {
		return message_id;
	}
	public void setMessage_id(Integer message_id) {
		this.message_id = message_id;
	}
	
	@Column(name = "react", nullable = true)
	public String getReact() {
		return react;
	}
	public void setReact(String react) {
		this.react = react;
	}
	
	@Transient
	public String getGuid() {
		return guid;
	}
	public void setGuid(String guid) {
		this.guid = guid;
	}
	
	@Transient
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}

	@Column(name = "name", nullable = true)
	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "avatar", nullable = true)
	public String getAvatar() {
		return avatar;
	}


	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}
	
	
	
	
}
