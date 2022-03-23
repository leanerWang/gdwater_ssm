package cn.xin.service.user;

import cn.xin.domain.user.WaterUser;


public interface IUserService {

    /**
     * 查询用户
     * @param username 用户名
     * @return user
     */
    WaterUser findUser(String username);


}
