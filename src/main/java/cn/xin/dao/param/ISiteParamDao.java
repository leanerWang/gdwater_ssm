package cn.xin.dao.param;

import cn.xin.domain.param.SiteParam;
import org.springframework.stereotype.Repository;

import java.util.List;

//父类接口
@Repository("siteParamDao")
public interface ISiteParamDao {

    void insertParam(SiteParam siteParam);

    //根据参数类型查询场地名称
    List<SiteParam> findParamNames(String type);

}
