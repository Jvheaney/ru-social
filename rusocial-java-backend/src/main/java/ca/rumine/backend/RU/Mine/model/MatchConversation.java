package ca.rumine.backend.RU.Mine.model;

public class MatchConversation {
	private String matchid;
	private String userid;
	private String message;
	private Boolean read;
	private String time_sent;
	private String sentby;
	private String data;
	private String name;
	private String type;
	private String group_fname;

	public MatchConversation() {
		
	}
	
	public MatchConversation(String matchid, String userid, String message, Boolean read, String sentby, String data,
			String name) {
		super();
		this.matchid = matchid;
		this.userid = userid;
		this.message = message;
		this.read = read;
		this.sentby = sentby;
		this.data = data;
		this.name = name;
	}
	
	public String getMatchid() {
		return matchid;
	}
	public void setMatchid(String matchid) {
		this.matchid = matchid;
	}
	
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	public Boolean getRead() {
		return read;
	}
	public void setRead(Boolean read) {
		this.read = read;
	}
	
	public String getSentby() {
		return sentby;
	}
	public void setSentby(String sentby) {
		this.sentby = sentby;
	}
	
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	public String getTime_sent() {
		return time_sent;
	}

	public void setTime_sent(String time_sent) {
		this.time_sent = time_sent;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getGroup_fname() {
		return group_fname;
	}

	public void setGroup_fname(String group_fname) {
		this.group_fname = group_fname;
	}
	
	
}
