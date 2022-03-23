package cn.xin.service.sites.impl;

import cn.xin.dao.sites.ISoilDao;
import cn.xin.domain.sites.SoilProp;
import cn.xin.service.sites.ISoilService;
import org.springframework.stereotype.Service;

@Service("soilService")
public class SoilServiceImpl implements ISoilService {

    private ISoilDao soilDao;

    public SoilServiceImpl(ISoilDao soilDao) {
        this.soilDao = soilDao;
    }

    @Override
    public int insert(SoilProp soilProp) {
        return soilDao.insert(soilProp);
    }

    @Override
    public void updateById(SoilProp soilProp) {
        soilDao.updateById(soilProp);
    }

    @Override
    public SoilProp findSoilById(int id) {
        return soilDao.findSoilById(id);
    }
}
