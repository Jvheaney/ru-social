package ca.rumine.backend.RU.Mine.model;

public class Top5Spotify {
	private String artist_1;
	private String artist_2;
	private String artist_3;
	private String artist_4;
	private String artist_5;
	
	public Top5Spotify() {
		
	}
	
	public Top5Spotify(String artist_1, String artist_2, String artist_3, String artist_4, String artist_5) {
		this.artist_1 = artist_1;
		this.artist_2 = artist_2;
		this.artist_3 = artist_3;
		this.artist_4 = artist_4;
		this.artist_5 = artist_5;
	}

	public String getArtist_1() {
		return artist_1;
	}

	public void setArtist_1(String artist_1) {
		this.artist_1 = artist_1;
	}

	public String getArtist_2() {
		return artist_2;
	}

	public void setArtist_2(String artist_2) {
		this.artist_2 = artist_2;
	}

	public String getArtist_3() {
		return artist_3;
	}

	public void setArtist_3(String artist_3) {
		this.artist_3 = artist_3;
	}

	public String getArtist_4() {
		return artist_4;
	}

	public void setArtist_4(String artist_4) {
		this.artist_4 = artist_4;
	}

	public String getArtist_5() {
		return artist_5;
	}

	public void setArtist_5(String artist_5) {
		this.artist_5 = artist_5;
	}
	
	

}
