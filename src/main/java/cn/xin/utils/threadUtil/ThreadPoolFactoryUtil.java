package cn.xin.utils.threadUtil;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/*
线程池工具类，避免多次创建线程池
 */
public class ThreadPoolFactoryUtil {
    private static ExecutorService executorService;

    //获取一个线程池
    public static ExecutorService getExecutorService(int mum){
        executorService = Executors.newScheduledThreadPool(mum);
        return executorService;
    }

}
