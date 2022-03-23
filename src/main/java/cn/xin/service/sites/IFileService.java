package cn.xin.service.sites;

import cn.xin.domain.sites.FileDaoProp;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface IFileService {

    /**
     * 插入，同时判断插入影像还是地形数据库
     */
    void insert(String fileName, String fileObject, String fileOwner, String fileUrl, String fileDescription,String type, String extents);


    void insertFromProp(FileDaoProp fileDaoProp);

    /**
     * 根据文件拥有人查询
     * @param name 用户名
     * @param tableType 数据表类型 影像数据表/地形数据表
     * @return
     */
    List<FileDaoProp> findFiles(String name, String tableType);

    /**
     * 通过文件url查询表
     * 若存在则不插入数据库，而是更改当前表
     * @param url
     * @param fileType
     * @return
     */
    List<FileDaoProp> findByUrl(String url, String fileType);

    /**
     * 根据id 查询 某个类型的属性表
     * 这和上面那种查询方式不一样，这是根据文件类型识别出表类型，只需要写一条sql语句
     * @param id 文件id
     * @param fileType 文件类型
     * @return 文件对象
     */
    FileDaoProp findFileById(int id, String fileType);

    /**
     * 修改
     * @param fileDaoProp 文件对象
     * @param fileType 文件类型
     */
    void updateFile(FileDaoProp fileDaoProp, String fileType);

    /**
     * 删除
     * @param id id
     * @param fileType 文件类型
     */
    void delete(@Param("id") int id, @Param("tableType") String fileType);


}
