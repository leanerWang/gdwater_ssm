package cn.xin.controller.param;

import cn.xin.domain.param.Interpolation;
import cn.xin.domain.param.SiteParam;
import cn.xin.domain.param.WaterLevel;
import cn.xin.domain.sites.SiteBoundingPoints;
import cn.xin.service.param.IWaterLevelService;
import cn.xin.service.sites.ISiteService;
import cn.xin.utils.interpolationUtil.IDMInterpolation;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

//参数
@Controller()
@RequestMapping("/param")
public class ParamController {

    private final IWaterLevelService waterLevelService;
    private final ISiteService siteService;
    private final ModelAndView modelAndView = new ModelAndView();
    private final JSONObject jsonObject = new JSONObject();

    public ParamController(IWaterLevelService waterLevelService, ISiteService siteService) {
        this.waterLevelService = waterLevelService;
        this.siteService = siteService;
    }

    //添加场地参数 如地下水位、土壤孔隙度等
    @GetMapping("/addParam")
    public ModelAndView addParam(){
        modelAndView.setViewName("param/siteParam");
        return modelAndView;
    }
    @GetMapping("/findWater")
    public ModelAndView findWaterName(){
        List<SiteParam> siteParams = waterLevelService.findParamNames("groundwater");
        modelAndView.addObject("siteParams", siteParams);
        modelAndView.setViewName("param/findWaterLevel");
        return modelAndView;
    }
    @CrossOrigin
    @GetMapping("/findWaterLevels/{name}")
    @ResponseBody
    public String findWaterLevels(@PathVariable String name){
        List<WaterLevel> waterLevels = waterLevelService.findWaterLevels(name);
        return JSON.toJSONString(waterLevels);

    }
    @PostMapping(value = "/interpolation" ,produces = "application/json;charset=utf-8")
    @ResponseBody
    public String interpolation(@RequestBody String interpolationStr){
        Interpolation interpolation = JSONObject.parseObject(interpolationStr, Interpolation.class);
        if (interpolation.getType().equals("groundwater")){
            IDMInterpolation<WaterLevel> idmInterpolation = new IDMInterpolation<>();
            List<WaterLevel> waterLevels = waterLevelService.findWaterLevels(interpolation.getName());
            for (WaterLevel waterLevel : waterLevels) {
                idmInterpolation.computerDistance(interpolation, waterLevel);
            }
            for (WaterLevel waterLevel : waterLevels) {
                idmInterpolation.computerRadio(waterLevel);
            }
            for (WaterLevel waterLevel : waterLevels) {
                idmInterpolation.computerResult(waterLevel);
            }
            interpolation.setLevel(idmInterpolation.getResultValue());
        }
        return JSON.toJSONString(interpolation);
    }

    @PostMapping("/paramCommit")
    public ModelAndView paramCommit(String name, String[] pointName,Double[] longitude, Double[] latitude, Double[] level){

        List<WaterLevel> waterLevelModel = new ArrayList<>();
        for (int i = 0; i < longitude.length; i++) {
            WaterLevel waterLevel = new WaterLevel();
            //为空值舍去当前数据
            if (longitude[i] == null | latitude[i] == null | level[i] == null){
                continue;
            }
            waterLevel.setName(name);
            waterLevel.setPointName(pointName[i]);
            waterLevel.setLongitude(longitude[i]);
            waterLevel.setLatitude(latitude[i]);
            waterLevel.setLevel(level[i]);
            waterLevelModel.add(waterLevel);
        }

        SiteParam siteParam = new SiteParam();
        siteParam.setName(name);
        siteParam.setType("groundwater");
        //插入数据到表中
        waterLevelService.insert(waterLevelModel);
        waterLevelService.insertParam(siteParam);

        modelAndView.setViewName("info/massage");
        return modelAndView;
    }

    @GetMapping("/getParma/boundingPoints")
    @ResponseBody
    public String boundingPoints(HttpServletRequest request){
        String name = request.getParameter("name");
        List<SiteBoundingPoints> boundingPoints = siteService.findBPByName(name);
        return JSON.toJSONString(boundingPoints);
    }

    @GetMapping("/getParma/gdwater")
    @ResponseBody
    public String gdwater(HttpServletRequest request){
        String name = request.getParameter("name");
        List<WaterLevel> waterLevels = waterLevelService.findWaterLevels(name);
        return JSON.toJSONString(waterLevels);
    }
}
