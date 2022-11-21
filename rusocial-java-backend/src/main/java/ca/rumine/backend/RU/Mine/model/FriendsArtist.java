package ca.rumine.backend.RU.Mine.model;

import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Property;

@NodeEntity
public class FriendsArtist {
	
	public FriendsArtist() {
		
	}
	
	@Id @GeneratedValue
	private Long id;
	
	@Property("artist_id")
	public String artist_id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getArtist_id() {
		return artist_id;
	}

	public void setArtist_id(String artist_id) {
		this.artist_id = artist_id;
	}
}
