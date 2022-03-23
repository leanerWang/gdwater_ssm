package cn.xin.service.param;

import cn.xin.domain.param.SiteParam;

import java.util.List;

public interface ISiteParamService {

    void insertParam(SiteParam siteParam);

    //根据参数类型查询场地名称
    List<SiteParam> findParamNames(String type);
}
