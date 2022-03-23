package cn.xin.utils.siteUtil;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {

    /**
     * 转换时间
     * @param date 日期
     * @return 返回给定字符串时间
     */
    public static String xlDateFormat(Date date){
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String dateTime = dateFormat.format(date);
        return dateTime;
    }

}
