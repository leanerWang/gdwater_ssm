package cn.xin.utils.webUtil;

import org.springframework.web.servlet.ModelAndView;

/**
 * 共享modelandview
 * 不用多次存值和取值
 * 但也有bug
 */
public class MvStatus {

    private static ModelAndView modelAndView;

    public static ModelAndView getMv(){
        if (modelAndView == null){
            modelAndView = new ModelAndView();
        }
        return modelAndView;
    }

    public static Object getObj(String name){
        return modelAndView.getModel().get(name);
    }

}
