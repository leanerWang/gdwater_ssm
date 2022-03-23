package cn.xin.domain.sites;

import org.springframework.stereotype.Repository;

//接收影像和地形的URL和名称
//便于cesium读取加载
@Repository("fileProp")
public class FileProp {

    private String imgName;

    private String imgUrl;

    private String demName;

    private String demUrl;

    public String getImgName() {
        return imgName;
    }

    public void setImgName(String imgName) {
        this.imgName = imgName;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public String getDemName() {
        return demName;
    }

    public void setDemName(String demName) {
        this.demName = demName;
    }

    public String getDemUrl() {
        return demUrl;
    }

    public void setDemUrl(String demUrl) {
        this.demUrl = demUrl;
    }

    @Override
    public String toString() {
        return "FileProp{" +
                "imgName='" + imgName + '\'' +
                ", imgUrl='" + imgUrl + '\'' +
                ", demName='" + demName + '\'' +
                ", demUrl='" + demUrl + '\'' +
                '}';
    }
}
