import cn.xin.domain.user.WaterUser;
import cn.xin.service.user.IUserService;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class test1 {

    private ApplicationContext ac;
    private IUserService as;

    @Before
    public void start(){
        ac = new ClassPathXmlApplicationContext( "spring/spring-mybatis.xml");
        as = ac.getBean("userService",IUserService.class);
    }

    @Test
    public void test1(){

        WaterUser user = as.findUser("wxl");
        System.out.println(user);
    }
}
