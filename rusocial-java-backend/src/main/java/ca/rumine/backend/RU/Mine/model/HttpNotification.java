package ca.rumine.backend.RU.Mine.model;

public class HttpNotification {
	private String to;
	private Object data;
	
	public HttpNotification() {
		
	}
	
	public HttpNotification(String to, String data) {
		super();
		this.to = to;
		this.data = data;
	}
	
	public String getTo() {
		return to;
	}
	public void setTo(String to) {
		this.to = to;
	}
	
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
	
	
}
