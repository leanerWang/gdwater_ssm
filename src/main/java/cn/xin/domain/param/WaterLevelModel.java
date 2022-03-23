package cn.xin.domain.param;

import lombok.Data;
import org.springframework.stereotype.Repository;

import java.util.List;


//接受多个WaterLevel对象
@Repository
@Data
public class WaterLevelModel {

    private List<WaterLevel> waterLevels;

    public WaterLevelModel(List<WaterLevel> waterLevels) {
        this.waterLevels = waterLevels;
    }

    public void  add(WaterLevel waterLevel){
        waterLevels.add(waterLevel);
    }
}
