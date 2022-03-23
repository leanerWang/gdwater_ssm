package cn.xin.utils.siteUtil;

import cn.xin.domain.massage.CardMassage;
import cn.xin.domain.sites.SiteProp;
import io.minio.MinioClient;
import io.minio.ObjectStat;
import io.minio.Result;
import io.minio.messages.Bucket;
import io.minio.messages.Item;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.xmlpull.v1.XmlPullParserException;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @Slf4j: 日志输出
 * private final Logger logger = LoggerFactory.getLogger(当前类名.class);
 */
@Component
@Slf4j
public class MinioUtil {
    private final MinioClient client;
    private final SiteProp siteProp;
    private final CardMassage cardMassage;

    public MinioClient getClient(){
        return this.client;
    }


    public MinioUtil(MinioClient client, SiteProp siteProp, CardMassage cardMassage) {
        this.client = client;
        this.siteProp = siteProp;
        this.cardMassage = cardMassage;
    }

    /**
     * 创建bucket
     * @SneakyThrows 向外抛出异常
     * @param bucketName bucket名称
     */
    @SneakyThrows
    public void createBucket(String bucketName) {
        if (!client.bucketExists(bucketName)) {
            client.makeBucket(bucketName);
        }
    }


    /**
     * 获取全部bucket
     */
    @SneakyThrows
    public List<Bucket> getAllBuckets() {
        return client.listBuckets();
    }

    /**
     * 根据bucketName获取信息
     *
     * @param bucketName bucket名称
     */
    @SneakyThrows
    public Optional<Bucket> getBucket(String bucketName) {
        return client.listBuckets().stream().filter(b -> b.name().equals(bucketName)).findFirst();
    }

    /**
     * 根据bucketName删除信息
     *
     * @param bucketName bucket名称
     */
    @SneakyThrows
    public void removeBucket(String bucketName) {
        client.removeBucket(bucketName);
    }

    /**
     * 获取文件外链
     *
     * @param bucketName bucket名称
     * @param objectName 文件名称
     * @param expires    过期时间 <=7
     * @return url
     */
    @SneakyThrows
    public String getObjectURL(String bucketName, String objectName, Integer expires) {
        return client.presignedGetObject(bucketName, objectName, expires);
    }

    /**
     * 获取文件
     *
     * @param bucketName bucket名称
     * @param objectName 文件名称
     * @return 二进制流
     */
    @SneakyThrows
    public InputStream getObject(String bucketName, String objectName) {
        return client.getObject(bucketName, objectName);
    }

    /**
     * 上传文件
     *
     * @param bucketName bucket名称
     * @param objectName 文件名称
     * @param stream     文件流
     * @throws Exception https://docs.minio.io/cn/java-client-api-reference.html#putObject
     */
    public void putObject(String bucketName, String objectName, InputStream stream) throws Exception {
        client.putObject(bucketName, objectName, stream, stream.available(), "application/octet-stream");
    }

    /**
     * 上传文件
     *
     * @param bucketName  bucket名称
     * @param objectName  文件名称
     * @param stream      文件流
     * @param size        大小
     * @param contextType 类型
     * @throws Exception https://docs.minio.io/cn/java-client-api-reference.html#putObject
     */
    public void putObject(String bucketName, String objectName, InputStream stream, long size, String contextType) throws Exception {
        client.putObject(bucketName, objectName, stream, size, contextType);
    }

    /**
     * 获取文件信息
     *
     * @param bucketName bucket名称
     * @param objectName 文件名称
     * @throws Exception https://docs.minio.io/cn/java-client-api-reference.html#statObject
     */
    public ObjectStat getObjectInfo(String bucketName, String objectName) throws Exception {
        return client.statObject(bucketName, objectName);
    }


    public Iterable<Result<Item>> listObjects(String bucketName, String prefix){
        Iterable<Result<Item>> results = null;
        try {
            results = client.listObjects(bucketName, prefix);
        } catch (XmlPullParserException e) {
            e.printStackTrace();
        }
        return results;
    }

    /**
     * 删除文件
     *
     * @param bucketName bucket名称
     * @param objectName 文件名称
     * @throws Exception https://docs.minio.io/cn/java-client-api-reference.html#removeObject
     */
    public void removeObject(String bucketName, String objectName) throws Exception {
        client.removeObject(bucketName, objectName);
    }


    /**
     * 上传文件
     *
     * @param file       文件
     * @param bucketName 存储桶
     *                   folderName 场地名称
     * @return
     */
    public CardMassage uploadFile(MultipartFile file, String bucketName, String newFileName) throws Exception {
        // 判断上传文件是否为空
        if (null == file || 0 == file.getSize()) {
            cardMassage.setCode(1);
            cardMassage.setMassage("上传文件不能为空哦...");
            cardMassage.setLinkAddress("/file/addFile");
            cardMassage.setLinkName("请重新上传呢...");
        }else {
            // 判断存储桶是否存在
            createBucket(bucketName);
            // 开始上传
            client.putObject(bucketName, newFileName, file.getInputStream(), file.getContentType());
        }
        return cardMassage;

    }

    public void uploadFileBySteam(InputStream in,String contentType, String bucketName, String newFileName) throws Exception {

        // 判断存储桶是否存在
        createBucket(bucketName);

        // 开始上传
        client.putObject(bucketName, newFileName, in, contentType);
    }



    /**
     * 获取所有文件信息
     * @param bucketName
     */
    @SneakyThrows
    public List<SiteProp> getAllFiles( String bucketName) {

        List<SiteProp> siteProps = new ArrayList<>();
        if (client.bucketExists(bucketName)) {

            // 列出bucketName里的对象
            Iterable<Result<Item>> myObjects = client.listObjects(bucketName);
            for (Result<Item> result : myObjects) {
                Item item = result.get();
                siteProp.setSiteName(item.objectName());
                siteProp.setSiteDate(item.lastModified());
                siteProps.add(siteProp);
            }
        } else {
            System.out.println("bucketName does not exist");
        }
        return siteProps;
    }

    /**
     * 获取连接
     * @param bucketMame 存储桶
     * @param objectName 文件名
     * @return
     */
    @SneakyThrows
    public String getUrl(String bucketMame, String objectName){
        String objectUrl = client.getObjectUrl(bucketMame, objectName);
        return objectUrl;
    }


}


