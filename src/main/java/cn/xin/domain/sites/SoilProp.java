package cn.xin.domain.sites;

import lombok.Data;
import org.springframework.stereotype.Repository;

import java.io.Serializable;

//存储土壤属性
@Repository("soilProp")
@Data
public class SoilProp implements Serializable {

    private int id; //唯一id
    private String gdwaterName;
    private String porosityName;
    private String permeabilityName;
    private String pressureName;

//    private double soilDepth ; //土壤深度
//
//    private  double soilPorosity; //孔隙度
//
//    private int soilNumber; //网格层数
//
//    private double soilPermeability; //渗透系数
}
