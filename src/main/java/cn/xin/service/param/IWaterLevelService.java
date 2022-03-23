package cn.xin.service.param;

import cn.xin.domain.param.WaterLevel;

import java.util.List;

public interface IWaterLevelService extends ISiteParamService{

    void insert(List<WaterLevel> waterLevels);

    List<WaterLevel> findWaterLevels(String name);
}
