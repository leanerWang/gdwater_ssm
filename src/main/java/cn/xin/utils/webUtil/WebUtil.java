package cn.xin.utils.webUtil;

import cn.xin.domain.user.WaterUser;
import com.alibaba.fastjson.JSON;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

public class WebUtil {

    private static WaterUser user;

    /**
     * 获取user用户
     * @param request
     * @return
     */
    public static WaterUser getUser(HttpServletRequest request){
        if (user.getUsername() == null || user == null) {
            user = getLoginState(request, "user", "user");
        }
        return user;
    }

    /**
     * 判断登陆状态
     * @param request 请求
     * @param stateName 用户对象的键值
     *
     * @return
     */
    public  static WaterUser getLoginState(HttpServletRequest request, String stateName, String key) {

        //从session中拿值
        final Object loginState = request.getSession().getAttribute(stateName);
        if (loginState != null) {
            user =  (WaterUser) loginState;
            return user;
        }

        //从cookie中拿值
        String value = WebUtil.getCookie(key, request);
        if (value!= null){
            String strValue = null;
            try {
                strValue = URLDecoder.decode(value, "utf-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            user  = JSON.parseObject(strValue, WaterUser.class);
            return user;
        }
        return null;

    }


    /**
     * 获取cookie
     * @param key 键
     * @param request 请求
     * @return 值
     */
    public static String getCookie(String key, HttpServletRequest request){
        Cookie[] cookies = request.getCookies();
        String value = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                String cookieName = cookie.getName();
                if (cookieName.equals(key)) {
                   value = cookie.getValue();
                }
            }
        }
        return value;
    }

    /**
     * 往cookie里面存用户名和密码
     * @param value 键
     * @param value 值
     * @param response
     */
    public static void setCookie(String key,String value, HttpServletResponse response){
        try {
            String strValue  = URLEncoder.encode(value, "UTF-8");
            Cookie cookie = new Cookie(key, strValue);
            cookie.setMaxAge(60 * 60 * 24 * 3);
            cookie.setPath("/"); //在所有根路径下设置cookie
            response.addCookie(cookie);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 往session里存值
     * @param request 请求
     * @param key 键
     * @param obj 值
     */
    public static void setSession(HttpServletRequest request,String key,Object obj){
        request.getSession().setAttribute(key, obj);
    }

    /**
     * 清除session中的值
     * @param request 请求
     * @param key 键
     */
    public static void removeSession(HttpServletRequest request,String key){
        request.getSession().removeAttribute(key);
    }


}
