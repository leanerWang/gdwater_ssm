package cn.xin.utils.siteUtil;

import cn.xin.domain.massage.CardMassage;

import java.util.Objects;
import java.util.UUID;


public class FileUtil {

    //获取文件前缀名
    public static String getPrefixName(String name){
        String[] split = name.split("\\.");
        if (split.length > 0){
            return split[0];
        }else {
            return "";
        }
    }

    //单文件上传时,生成新的唯一文件名
    public static String getNewFileName(String fileName){
        String[] splits = fileName.split("/");
        return UUID.randomUUID() +"_"+ splits[splits.length-1];
    }

    //多文件上传时，获取文件夹名称
    public static String getMultiFileName(String fileName){
        String[] splits = fileName.split("/");
        return splits[0];
    }

    //    切除数据库取出字符串的两边空白
    public static String removeBS(String str){
        return str.trim();
    }

    //根据文件类型识别出表的名称
    public static String getTableName(String fileType){
        String tableName = "";
        if (Objects.equals(fileType, "imgFile")){
            tableName = "water_img";
        }
        if (Objects.equals(fileType, "demFile")){
            tableName = "water_dem";
        }
        if (Objects.equals(fileType, "commonFile")){
            tableName = "water_file";
        }
        return tableName;
    }


    //根据文件类型生成信息提示
    public static void getLinkAndName(CardMassage cardMassage, String fileType){
        if (fileType.equals("imgFile")){
            cardMassage.setLinkAddress("/file/findImages");
            cardMassage.setLinkName("查看所有影像文件...");

        }
        if (fileType.equals("demFile")){
            cardMassage.setLinkAddress("/file/findDems");
            cardMassage.setLinkName("查看所有地形文件...");

        }
        if (fileType.equals("commonFile")){
            cardMassage.setLinkAddress("/file/findCommons");
            cardMassage.setLinkName("查看所有普通文件...");

        }
    }
}
