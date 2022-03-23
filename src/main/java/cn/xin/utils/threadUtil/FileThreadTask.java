package cn.xin.utils.threadUtil;

import cn.xin.utils.siteUtil.MinioUtil;

import java.io.InputStream;

/**
 * 文件上传线程类
 */
public class FileThreadTask implements Runnable{
    private MinioUtil minioUtil; //上传工具类
    private InputStream io;
    private String contentType;
    private String username;
    private String originalFilename;

    public FileThreadTask(MinioUtil minioUtil, InputStream io, String contentType, String username, String originalFilename) {
        this.minioUtil = minioUtil;
        this.io = io;
        this.contentType = contentType;
        this.username = username;
        this.originalFilename = originalFilename;
    }

    @Override
    public void run() {
        try {
            minioUtil.uploadFileBySteam(io,contentType,username,originalFilename);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
