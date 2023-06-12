package pt.uc.dei.paj.DTO;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement
public class NewsDTO implements Serializable{
	private static final long serialVersionUID = 1L;
	public int idNews;
	private Date updateDate;
	private Date creationDate;
	private String title;
	private String description;
	private String coverImage;
	private boolean deleted;
	private Visibility visibility;
	public enum Visibility { membersOnly, everyone , invisible }
	private String keywordsNews;
	//private User userOwnerNews;
	private String userOwnerusername;
	private Collection<String> coautorUsernameNewsList;
	
	public NewsDTO() {
		super();
		this.coautorUsernameNewsList = new ArrayList<String>(10);
	}
	public int getIdNews() {
		return idNews;
	}
	public void setIdNews(int idNews) {
		this.idNews = idNews;
	}
	public Date getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getCoverImage() {
		return coverImage;
	}
	public void setCoverImage(String coverImage) {
		this.coverImage = coverImage;
	}
	public boolean isDeleted() {
		return deleted;
	}
	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}
	public Visibility getVisibility() {
		return visibility;
	}
	public void setVisibility(Visibility visibility) {
		this.visibility = visibility;
	}
	public String getKeywordsNews() {
		return keywordsNews;
	}
	public void setKeywordsNews(String keywordsNews) {
		this.keywordsNews = keywordsNews;
	}
	/*public User getUserOwnerNews() {
		return userOwnerNews;
	}
	public void setUserOwnerNews(User userOwnerNews) {
		this.userOwnerNews = userOwnerNews;
	}*/

	public void setCoautorNewsList(Collection<String> coautorUsernameNewsList) {
		this.coautorUsernameNewsList = coautorUsernameNewsList;
	}
	public Collection<String> getCoautorUsernameNewsList() {
		return coautorUsernameNewsList;
	}
	public void setCoautorUsernameNewsList(Collection<String> coautorUsernameNewsList) {
		this.coautorUsernameNewsList = coautorUsernameNewsList;
	}
	public String getUserOwnerusername() {
		return userOwnerusername;
	}
	public void setUserOwnerusername(String userOwnerusername) {
		this.userOwnerusername = userOwnerusername;
	}
	public Date getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}
	
	
}
