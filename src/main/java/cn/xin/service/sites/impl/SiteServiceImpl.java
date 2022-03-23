package cn.xin.service.sites.impl;

import cn.xin.dao.sites.ISiteDao;
import cn.xin.domain.sites.SiteBoundingPoints;
import cn.xin.domain.sites.SiteProp;
import cn.xin.service.sites.ISiteService;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("siteService")
public class SiteServiceImpl implements ISiteService {

    private final ISiteDao siteDao;

    public SiteServiceImpl( ISiteDao siteDao) {
        this.siteDao = siteDao;
    }

    @Override
    public void insertSiteBoundingPoints(SiteBoundingPoints siteBoundingPoints) {
        siteDao.insertSiteBoundingPoints(siteBoundingPoints);
    }

    @Override
    public void insertSite(SiteProp siteProp) {
        siteDao.insertSite(siteProp);
    }

    @Override
    public List<SiteProp> findSitesByName(String name) {
        return siteDao.findSitesByName(name);
    }

    @Override
    public SiteProp findOneSiteById(int id) {
        return siteDao.findOneSiteById(id);
    }

    @Override
    public List<SiteProp> findOneSite(@Param("username") String username, @Param("siteName")String siteName) {
        return siteDao.findOneSite(username,siteName);
    }

    @Override
    public boolean modifySite(SiteProp siteProp) {
        return siteDao.modifySite(siteProp);
    }

    @Override
    public boolean deleteSite(Integer id) {
        return siteDao.deleteSite(id);
    }

    @Override
    public List<SiteBoundingPoints> findBPNDistinct() {
        return siteDao.findBPNDistinct();
    }

    @Override
    public List<SiteBoundingPoints> findBPByName(String name) {
        return siteDao.findBPByName(name);
    }


}
