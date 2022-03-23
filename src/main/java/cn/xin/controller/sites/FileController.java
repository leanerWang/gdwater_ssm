package cn.xin.controller.sites;

import cn.xin.domain.database.Box;
import cn.xin.domain.massage.CardMassage;
import cn.xin.domain.sites.FileDaoProp;
import cn.xin.domain.user.WaterUser;
import cn.xin.service.sites.IFileService;
import cn.xin.utils.siteUtil.FileUtil;
import cn.xin.utils.siteUtil.MinioUtil;
import cn.xin.utils.siteUtil.WebCompressUtil;
import cn.xin.utils.threadUtil.FileDelete;
import cn.xin.utils.threadUtil.FileThreadTask;
import cn.xin.utils.threadUtil.ThreadPoolFactoryUtil;
import cn.xin.utils.threadUtil.ThreadPoolState;
import cn.xin.utils.webUtil.ParamUtil;
import cn.xin.utils.webUtil.WebUtil;
import com.alibaba.fastjson.JSONObject;
import lombok.SneakyThrows;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.WebAsyncTask;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.io.InputStream;
import java.util.Date;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * 上传文件类
 */
@Controller
@RequestMapping("/file")
public class FileController {
    private final MinioUtil minioUtils;
    private final IFileService fileService;
    private final ParamUtil paramUtil;
    private ThreadPoolState threadPoolState; //线程状态
    private CardMassage cardMassage;
    private ModelAndView modelAndView = new ModelAndView();
    private FileDaoProp fileDaoProp;
    private FileDelete fileDelete;


    public FileController(MinioUtil minioUtils, IFileService fileService, ParamUtil paramUtil,FileDaoProp fileDaoProp, CardMassage cardMassage) {
        this.minioUtils = minioUtils;
        this.fileService = fileService;
        this.paramUtil = paramUtil;
        this.cardMassage = cardMassage;
        this.fileDaoProp = fileDaoProp;

    }

    //添加场地页面，单文件
    @RequestMapping("/addFile")
    public String addSite(){return "file/fileUpload";}
    @RequestMapping("/addMultiFile")
    public String addSiteMultiFile(){return "file/folderUpload";}
    @GetMapping("/addZip")
    public String addSiteZip(){return "file/fileUploadZip";}

    @RequestMapping("/fileManager")
    public String sitesManager(){
        return "file/fileManager";
    }

    /**
     * 单文件上传
     * @ResponseBody 转换后，发送信息回response对象的body区
     *  等同于response.getWriter.write(JSONObject.fromObject(user).toString());
     * @param file
     * @param request
     * @return
     */
    @RequestMapping(value = "/upload",method = RequestMethod.POST,produces = "application/json;charset=utf-8")
    @ResponseBody
    public ModelAndView upload(@RequestParam(name = "siteFile") MultipartFile file, HttpServletRequest request) {
        try {
            String folderName = request.getParameter("folderName");
            if (folderName == null) folderName = "default"; //文件默认名称

            String siteDescription = request.getParameter("siteDescription");
            WaterUser user = WebUtil.getLoginState(request, "user", "user");

            if (user != null){
                // 文件名
                String originalFilename = file.getOriginalFilename();
                // 新的文件名
                String newFileName = FileUtil.getNewFileName(originalFilename);
                cardMassage = minioUtils.uploadFile(file, user.getUsername(),newFileName);

                if (cardMassage.getCode() != 1){ //说明没问题
                    //存入普通文件数据库
                    String fileUrl = minioUtils.getUrl(user.getUsername(), newFileName);
                    fileService.insert(folderName, newFileName, user.getUsername(), fileUrl, siteDescription, "commonFile", null);

                    cardMassage.setMassage(folderName+"上传成功！--服务器端发来了祝贺...还想再次上传？请点下面链接...");
                    cardMassage.setLinkName("继续上传文件...");
                    cardMassage.setLinkAddress(request.getContextPath()+"/file/addFile");
                }
            }else {
                cardMassage.setMassage("狗子，还没登陆就想传文件？");
                cardMassage.setLinkName("请登陆...");
                cardMassage.setLinkAddress(request.getContextPath()+"/user/login");
            }
        } catch (Exception e) {
            e.printStackTrace();
            cardMassage.setMassage("不知名的异常出现了，请等待管理员修复...");
        }
        modelAndView.setViewName("info/massage");
        modelAndView.addObject("info",cardMassage);
        return modelAndView;
    }

