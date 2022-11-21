package ca.rumine.backend.RU.Mine.model;

public class NotificationData {
	private String type;
	private String title;
	private String subtitle;
	private String name;
	
	public NotificationData() {
		
	}
	
	public NotificationData(String type, String title, String subtitle, String name) {
		
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getSubtitle() {
		return subtitle;
	}

	public void setSubtitle(String subtitle) {
		this.subtitle = subtitle;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	
}
