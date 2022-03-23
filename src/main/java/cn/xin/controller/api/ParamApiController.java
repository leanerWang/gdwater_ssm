package cn.xin.controller.api;

import cn.xin.domain.param.WaterLevel;
import cn.xin.service.param.IWaterLevelService;
import com.alibaba.fastjson.JSON;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@Controller
@RequestMapping("/api")
public class ParamApiController {
    private final IWaterLevelService waterLevelService;

    public ParamApiController(IWaterLevelService waterLevelService) {
        this.waterLevelService = waterLevelService;
    }

    @ResponseBody
    @GetMapping("/gdwater/{name}")
    public String findWaterLevels(@PathVariable String name){
        List<WaterLevel> waterLevels = waterLevelService.findWaterLevels(name);
        return JSON.toJSONString(waterLevels);
    }
}
