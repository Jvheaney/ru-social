package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "programs")
public class Program {
	@Transient String token;
	private String program_name;
	private Integer program_id;
	
	public Program() {
		
	}
	
	public Program(String token, String program_name, Integer program_id) {
		this.token = token;
		this.program_name = program_name;
		this.program_id = program_id;
	}
	
	@Transient
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	
	@Id
	@Column(name = "program_id", nullable = false)
	public Integer getProgram_id() {
		return this.program_id;
	}
	public void setProgram_id(Integer program_id) {
		this.program_id = program_id;
	}
	
	@Column(name = "program_name", nullable = false)
	public String getProgram_name() {
		return this.program_name;
	}
	public void setProgram_name(String program_name) {
		this.program_name = program_name;
	}
	
	public String toJson() {
		String stringToReturn = "{";
		stringToReturn += "\"label\":\"" + this.program_name + "\",\"value\":\"" + this.program_name + "\"}";
		return stringToReturn;
	}
	
	
}
