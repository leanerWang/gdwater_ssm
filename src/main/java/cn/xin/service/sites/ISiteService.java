package cn.xin.service.sites;

import cn.xin.domain.sites.SiteBoundingPoints;
import cn.xin.domain.sites.SiteProp;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ISiteService {

    /**
     * 插入边界点表
     * @param siteBoundingPoints
     */
    void insertSiteBoundingPoints(SiteBoundingPoints siteBoundingPoints);

    /**
     * 插入
     */
    void insertSite(SiteProp siteProp);


    /**
     * 查询所有场地
     * @param name 用户名
     * @return sites
     */
    List<SiteProp> findSitesByName(String name);

    /**
     * id查询某一场地
     * @param id id
     * @return site
     */
    SiteProp findOneSiteById(int id);

    /**
     * 查询某一个具体的场地
     * @param username 用户名
     * @param siteName 场地名
     * @return
     */
    List<SiteProp> findOneSite(@Param("username")String username , @Param("siteName")String siteName);

    /**
     * 修改场地数据
     * @param siteProp 场地名称
     */
    boolean modifySite(SiteProp siteProp);


    /**
     * 删除场地
     * @param id 场地id
     * @return 布尔
     */
    boolean deleteSite(Integer id);

    /**
     * 降重查询场地边界点
     * @return 场地边界点
     */
    List<SiteBoundingPoints> findBPNDistinct();

    /**
     * 根据边界点名查询
     * @return
     */
    List<SiteBoundingPoints> findBPByName(String name);

}
