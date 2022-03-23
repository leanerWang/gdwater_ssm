package cn.xin.utils.threadUtil;

import cn.xin.domain.sites.FileDaoProp;
import cn.xin.utils.siteUtil.FileUtil;
import cn.xin.utils.siteUtil.MinioUtil;
import io.minio.Result;
import io.minio.messages.Item;
import lombok.Data;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

//删除文件数据库中的文件

@Data
public class FileDelete {

    private FileDaoProp fileDaoProp;
    private MinioUtil minioUtils;
    private ThreadPoolState threadPoolState; //线程状态

    public FileDelete(FileDaoProp fileDaoProp, MinioUtil minioUtils, ThreadPoolState threadPoolState) {
        this.fileDaoProp = fileDaoProp;
        this.minioUtils = minioUtils;
        this.threadPoolState = threadPoolState;
    }

    public boolean delete() throws Exception{
        //去除空格
        String bucketName = FileUtil.removeBS(fileDaoProp.getFileOwner());
        String prefix = FileUtil.removeBS(fileDaoProp.getFileObject());

        //多线程删除文件数据库内容
        Iterable<Result<Item>> results = minioUtils.listObjects(bucketName, prefix);
        //获取系统处理器个数，作为线程池数量
        int nThreads = Runtime.getRuntime().availableProcessors();
        //创建线程池，这里定义了一个创建线程池的工具类，避免了创建多个线程池，ThreadPoolFactoryUtil可以使用单例模式设计
        ExecutorService executorService = ThreadPoolFactoryUtil.getExecutorService(nThreads);
        for (Result<Item> result : results) {
            Item item = result.get();
            assert item != null;
            FileDeleteTask deleteTask = new FileDeleteTask(minioUtils, bucketName, item.objectName());
            executorService.execute(deleteTask);
        }
        executorService.shutdown();
        //每3秒检查一次线程状态
        while (!executorService.awaitTermination(3, TimeUnit.SECONDS)){ //说明任务完成
            threadPoolState = new ThreadPoolState(executorService);
            System.out.println("当前完成任务数："+threadPoolState.getCompletedTaskCount());
            System.out.println("任务总数："+ threadPoolState.getTaskCount());
            threadPoolState.refreshState();
        }
        return true;
    }
}
