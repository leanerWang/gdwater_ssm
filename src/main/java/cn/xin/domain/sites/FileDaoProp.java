package cn.xin.domain.sites;

import lombok.Data;
import org.springframework.stereotype.Repository;

import java.util.Date;

/**
 * 对应于文件索引数据库IFileDao接口的操作
 */
@Repository("fileDaoProp")
@Data
public class FileDaoProp {

    private int id; //索引
    private String fileName; //文件名
    private String fileObject; //文件数据库中的文件名
    private String fileOwner; //文件拥有者
    private Date fileDate; //文件上传日期
    private String fileUrl; //文件数据库的请求路径
    private String fileDescription; //文件描述
    private String fileType; //文件类型
    private String fileBox; //影像经纬度范围

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileObject() {
        return fileObject;
    }

    public void setFileObject(String fileObject) {
        this.fileObject = fileObject;
    }

    public String getFileOwner() {
        return fileOwner;
    }

    public void setFileOwner(String fileOwner) {
        this.fileOwner = fileOwner;
    }

    public Date getFileDate() {
        return fileDate;
    }

    public void setFileDate(Date fileDate) {
        this.fileDate = fileDate;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getFileDescription() {
        return fileDescription;
    }

    public void setFileDescription(String fileDescription) {
        this.fileDescription = fileDescription;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFileBox() {
        return fileBox;
    }

    public void setFileBox(String fileBox) {
        this.fileBox = fileBox;
    }
}
