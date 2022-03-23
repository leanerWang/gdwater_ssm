package cn.xin.domain.sites;

import lombok.Data;
import org.springframework.stereotype.Repository;

//场地边界点

@Repository
@Data
public class SiteBoundingPoints {

    private int id;
    private String siteName; //场地名
    private String pointName; //点名
    private double longitude; //经度
    private double latitude; //纬度


}
