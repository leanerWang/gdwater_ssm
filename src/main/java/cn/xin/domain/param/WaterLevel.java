package cn.xin.domain.param;


import lombok.Data;
import org.springframework.stereotype.Repository;

//地下水位包装类
@Repository
@Data
public class WaterLevel {


    private int id;
    private double longitude;
    private double latitude;
    private double level;
    private String name; //地下水名称
    private String pointName; //采样点名称
    private double distance; //若是IDM插值 该值则为距离的倒数
    private double radio; //该值所占所有值的权重

}
