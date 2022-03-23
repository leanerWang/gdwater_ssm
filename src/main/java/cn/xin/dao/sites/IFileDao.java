package cn.xin.dao.sites;

import cn.xin.domain.sites.FileDaoProp;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 操作img dem 普通文件的索引数据库的接口
 */
@Repository("fileDao")
public interface IFileDao {


    void insertToImg(FileDaoProp fileDaoProp);

    void insertToDem(FileDaoProp fileDaoProp);

    void insertToCommon(FileDaoProp fileDaoProp);

    List<FileDaoProp> findFilesToImg(String name);

    List<FileDaoProp> findFilesToDem(String name);

    List<FileDaoProp> findFilesToCommon(String name);

    /**
     * 根据id 查询 某个类型的属性表
     * @param id 文件id
     * @param tableType 表类型
     * @return 文件对象
     */
    FileDaoProp findFileById(@Param("id") int id, @Param("tableType") String tableType);

    List<FileDaoProp> findByUrl(@Param("fileUrl")String url, @Param("fileType") String fileType);

    /**
     * 修改
     * @param fileDaoProp 文件对象
     * @param tableType 表类型
     */
    void updateFile(@Param("fileDaoProp") FileDaoProp fileDaoProp, @Param("tableType") String tableType);

    /**
     * 删除
     * @param id id
     * @param tableType 表名
     */
    void delete(@Param("id") int id, @Param("tableType") String tableType);


}