    /**
     * 使用多线程上传文件夹，支持谷歌浏览器
     * @param request 请求
     * @param files 文件集合
     * @return ModelAndView
     */
    @SneakyThrows
    @PostMapping(value = "/foldUpload",produces =  "application/json;charset=utf-8")
    public ModelAndView uploadMultiFile(@RequestParam("siteFiles") List<MultipartFile> files, HttpServletRequest request) {

        modelAndView.setViewName("info/massage");
        WaterUser user = WebUtil.getLoginState(request, "user", "user");
        String folderName = request.getParameter("folderName"); //表单中的可变文件名称
        if (folderName == null) folderName = "default"; //文件默认名称

        String description = request.getParameter("siteDescription");
        String fileType = request.getParameter("inlineRadioOptions");

        //经纬度范围坐标
        String west = request.getParameter("minLon");
        String south = request.getParameter("minLat");
        String east = request.getParameter("maxLon");
        String north = request.getParameter("maxLat");
        Box<Float> box = new Box(west, south, east,north);
        String extents = JSONObject.toJSONString(box);

        //判断是否有选择文件夹
        if ( files.size() == 0 | files.get(0).isEmpty()){
            cardMassage.setLinkName("重新上传...");
            cardMassage.setLinkAddress("/file/addMultiFile");
            cardMassage.setMassage("请选择一个非空的文件夹哦...");
            modelAndView.addObject("info",cardMassage);
            return modelAndView;
        }

        String newFileName = FileUtil.getMultiFileName(files.get(0).getOriginalFilename()); //文件夹名称

        //多线程上传文件夹
        //获取系统处理器个数，作为线程池数量
        int nThreads = Runtime.getRuntime().availableProcessors();
        //创建线程池，这里定义了一个创建线程池的工具类，避免了创建多个线程池，ThreadPoolFactoryUtil可以使用单例模式设计
        ExecutorService executorService = ThreadPoolFactoryUtil.getExecutorService(nThreads);

        if (user != null ) {
            for (MultipartFile file : files) {
                String originalFilename = file.getOriginalFilename();
                InputStream in = file.getInputStream();
                FileThreadTask threadTask = new FileThreadTask(minioUtils, in, file.getContentType(), user.getUsername(), originalFilename);
                executorService.execute(threadTask);
            }

            executorService.shutdown();
            while (!executorService.awaitTermination(5, TimeUnit.SECONDS)) {
                ThreadPoolExecutor executor = (ThreadPoolExecutor) executorService;
                int queueSize = executor.getQueue().size(); //排队线程数
                System.out.println("当前排队线程数："+queueSize);
                int activeCount = executor.getActiveCount();
                System.out.println("当前活动线程数："+activeCount);
                long completedTaskCount = executor.getCompletedTaskCount();
                System.out.println("当前完成任务数："+completedTaskCount);
                long taskCount = executor.getTaskCount();
                System.out.println("任务总数："+taskCount);
            }


            //判断是否已进场存入数据库，若没有则插入，若有则修改
            //存入不同的数据库
            String fileUrl = minioUtils.getUrl(user.getUsername(), newFileName);
            fileDaoProp.setFileBox(extents);
            fileDaoProp.setFileName(folderName);
            fileDaoProp.setFileOwner(user.getUsername());
            fileDaoProp.setFileObject(newFileName);
            fileDaoProp.setFileDate(new Date());
            fileDaoProp.setFileDescription(description);
            fileDaoProp.setFileType(fileType);
            if (!fileUrl.equals(fileDaoProp.getFileUrl())){
                fileDaoProp.setFileUrl(fileUrl);
                fileService.insertFromProp(fileDaoProp);
            }
//            只是上次文件，不必判断
//            List<FileDaoProp> fileDaoProps = fileService.findByUrl(fileUrl, fileType);
//            if (fileDaoProps.size() == 0){
//                fileService.insertFromProp(fileDaoProp);
//            }
//            else {
//                fileDaoProp.setId(fileDaoProps.get(0).getId());
//                fileService.updateFile(fileDaoProp, fileType);
//            }
            //上传成功
            cardMassage.setLinkName("继续上传文件...");
            cardMassage.setLinkAddress("/file/addMultiFile");
            cardMassage.setMassage("文件"+folderName+"上传成功！--服务器端发来贺电...还想再次上传？请点下面链接...");

        }else {
            cardMassage.setMassage("狗子，还没登陆就想传文件？");
            cardMassage.setLinkName("请登陆...");
            cardMassage.setLinkAddress(request.getContextPath()+"/user/login");
        }
        //存入数据库
        modelAndView.addObject("info",cardMassage);
        return modelAndView;
    }

