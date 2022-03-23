package cn.xin.service.user.impl;

import cn.xin.dao.user.IUserDao;
import cn.xin.domain.user.WaterUser;
import cn.xin.service.user.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("userService")
public class UserServiceImpl implements IUserService {
    private final IUserDao userDao;

    @Autowired
    public UserServiceImpl(IUserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public WaterUser findUser(String username) {
        List<WaterUser> users = userDao.findUser(username);
        if (users.size() == 0){
            return null;
        }
        if (users.size() > 1){
            throw new RuntimeException("查询结果不唯一");
        } else{
            return users.get(0);
        }
    }

}
