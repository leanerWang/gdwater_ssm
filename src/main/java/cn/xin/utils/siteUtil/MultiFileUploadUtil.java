package cn.xin.utils.siteUtil;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 暂时弃用2021/4/28
 *  多文件上传工具类
 */
public class MultiFileUploadUtil {

    private List<MultipartFile> files;
    private String username;
    private int threadNum;
    private MinioUtil minioUtil;

    public MultiFileUploadUtil(List<MultipartFile> files, String username, int threadNum, MinioUtil minioUtil) {
        this.files = files;
        this.username = username;
        this.threadNum = threadNum;
        this.minioUtil = minioUtil;
    }

    //开启线程 传输文件
    public void start(){
        int oneLen =  files.size()/threadNum;
        for (int i = 0; i < threadNum; i++) {
            List<MultipartFile> subFiles;
            if (i == threadNum -1){
                subFiles = files.subList(i * oneLen, files.size());
            }else {
                subFiles = files.subList(i * oneLen, (1 + i) * oneLen);
            }

            FileRunnable runnable = new FileRunnable("Thread" + i, null, subFiles, username, minioUtil);
            runnable.start();
        }
    }

}
