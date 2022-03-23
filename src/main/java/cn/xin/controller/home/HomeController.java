package cn.xin.controller.home;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 控制网站首页内容
 */
@Controller
@RequestMapping("/home")
public class HomeController {

    /**
     * 主页请求
     * @return
     */
    @RequestMapping("")
    public String index(){return "home/index";}
}
