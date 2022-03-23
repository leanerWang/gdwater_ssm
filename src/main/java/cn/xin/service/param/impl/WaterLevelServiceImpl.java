package cn.xin.service.param.impl;

import cn.xin.dao.param.IWaterLevelDao;
import cn.xin.domain.param.SiteParam;
import cn.xin.domain.param.WaterLevel;
import cn.xin.service.param.IWaterLevelService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("waterLevelService")
public class WaterLevelServiceImpl implements IWaterLevelService {


    private final IWaterLevelDao waterLevelDao;

    public WaterLevelServiceImpl(IWaterLevelDao waterLevelDao) {
        this.waterLevelDao = waterLevelDao;
    }

    @Override
    public void insert(List<WaterLevel> waterLevels) {
        waterLevelDao.insert(waterLevels);
    }

    @Override
    public List<WaterLevel> findWaterLevels(String name) {
        return waterLevelDao.findWaterLevels(name);
    }

    @Override
    public void insertParam(SiteParam siteParam) {
        waterLevelDao.insertParam(siteParam);
    }

    @Override
    public List<SiteParam> findParamNames(String type) {
        return waterLevelDao.findParamNames(type);
    }

}
