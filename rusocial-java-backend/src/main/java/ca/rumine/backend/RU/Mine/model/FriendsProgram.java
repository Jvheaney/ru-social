package ca.rumine.backend.RU.Mine.model;

import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Property;

@NodeEntity
public class FriendsProgram {
	
	public FriendsProgram() {
		
	}
	
	@Id @GeneratedValue
	private Long id;
	
	@Property("program_name")
	public String program_name;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getProgram_name() {
		return program_name;
	}

	public void setProgram_name(String program_name) {
		this.program_name = program_name;
	}
	
	

}
