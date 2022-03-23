package cn.xin.domain.user;

import lombok.Data;
import org.springframework.stereotype.Repository;

@Repository("waterUser")
@Data
public class WaterUser {

    private int id;
    private String username;
    private String password;

}
