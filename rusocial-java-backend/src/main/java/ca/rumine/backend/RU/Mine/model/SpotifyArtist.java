package ca.rumine.backend.RU.Mine.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "spotify_artists")
public class SpotifyArtist {
	private String artist_name;
	private String artist_id;
	private String artist_image;
	
	public SpotifyArtist() {
		
	}
	
	public SpotifyArtist(String artist_name, String artist_id, String artist_image) {
		this.artist_name = artist_name;
		this.artist_id = artist_id;
		this.artist_image = artist_image;
	}
	
	@Column(name = "artist_name", nullable = false)
	public String getArtist_name() {
		return artist_name;
	}

	public void setArtist_name(String artist_name) {
		this.artist_name = artist_name;
	}

	@Id
	@Column(name = "artist_id", nullable = false)
	public String getArtist_id() {
		return artist_id;
	}

	public void setArtist_id(String artist_id) {
		this.artist_id = artist_id;
	}
	
	@Column(name = "artist_image", nullable = false)
	public String getArtist_image() {
		return artist_image;
	}

	public void setArtist_image(String artist_image) {
		this.artist_image = artist_image;
	}
	
	

}
