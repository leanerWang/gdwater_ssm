package cn.xin.dao.param;

import cn.xin.domain.param.WaterLevel;
import org.springframework.stereotype.Repository;

import java.util.List;

//子类接口
@Repository("waterLevelDao")
public interface IWaterLevelDao extends ISiteParamDao{

    void insert(List<WaterLevel> waterLevels);

    List<WaterLevel> findWaterLevels(String name);
}
