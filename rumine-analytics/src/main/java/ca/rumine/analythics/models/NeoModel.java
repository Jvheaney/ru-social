package ca.rumine.analythics.models;

import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;

@NodeEntity
public class NeoModel {
	
	@Id @GeneratedValue
	private Long id;
}
