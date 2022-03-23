package cn.xin.domain.param;


import lombok.Data;
import org.springframework.stereotype.Repository;

//插值结果包装类
@Repository
@Data
public class Interpolation {

    private Double longitude;
    private Double latitude;
    private Double level;
    private String type;
    private String name;
}
