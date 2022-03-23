package cn.xin.utils.siteUtil;

import io.minio.MinioClient;
import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveInputStream;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * web 压缩解压工具
 */
public class WebCompressUtil {

    private static final int BUFFER_SIZE = 2048;


    public  static List<String> unTar(InputStream in,MinioClient minioClient,String bucketName,String parentDir, String contentType) {
        List<String> fileNames = new ArrayList<String>();
        try {
            TarArchiveInputStream tarIn = new TarArchiveInputStream(in, BUFFER_SIZE);
            while (tarIn.getNextTarEntry() != null) {
                TarArchiveEntry entry = tarIn.getNextTarEntry();
                if (entry.isFile()) {
                    minioClient.putObject(bucketName, parentDir+'/'+entry.getName(), tarIn, entry.getSize(), contentType);
                    fileNames.add(parentDir+entry.getName());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return fileNames;
    }


    public static List<String> unZip(InputStream in,MinioClient minioClient,String bucketName,String parentDir, String contentType) {
        List<String> fileNames = new ArrayList<String>();
        try {
            // 创建客户端
            ZipArchiveInputStream is = new ZipArchiveInputStream(new BufferedInputStream(in, BUFFER_SIZE));
            ZipArchiveEntry entry = null;
            while ((entry = is.getNextZipEntry()) != null) {
                if (!entry.isDirectory()) {
                    try {
                        // 使用putObject上传一个文件到存储桶中。
                        minioClient.putObject(bucketName,parentDir+'/'+entry.getName() , is, entry.getSize(),contentType);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    fileNames.add(parentDir+entry.getName());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileNames;
    }





    /**
     * 解压方法
     *
     * @param file 解压文件
     * @return
     * @throws Exception
     */
    public static List<String> unCompress(MultipartFile file,MinioClient minioClient,String bucketName,String parentDir){
        List<String> ret = new ArrayList<String>();
        try {
            String fileName=file.getOriginalFilename();
            String upperName = fileName.toUpperCase();
            if (upperName.endsWith(".ZIP")) {
                ret = unZip(file.getInputStream(),minioClient,bucketName, parentDir, file.getContentType());
            } else if (upperName.endsWith(".TAR")) {
                ret = unTar(file.getInputStream(),minioClient,bucketName, parentDir, file.getContentType());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return ret;
    }







}