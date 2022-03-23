package cn.xin.service.sites.impl;

import cn.xin.dao.sites.IFileDao;
import cn.xin.domain.sites.FileDaoProp;
import cn.xin.service.sites.IFileService;
import cn.xin.utils.siteUtil.FileUtil;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service("fileService")
public class FileServiceImpl implements IFileService {

    private FileDaoProp fileDaoProp;
    private final IFileDao fileDao;

    public FileServiceImpl(FileDaoProp fileDaoProp, IFileDao fileDao) {
        this.fileDaoProp = fileDaoProp;
        this.fileDao = fileDao;
    }

    /**
     * 插入，同时判断插入影像还是地形数据库
     */
    @Override
    public void insert(String fileName, String fileObject, String fileOwner, String fileUrl, String fileDescription, String type, String extents) {
        fileDaoProp.setFileName(fileName);
        fileDaoProp.setFileObject(fileObject);
        fileDaoProp.setFileDate(new Date());
        fileDaoProp.setFileDescription(fileDescription);
        fileDaoProp.setFileOwner(fileOwner);
        fileDaoProp.setFileUrl(fileUrl);
        fileDaoProp.setFileType(type);
        fileDaoProp.setFileBox(extents);
        if (Objects.equals(type, "imgFile")){
            fileDao.insertToImg(fileDaoProp);
        }
        if (Objects.equals(type, "demFile")){
            fileDao.insertToDem(fileDaoProp);
        }
        if (Objects.equals(type, "commonFile")){
            fileDao.insertToCommon(fileDaoProp);
        }

    }

    @Override
    public void insertFromProp(FileDaoProp fileDaoProp) {
        String type = fileDaoProp.getFileType();
        if (Objects.equals(type, "imgFile")){
            fileDao.insertToImg(fileDaoProp);
        }
        if (Objects.equals(type, "demFile")){
            fileDao.insertToDem(fileDaoProp);
        }
        if (Objects.equals(type, "commonFile")){
            fileDao.insertToCommon(fileDaoProp);
        }
    }

    @Override
    public List<FileDaoProp> findFiles(String name, String tableType) {
        List<FileDaoProp> files = new ArrayList<>();
        if (Objects.equals(tableType, "imgFile")){
            files = fileDao.findFilesToImg(name);
        }
        if (Objects.equals(tableType, "demFile")){
            files = fileDao.findFilesToDem(name);
        }
        if (Objects.equals(tableType, "commonFile")){
            files = fileDao.findFilesToCommon(name);
        }
        return files;
    }

    @Override
    public List<FileDaoProp> findByUrl(String url, String fileType) {
        String tableName = FileUtil.getTableName(fileType);
        return fileDao.findByUrl(url,tableName);
    }

    @Override
    public FileDaoProp findFileById(int id, String fileType) {
        String tableName = FileUtil.getTableName(fileType);
        if (!"".equals(tableName)){
            return fileDao.findFileById(id, tableName);
        }else {
            return null;
        }

    }

    @Override
    public void updateFile(FileDaoProp fileDaoProp, String fileType) {
        String tableName = FileUtil.getTableName(fileType);
        if (!"".equals(tableName)){
             fileDao.updateFile(fileDaoProp, tableName);
        }
    }

    @Override
    public void delete(int id, String fileType) {
        String tableName = FileUtil.getTableName(fileType);
        if (!"".equals(tableName)){
            fileDao.delete(id, tableName);
        }
    }
}
