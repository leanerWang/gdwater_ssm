package cn.xin.utils.siteUtil;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

/**
 * 暂时弃用2021/4/28
 * 线程
 */
public class FileRunnable implements Runnable{
    private String threadName; //线程名
    private Thread thread; //线程
    private List<MultipartFile> files; //文件列表
    private String username; //上传文件夹名称
    private MinioUtil minioUtil; //上传工具类

    public FileRunnable(String threadName, Thread thread, List<MultipartFile> files, String username, MinioUtil minioUtil) {
        this.threadName = threadName;
        this.thread = thread;
        this.files = files;
        this.username = username;
        this.minioUtil = minioUtil;
    }

    @Override
    public void run() {
        if (files.size() > 0){
            for (int i = 0; i < files.size(); i++) {
                try {
                    MultipartFile file = files.get(i);
                    InputStream in = file.getInputStream();
                    String contentType = file.getContentType();
                    String originalFilename = file.getOriginalFilename();
                    minioUtil.uploadFileBySteam(in,contentType,username,originalFilename);
                    System.out.println(threadName+"上传了"+i+"个文件夹...");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        }
    }

    public void start(){
        if (thread == null){
            thread = new Thread(this, threadName);
            thread.start();
        }
    }

}
