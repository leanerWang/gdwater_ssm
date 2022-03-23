package cn.xin.domain.sites;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Data
@Component
@PropertySource("classpath:config/minio.config.properties")
public class MinioProp {

    /**
     * 连接url
     */
    @Value("${endpoint}")
    private String endpoint;
    /**
     * 用户名
     */
    @Value("${accesskey}")
    private String accesskey;
    /**
     * 密码
     */
    @Value("${secretKey}")
    private String secretKey;

}
