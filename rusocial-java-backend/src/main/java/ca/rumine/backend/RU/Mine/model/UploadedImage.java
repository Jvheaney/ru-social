package ca.rumine.backend.RU.Mine.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "images")
public class UploadedImage {
	@Transient String token;
	private String imgid;
	private String userid;
	private Integer imgnum;
	private String data;
	private Date uploaded;
	private Boolean deleted;
	private String fileType;
	private Integer type;
	private Boolean compressed;
	
	public UploadedImage() {
		
	}
	
	public UploadedImage(String token, String imgid, String userid, Integer imgnum, String data, Date uploaded,
			Boolean deleted, String fileType, Integer type, Boolean compressed) {
		this.token = token;
		this.imgid = imgid;
		this.userid = userid;
		this.imgnum = imgnum;
		this.data = data;
		this.uploaded = uploaded;
		this.deleted = deleted;
		this.fileType = fileType;
		this.type = type;
		this.compressed = compressed;
	}

	@Transient
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	
	@Id
	@Column(name = "imgid", nullable = false)
	public String getImgid() {
		return imgid;
	}
	public void setImgid(String imgid) {
		this.imgid = imgid;
	}
	
	@Column(name = "userid", nullable = false)
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	
	@Column(name = "imgnum", nullable = false)
	public Integer getImgnum() {
		return imgnum;
	}
	public void setImgnum(Integer imgnum) {
		this.imgnum = imgnum;
	}

	@Column(name = "data", nullable = false)
	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	@Column(name = "uploaded", nullable = false)
	public Date getUploaded() {
		return uploaded;
	}
	public void setUploaded(Date uploaded) {
		this.uploaded = uploaded;
	}

	@Column(name = "deleted", nullable = false)
	public Boolean getDeleted() {
		return deleted;
	}
	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}
	
	@Column(name = "file_type", nullable = true)
	public String getFileType() {
		return fileType;
	}
	public void setFileType(String fileType) {
		this.fileType = fileType;
	}
	
	@Column(name = "type", nullable = true)
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	
	@Column(name = "compressed", nullable = true)
	public Boolean getCompressed() {
		return compressed;
	}
	public void setCompressed(Boolean compressed) {
		this.compressed = compressed;
	}
	
	public String toJson() {
		String stringToReturn = "{";
		stringToReturn += "'data':'data:image/png;base64," + this.data + "'";
		stringToReturn += "}";
		return stringToReturn;
	}
	
	
}
