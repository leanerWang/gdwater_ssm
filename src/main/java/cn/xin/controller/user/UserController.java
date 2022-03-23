package cn.xin.controller.user;

import cn.xin.domain.user.WaterUser;
import cn.xin.service.user.IUserService;
import cn.xin.utils.webUtil.WebUtil;
import com.alibaba.fastjson.JSON;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/user")
public class UserController {

    private final IUserService userService;

    @Autowired
    public UserController(IUserService userService) {
        this.userService = userService;
    }

    /**
     * 新建场地页面映射
     * @return
     */
    @RequestMapping("/new")
    public String newPage(){return "user/new";}

    /**
     * 用户管理界面映射
     * @return
     */
    @RequestMapping("/user")
    public String index(){return "user/index";}

    /**
     * 登陆页面
     * @return
     */
    @RequestMapping("/login")
    public String login(){return "user/login";}

    /**
     * 判断用户是否存在数据库，判断能否登陆
     * @return
     */
    @SneakyThrows
    @RequestMapping("/loginVerify")
    public void loginVerify(WaterUser user, Model model, HttpServletRequest request, HttpServletResponse response){
        //检验是否登录过
        WaterUser res = WebUtil.getLoginState(request, "user", "user");
        if (res != null){
            //存入session
            WebUtil.setSession(request,"user",res);
            response.sendRedirect(request.getContextPath()+"/home");
            return;
       }

        WaterUser result = userService.findUser(user.getUsername());
        if (result == null){
            //用户名不存在
            model.addAttribute("loginMsg","用户名不存在");
            response.sendRedirect(request.getContextPath()+"/user/login");
            return;
        }
        if (result.getPassword().equals(user.getPassword()) ){
            //登陆成功
            model.addAttribute("loginMsg","欢迎回来！");

            //存入session cookie
            WebUtil.setCookie("user", JSON.toJSONString(result), response);
            WebUtil.setSession(request,"user",result);

            response.sendRedirect(request.getContextPath()+"/sites");
        }else {
            //登陆失败
            model.addAttribute("loginMsg","密码错误！");
            response.sendRedirect(request.getContextPath()+"/user/login");
        }

    }

    @GetMapping("/logOut")
    public String logOut(HttpServletRequest request){
        //清除session
        WebUtil.removeSession(request,"user");
        return "redirect:/user/login";
    }


}
