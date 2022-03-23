package cn.xin.utils.interpolationUtil;

import cn.xin.domain.param.Interpolation;
import cn.xin.domain.param.WaterLevel;
import lombok.Data;
import org.springframework.stereotype.Repository;

//IDM插值类
@Repository
@Data
public class IDMInterpolation<T>{


    private double totalValue =  0;
    private double resultValue = 0;



    public void computerDistance(Interpolation interpolation, T levelObj){
        if (levelObj.getClass().equals(WaterLevel.class)){
            WaterLevel waterLevel = (WaterLevel)levelObj;
             distanceInverse(interpolation,waterLevel);
        }
    }

    public void computerRadio(T levelObj){
        if (levelObj.getClass().equals(WaterLevel.class)){
            WaterLevel waterLevel = (WaterLevel)levelObj;
            radio(waterLevel);
        }
    }

    public void computerResult(T levelObj){
        if (levelObj.getClass().equals(WaterLevel.class)){
            WaterLevel waterLevel = (WaterLevel)levelObj;
            double v = waterLevel.getLevel() * waterLevel.getRadio();
            resultValue += v;
        }
    }

    //计算反距离值
    private void distanceInverse(Interpolation interpolation,WaterLevel waterLevel){
        double longitude = interpolation.getLongitude() / 180;
        double latitude = interpolation.getLatitude() / 180;
        double longitude1 = waterLevel.getLongitude() /180;
        double latitude1 = waterLevel.getLatitude() / 180;
        double longitudeDivide = Math.abs(longitude - longitude1);
        double latitudeDivide = Math.abs(latitude - latitude1);
        double distanceInverse = 1 / Math.sqrt(Math.pow(longitudeDivide, 2) + Math.pow(latitudeDivide, 2));
        waterLevel.setDistance(distanceInverse);
        totalValue += distanceInverse;
    }

    //计算比率
    private void radio(WaterLevel waterLevel){
        double v = waterLevel.getDistance() / totalValue;
        waterLevel.setRadio(v);
    }
}
