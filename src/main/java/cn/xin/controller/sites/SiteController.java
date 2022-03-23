package cn.xin.controller.sites;

import cn.xin.domain.massage.CardMassage;
import cn.xin.domain.param.SiteParam;
import cn.xin.domain.sites.*;
import cn.xin.domain.user.WaterUser;
import cn.xin.service.param.ISiteParamService;
import cn.xin.service.sites.IFileService;
import cn.xin.service.sites.ISiteService;
import cn.xin.service.sites.ISoilService;
import cn.xin.utils.siteUtil.MinioUtil;
import cn.xin.utils.threadUtil.ThreadPoolState;
import cn.xin.utils.webUtil.MvStatus;
import cn.xin.utils.webUtil.WebUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import lombok.SneakyThrows;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.List;

/**
 * 场地类
 */
@Controller
@RequestMapping("/sites")
public class SiteController {
    private final MinioUtil minioUtils;
    private final ISiteService siteService;
    private final IFileService fileService;
    private final ISoilService soilService;
    private final ISiteParamService paramService;
    private ThreadPoolState threadPoolState; //线程状态
    private final CardMassage cardMassage;
    private final ModelAndView modelAndView = MvStatus.getMv(); //所有场地共用一个model，为了方便取值，而不用多次查询数据


    public SiteController(MinioUtil minioUtils, ISiteService siteService, IFileService fileService, ISoilService soilService, CardMassage cardMassage,ISiteParamService paramService) {
        this.minioUtils = minioUtils;
        this.siteService = siteService;
        this.fileService = fileService;
        this.cardMassage = cardMassage;
        this.soilService = soilService;
        this.paramService = paramService;
    }

    //主页面
    @RequestMapping("")
    public String manageSites(){
        return "home/manager";
    }

    //场地管理页面
    @RequestMapping("/sitesManager")
    public String sitesManager(){
        return "sites/siteManager";
    }

    /**
     * 创建场地页面跳转
     */
    @GetMapping("/new")
    public ModelAndView createSite(HttpServletRequest request){
        WaterUser user = WebUtil.getLoginState(request, "user", "user");
//
//        Object imgFiles = MvStatus.getObj("imgFiles");
//        Object demFiles = MvStatus.getObj("demFiles");
//        Object commonFiles = MvStatus.getObj("commonFiles");
//        Object boundingPoints = MvStatus.getObj("boundingPoints");
//        Object waterLevel = MvStatus.getObj("waterLevel");

        //判断session中是否已经有影像的数据
       // if (imgFiles == null){
            assert user != null;
            List<FileDaoProp> imgFiles2 = fileService.findFiles(user.getUsername(), "imgFile");
            modelAndView.addObject("imgFiles",imgFiles2);
        //}
       // if (demFiles == null){
        //    assert user != null;
            List<FileDaoProp> demFiles2 = fileService.findFiles(user.getUsername(), "demFile");
            modelAndView.addObject("demFiles",demFiles2);
      //  }
       // if (commonFiles == null){
       //     assert user != null;
            List<FileDaoProp> commonFiles2 = fileService.findFiles(user.getUsername(), "commonFile");
            modelAndView.addObject("commonFiles",commonFiles2);

       // }
       // if (boundingPoints == null){
         //   assert user != null;
            List<SiteBoundingPoints> siteBoundingPoints = siteService.findBPNDistinct();
            modelAndView.addObject("boundingPoints",siteBoundingPoints);
       // }
       // if (waterLevel == null){
         //   assert user != null;
            List<SiteParam> siteParamList = paramService.findParamNames("groundwater");
            modelAndView.addObject("waterLevel",siteParamList);
      //  }
        modelAndView.setViewName("sites/siteCreate");
        return modelAndView;
    }

    /**
     * 处理存入数据库
     */
    @PostMapping("/commit")
    public ModelAndView commitSite(SoilProp soilProp,SiteProp siteProp, HttpServletRequest request){
        WaterUser user = WebUtil.getUser(request);
        //插入土壤数据库
        soilService.insert(soilProp);

        String boundingName = request.getParameter("boundingName");
        //插入场地数据库
        siteProp.setBoundingName(boundingName);
        siteProp.setSoilId(soilProp.getId());
        siteProp.setSiteDate(new Date());
        siteProp.setSiteOwner(user.getUsername());
        siteService.insertSite(siteProp);

        //返回提示信息
        cardMassage.setMassage("真不错，新建场地："+siteProp.getSiteName()+"，成功！");
        cardMassage.setLinkAddress("findSites");
        cardMassage.setLinkName("查询所有场地...");
        modelAndView.addObject("info",cardMassage);
        modelAndView.setViewName("info/massage");
        return modelAndView;
    }


