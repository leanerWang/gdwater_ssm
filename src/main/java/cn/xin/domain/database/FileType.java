package cn.xin.domain.database;


import org.springframework.stereotype.Component;

/**
 * 文件类型 地形 影像 普通文件
 */
@Component
public class FileType {

    private int code = 0;

    public void toIMG(){
        this.code = 0;
    }

    public void toDEM(){
        this.code = 1;
    }

    public void toCommon(){
        this.code = 2;
    }
    public String getTableName(){
        if (this.code == 0){
            return "water_img";
        }else if (this.code == 1){
            return  "water_dem";
        }else if (this.code == 2){
            return  "water_file";
        }else {
            return null;
        }
    }
}
