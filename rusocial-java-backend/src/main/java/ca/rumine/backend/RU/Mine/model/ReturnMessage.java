package ca.rumine.backend.RU.Mine.model;


public class ReturnMessage {

	private String status;
	private String data;
	private String reason;
	private String token;
	
	public ReturnMessage() {
		
	}
	
	public ReturnMessage(String status, String data, String reason, String token) {
		this.status = status;
		this.data = data;
		this.reason = reason;
		this.token = token;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}
	
	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
	
}

