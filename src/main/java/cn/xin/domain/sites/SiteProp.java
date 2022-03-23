package cn.xin.domain.sites;

import org.springframework.stereotype.Repository;

import java.util.Date;

/**
 * 存放场地属性的类
 */
@Repository("siteProp")
public class SiteProp {

    /**
     * 唯一id
     */
    private int id;

    /**
     * 场地拥有者名称
     */
    private String siteName;

    private String siteDescription;

    private String siteOwner;

    /**
     * 地形id
     */
    private int demId;

    private int imgId;

    private int soilId;

    /**
     * 最新修改日期
     */
    private Date siteDate;

    /**
     * 边界采样点
     */
    private String boundingName;


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public String getSiteDescription() {
        return siteDescription;
    }

    public void setSiteDescription(String siteDescription) {
        this.siteDescription = siteDescription;
    }

    public String getSiteOwner() {
        return siteOwner;
    }

    public void setSiteOwner(String siteOwner) {
        this.siteOwner = siteOwner;
    }

    public int getDemId() {
        return demId;
    }

    public void setDemId(int demId) {
        this.demId = demId;
    }

    public int getImgId() {
        return imgId;
    }

    public void setImgId(int imgId) {
        this.imgId = imgId;
    }

    public int getSoilId() {
        return soilId;
    }

    public void setSoilId(int soilId) {
        this.soilId = soilId;
    }

    public Date getSiteDate() {
        return siteDate;
    }

    public void setSiteDate(Date siteDate) {
        this.siteDate = siteDate;
    }

    public String getBoundingName() {
        return boundingName;
    }

    public void setBoundingName(String boundingName) {
        this.boundingName = boundingName;
    }

    @Override
    public String toString() {
        return "SiteProp{" +
                "id=" + id +
                ", siteName='" + siteName + '\'' +
                ", siteDescription='" + siteDescription + '\'' +
                ", siteOwner='" + siteOwner + '\'' +
                ", demId=" + demId +
                ", imgId=" + imgId +
                ", soilId=" + soilId +
                ", siteDate=" + siteDate +
                ", boundingName='" + boundingName + '\'' +
                '}';
    }
}
