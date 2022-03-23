package cn.xin.utils.threadUtil;

import cn.xin.utils.siteUtil.MinioUtil;

//文件删除线程任务类
public class FileDeleteTask implements Runnable{
    private MinioUtil minioUtil;
    private String bucketName;
    private String objectName;

    public FileDeleteTask(MinioUtil minioUtil, String bucketName, String objectName) {
        this.minioUtil = minioUtil;
        this.bucketName = bucketName;
        this.objectName = objectName;
    }

    @Override
    public void run() {
        try {
            minioUtil.removeObject(bucketName,objectName);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
