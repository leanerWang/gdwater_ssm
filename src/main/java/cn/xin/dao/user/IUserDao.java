package cn.xin.dao.user;

import cn.xin.domain.user.WaterUser;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository("userDao")
public interface IUserDao {

    /**
     * 根据用户名查询用户
     * @return List<Water_user>
     */

     List<WaterUser> findUser(String username);


}
