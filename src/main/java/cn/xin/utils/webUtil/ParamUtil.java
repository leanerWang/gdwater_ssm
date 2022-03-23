package cn.xin.utils.webUtil;

import cn.xin.domain.sites.FileDaoProp;
import org.springframework.stereotype.Component;

//传参处理
@Component("paramUtil")
public class ParamUtil {

    private FileDaoProp fileDaoProp;

    public ParamUtil(FileDaoProp fileDaoProp) {
        this.fileDaoProp = fileDaoProp;
    }

    //文件传参处理
    public FileDaoProp doFileParam(String str){

        String[] splits = str.split("&");
        fileDaoProp.setId(Integer.parseInt(splits[0]));
        fileDaoProp.setFileType(splits[1]);
        return fileDaoProp;
    }

}