    /**
     * 查询所有的场地文件
     * @return ModelAndView
     */
    @GetMapping("/findSites")
    public ModelAndView findSites(HttpServletRequest request) {

        WaterUser user = WebUtil.getUser(request);
        List<SiteProp> sites = siteService.findSitesByName(user.getUsername());
        modelAndView.addObject("sites",sites);
        modelAndView.setViewName("sites/siteInfo");
        return modelAndView;
    }


    //跳转修改场地信息页面
    @GetMapping("/siteModify/{id}")
    public String siteModify(Model model, @PathVariable int id){
        SiteProp oneSite = siteService.findOneSiteById(id);
        SoilProp soilProp = soilService.findSoilById(oneSite.getSoilId());
        FileDaoProp imgFile = fileService.findFileById(oneSite.getImgId(), "imgFile");
        FileDaoProp demFile = fileService.findFileById(oneSite.getDemId(), "demFile");
        model.addAttribute("site",oneSite);
        model.addAttribute("soil",soilProp);
        model.addAttribute("img",imgFile);
        model.addAttribute("dem",demFile);
        return "/sites/siteModify";
    }


    //rest风格
    @PostMapping("/siteModify/{id}/{sid}")
    public ModelAndView siteModify(SiteProp siteProp,@PathVariable int id, @PathVariable int sid){
        //只修改场地名称不修改数据库文件名称
        siteProp.setId(id);
        siteProp.setSiteDate(new Date());
        siteService.modifySite(siteProp);

//        soilProp.setId(sid);
//        soilService.updateById(soilProp);

        cardMassage.setMassage("很棒！场地修改成功！");
        cardMassage.setLinkName("重新查询所有场地...");
        cardMassage.setLinkAddress("/sites/findSites");
        modelAndView.addObject("info", cardMassage);
        modelAndView.setViewName("info/massage");
        return modelAndView;

    }

    //删除场地
    @SneakyThrows
    @GetMapping("/siteDelete/{id}")
    public ModelAndView siteDelete(@PathVariable int id){
        siteService.deleteSite(id);
        cardMassage.setLinkAddress("/sites/findSites");
        cardMassage.setMassage("成功删除该场地！");
        cardMassage.setLinkName("查询所有场地...");
        modelAndView.setViewName("info/massage");
        modelAndView.addObject("info", cardMassage);
        return modelAndView;

    }

    //获取影像地形服务路径
    @GetMapping("/getSiteUrl/{id}")
    @ResponseBody
    public JSONObject getSiteUrl(@PathVariable int id ){
        JSONObject jsonObject = new JSONObject();
        SiteProp site = siteService.findOneSiteById(id);
        FileDaoProp imgFile = fileService.findFileById(site.getImgId(), "imgFile");
        FileDaoProp demFile = fileService.findFileById(site.getDemId(), "demFile");
        SoilProp soil = soilService.findSoilById(site.getSoilId());
        jsonObject.put("imgUrl",imgFile.getFileUrl());
        jsonObject.put("demUrl",demFile.getFileUrl());
        jsonObject.put("soilProp", JSON.toJSONString(soil));
        jsonObject.put("siteProp", JSON.toJSONString(site));
        return jsonObject;
    }


    @RequestMapping("/siteSelect")
    public ModelAndView siteSelect(HttpServletRequest request){
        ModelAndView modelAndView = MvStatus.getMv();
        JSONObject jsonObject = new JSONObject();
        WaterUser user = WebUtil.getLoginState(request, "user", "user");
        if (user == null){
            jsonObject.put("code",0);
            jsonObject.put("msg","未登录");
            modelAndView.setViewName("user/login");
            return modelAndView;
        }

        Object allSites = MvStatus.getObj("allSites");
        //判断session中是否已经有所有场地的数据
        if (allSites == null){
            List<SiteProp> siteProps = siteService.findSitesByName(user.getUsername());
            modelAndView.addObject("allSites",siteProps);
        }
        modelAndView.setViewName("sites/siteSelect");
        return modelAndView;
    }


