package cn.xin.domain.param;


import lombok.Data;
import org.springframework.stereotype.Repository;

//场地名称、类型包装类
@Data
@Repository
public class SiteParam {

    private int id;
    private String name;
    private String type;
    private String note;
}
