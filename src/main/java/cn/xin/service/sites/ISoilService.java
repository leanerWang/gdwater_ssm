package cn.xin.service.sites;

import cn.xin.domain.sites.SoilProp;

public interface ISoilService {

    int insert(SoilProp soilProp);

    /**
     * 修改土壤属性
     * @param soilProp soil
     */
    void updateById(SoilProp soilProp);


    /**
     * id查询
     * @param id 土壤id
     * @return soil
     */
    SoilProp findSoilById(int id);
}
