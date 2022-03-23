package cn.xin.utils.threadUtil;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.ThreadPoolExecutor;

//当前线程状态类

public class ThreadPoolState {
    private final ThreadPoolExecutor  executor;
    private int queueSize; //当前排队线程数
    private int activeCount; //当前活动线程数
    private long completedTaskCount; //当前完成任务数
    private long taskCount; //任务总数

    public ThreadPoolState(ExecutorService executorService) {
        this.executor = (ThreadPoolExecutor) executorService;
        queueSize = executor.getQueue().size();
        activeCount = executor.getActiveCount();
        completedTaskCount = executor.getCompletedTaskCount();
        taskCount = executor.getTaskCount();
    }

    public int getQueueSize() {
        return queueSize;
    }

    public int getActiveCount() {
        return activeCount;
    }

    public long getCompletedTaskCount() {
        return completedTaskCount;
    }

    public long getTaskCount() {
        return taskCount;
    }

    //刷新线程池状态
    public void refreshState(){
        queueSize = executor.getQueue().size();
        activeCount = executor.getActiveCount();
        completedTaskCount = executor.getCompletedTaskCount();
        taskCount = executor.getTaskCount();
    }


}