    //cesium加载场地
    @SneakyThrows
    @RequestMapping("/siteLoading/{id}")
    public ModelAndView siteLoading(@PathVariable int id,HttpServletRequest request){
        ModelAndView modelAndView = new ModelAndView();
        WaterUser user = WebUtil.getLoginState(request, "user", "user");

        if (user == null){
            modelAndView.setViewName("user/login");
            return modelAndView;
        }

        String selectImageName = request.getParameter("imgName");
        String selectDemName = request.getParameter("demName");
        if (selectImageName == null || selectDemName == null){
            modelAndView.addObject("errorMsg","请选择一个场地...");
            modelAndView.setViewName("sites/siteSelect");
            return modelAndView;
        }
        //查询数据库
        List<SiteProp> imgSiteProp = siteService.findOneSite(user.getUsername(), selectImageName);
        List<SiteProp> demSiteProp = siteService.findOneSite(user.getUsername(), selectDemName);
        if (imgSiteProp.size() > 1 || demSiteProp.size() > 1){
            modelAndView.addObject("errorMsg", "存在多个影像或地形同名场地！");
            modelAndView.setViewName("sites/siteSelect");
            return modelAndView;
        }
        //存入session
//        modelAndView.addObject("imgUrl",imgSiteProp.get(0).getSiteUrl());
//        modelAndView.addObject("demUrl",demSiteProp.get(0).getSiteUrl());
        modelAndView.setViewName("cesium/index");
        return  modelAndView;

    }



    //cesium加载场地
    @SneakyThrows
    @RequestMapping("/getFileUrl")
    @ResponseBody
    public JSONObject getFileUrl(FileProp fileProp, HttpServletRequest request, HttpServletResponse response ){
        JSONObject jsonObject = new JSONObject();
        WaterUser user = WebUtil.getLoginState(request, "user", "user");

        if (user == null){
            jsonObject.put("errorMsg","用户未登录...");
            return jsonObject;
        }

        String selectImageName = fileProp.getImgName();
        String selectDemName = fileProp.getDemName();
        if (selectImageName == null || selectDemName == null){
            jsonObject.put("errorMsg","请选择一个场地...");
            return jsonObject;
        }
        //查询数据库
        List<SiteProp> imgSiteProp = siteService.findOneSite(user.getUsername(), selectImageName);
        List<SiteProp> demSiteProp = siteService.findOneSite(user.getUsername(), selectDemName);
        if (imgSiteProp.size() > 1 || demSiteProp.size() > 1){
            jsonObject.put("errorMsg", "存在多个影像或地形同名场地...");
            return jsonObject;
        }
//        String imgUrl = imgSiteProp.get(0).getSiteUrl();
//        String demUrl = demSiteProp.get(0).getSiteUrl();
//        if (imgUrl ==  null || demUrl == null){
//            jsonObject.put("errorMsg","查询的路径不存在...");
//            return jsonObject;
//        }
//
//        jsonObject.put("imgUrl",imgUrl);
//        jsonObject.put("demUrl",demUrl);
        return jsonObject;
    }

    @GetMapping("/boundingPoints")
    public String  boundingPoints(){
        return "sites/siteBounding";
    }

    @PostMapping("/boundingPoints/add")
    public ModelAndView addBoundingPoints( String siteName, String[] pointName,
                                          Double[] longitude, Double[] latitude){
        modelAndView.setViewName("info/massage");
        if (siteName == null){
            cardMassage.setMassage("场地名称不能为空！");
            cardMassage.setLinkName("重新添加边界点！");
            cardMassage.setLinkAddress("sites/boundingPoints");
            modelAndView.addObject("info",cardMassage);
            return modelAndView;
        }
        for (int i = 0; i < longitude.length; i++) {
            if (longitude[i] != null & latitude[i] != null ){
                SiteBoundingPoints siteBoundingPoints = new SiteBoundingPoints();
                siteBoundingPoints.setSiteName(siteName);
                siteBoundingPoints.setLatitude(latitude[i]);
                siteBoundingPoints.setLongitude(longitude[i]);
                siteBoundingPoints.setPointName(pointName[i]);
                siteService.insertSiteBoundingPoints(siteBoundingPoints);
            }

        }
        cardMassage.setMassage("场地边界点创建成功！");
        modelAndView.addObject("info",cardMassage);
        return modelAndView;
    }

    @GetMapping("/release")
    public String release(Model model, HttpServletRequest request){
        WaterUser user = WebUtil.getLoginState(request, "user", "user");
        assert user != null;
        List<SiteProp> sites = siteService.findSitesByName(user.getUsername());
        model.addAttribute("sites",sites);
        return "sites/siteRelease";
    }


//    @SneakyThrows
//    @GetMapping("/test")
//    public String test(){
//        Iterable<Result<Item>> results = minioUtils.listObjects("wxl", "hhu_img");
//        for (Result<Item> result : results) {
//            Item item = result.get();
//            System.out.println(item.objectName());
//        }
//        return "manageIndex";
//    }

}