    @PostMapping(value = "/uploadZip",produces =  "application/json;charset=utf-8")
    public ModelAndView uploadZip(@RequestParam(name = "siteFileZip") MultipartFile file, HttpServletRequest request) {
        try {
            String folderName = request.getParameter("folderName");
            if (folderName == null) folderName = "default"; //文件默认名称
            String siteDescription = request.getParameter("siteDescription");
            String fileType = request.getParameter("inlineRadioOptions");
            WaterUser user = WebUtil.getLoginState(request, "user", "user");
            if (user != null){
                // 文件名
                String originalFilename = file.getOriginalFilename();
                // 新的文件名
                String prefixName = FileUtil.getPrefixName(originalFilename);
                String bucketName = user.getUsername();
                //解压上传
                List<String> list = WebCompressUtil.unCompress(file, minioUtils.getClient(), bucketName, prefixName);
                if (cardMassage.getCode() != 1){ //说明没问题
                    //存入普通文件数据库
                    String fileUrl = minioUtils.getUrl(user.getUsername(), prefixName);
                    fileService.insert(folderName, prefixName, user.getUsername(), fileUrl, siteDescription, fileType, null);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            cardMassage.setMassage("不知名的异常出现了，请等待管理员修复...");
        }
        modelAndView.setViewName("info/massage");
        modelAndView.addObject("info",cardMassage);
        return modelAndView;
    }

    /**
     * 查询所有的影像文件
     * @return files
     */
    @GetMapping("/findImages")
    public ModelAndView findImages(HttpServletRequest request) {

        WaterUser user = WebUtil.getUser(request);
        List<FileDaoProp> fileDaoProps = fileService.findFiles(user.getUsername(), "imgFile");
        modelAndView.addObject("files",fileDaoProps);
        modelAndView.setViewName("file/fileInfo");
        return modelAndView;
    }

    /**
     * 查询所有的地形文件
     * @return files
     */
    @GetMapping("/findDems")
    public ModelAndView findDems(HttpServletRequest request) {
        WaterUser user = WebUtil.getUser(request);
        List<FileDaoProp> fileDaoProps = fileService.findFiles(user.getUsername(), "demFile");
        modelAndView.addObject("files",fileDaoProps);
        modelAndView.setViewName("file/fileInfo");
        return modelAndView;
    }

    /**
     * 查询所有的普通文件
     * @return files
     */
    @GetMapping("/findCommons")
    public ModelAndView findCommons(HttpServletRequest request) {

        WaterUser user = WebUtil.getUser(request);
        List<FileDaoProp> fileDaoProps = fileService.findFiles(user.getUsername(), "commonFile");
        modelAndView.addObject("files",fileDaoProps);
        modelAndView.setViewName("file/fileInfo");
        return modelAndView;
    }

    /**
     * 查询要修改的文件,跳转修改页面
     * @param str 文件id和类型
     * @return
     */
    @GetMapping("/modify/{str}")
    public ModelAndView fileModify(@PathVariable String str){
        try {
             fileDaoProp = paramUtil.doFileParam(str);
        }catch (Exception e){
            cardMassage.setMassage("传参过程发生错误！小问题，不要怕！请联系管理员...");
            modelAndView.addObject("info",cardMassage);
            modelAndView.setViewName("info/massage");
            return modelAndView;
        }
        FileDaoProp newFileDao = fileService.findFileById(fileDaoProp.getId(), fileDaoProp.getFileType());
        if (newFileDao == null){
            cardMassage.setMassage("文件类型识别表明失败！小问题，不要怕！请联系管理员...");
            modelAndView.addObject("info",cardMassage);
            modelAndView.setViewName("info/massage");
            return modelAndView;
        }
        modelAndView.addObject("file",newFileDao);
        modelAndView.setViewName("file/fileModify");
        return modelAndView;
    }

    /**
     * 提交修改的内容
     * @param str 文件id和类型
     * @return 视图
     */
    @PostMapping("/modify/{str}")
    public ModelAndView modifyCommit(@PathVariable String str, FileDaoProp newFileDaoProp){
        try {
            fileDaoProp = paramUtil.doFileParam(str);
        }catch (Exception e){
            cardMassage.setMassage("传参过程发生错误！小问题，不要怕！请联系管理员...");
            modelAndView.addObject("info",cardMassage);
            modelAndView.setViewName("info/massage");
            return modelAndView;
        }

        //修改后的类
        newFileDaoProp.setFileType(fileDaoProp.getFileType());
        newFileDaoProp.setId(fileDaoProp.getId());
        newFileDaoProp.setFileDate(new Date());
        fileService.updateFile(newFileDaoProp,newFileDaoProp.getFileType());

        //跳转信息中转站
        cardMassage.setMassage("不错哦，文件修改成功！");
        FileUtil.getLinkAndName(cardMassage, newFileDaoProp.getFileType());
        modelAndView.addObject("info",cardMassage);
        modelAndView.setViewName("info/massage");
        return modelAndView;
    }

    /**
     * 删除文件
     * @param id id
     * @param fileType 文件类型
     * @return 视图
     */
    @SneakyThrows
    @GetMapping("/delete/{id}/{fileType}")
    public WebAsyncTask<ModelAndView> modifyCommit(@PathVariable int id, @PathVariable String fileType){
        FileDaoProp fileDaoProp = fileService.findFileById(id, fileType);
        fileDelete = new FileDelete(fileDaoProp,minioUtils, threadPoolState);
        Callable<ModelAndView> callable = new Callable<ModelAndView>() {
            @Override
            public ModelAndView call() throws Exception {
                fileDelete.delete();
                try{
                    //删除索引数据
                    fileService.delete(id,fileType);
                }catch (Exception e){
                    //捕获外键约束非法删除的异常
                    if (e instanceof DataIntegrityViolationException ){
                        cardMassage.setMassage("删除失败，该文件已链接到场地表中，不能删除！");
                        cardMassage.setLinkName("再试一次吧！");
                        cardMassage.setLinkAddress("file/findDems");
                        modelAndView.addObject("info",cardMassage);
                        modelAndView.setViewName("info/massage");
                        return modelAndView;
                    }
                }

                cardMassage.setMassage("不错哦，删除成功！");
                FileUtil.getLinkAndName(cardMassage, fileType);
                modelAndView.addObject("info",cardMassage);
                modelAndView.setViewName("info/massage");
                return modelAndView;
            }
        };
        return new WebAsyncTask<>(callable);
//        //删除文件数据
//        FileDaoProp fileDaoProp = fileService.findFileById(id, fileType);
//        //去除空格
//        String bucketName = FileUtil.removeBS(fileDaoProp.getFileOwner());
//        String prefix = FileUtil.removeBS(fileDaoProp.getFileObject());
//
//        //多线程删除文件数据库内容
//        Iterable<Result<Item>> results = minioUtils.listObjects(bucketName, prefix);
//        //获取系统处理器个数，作为线程池数量
//        int nThreads = Runtime.getRuntime().availableProcessors();
//        //创建线程池，这里定义了一个创建线程池的工具类，避免了创建多个线程池，ThreadPoolFactoryUtil可以使用单例模式设计
//        ExecutorService executorService = ThreadPoolFactoryUtil.getExecutorService(nThreads);
//        for (Result<Item> result : results) {
//            Item item = result.get();
////            System.out.println(item.objectName()+"删除成功！");
//            FileDeleteTask deleteTask = new FileDeleteTask(minioUtils, bucketName, item.objectName());
//            executorService.execute(deleteTask);
//        }
//        executorService.shutdown();
//        //每3秒检查一次线程状态
//        while (!executorService.awaitTermination(3, TimeUnit.SECONDS)){ //说明任务完成
//            threadPoolState = new ThreadPoolState(executorService);
//            System.out.println("当前完成任务数："+threadPoolState.getCompletedTaskCount());
//            System.out.println("任务总数："+ threadPoolState.getTaskCount());
//            threadPoolState.refreshState();
//        }


//        try{
//            //删除索引数据
//            fileService.delete(id,fileType);
//        }catch (Exception e){
//            //捕获外键约束非法删除的异常
//             if (e instanceof DataIntegrityViolationException ){
//                 cardMassage.setMassage("删除失败，该文件在场地中已使用，不能删除！");
//                 modelAndView.addObject("info",cardMassage);
//                 modelAndView.setViewName("info/massage");
//                 return modelAndView;
//            }
//        }
//
//        cardMassage.setMassage("不错哦，删除成功！");
//        FileUtil.getLinkAndName(cardMassage, fileType);
//        modelAndView.addObject("info",cardMassage);
//        modelAndView.setViewName("info/massage");
//        return modelAndView;
    }
}
