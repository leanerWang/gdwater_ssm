package cn.xin.dao.sites;

import cn.xin.domain.sites.SoilProp;
import org.springframework.stereotype.Repository;

//土壤数据库接口
@Repository("soilDao")
public interface ISoilDao {

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
