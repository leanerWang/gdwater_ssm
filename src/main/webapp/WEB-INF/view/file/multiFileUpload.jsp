<%--
  Created by IntelliJ IDEA.
  User: WIN10
  Date: 2021/4/21
  Time: 10:00
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>文件夹上传</title>

</head>
<body>
<%@include file="../public/header.jsp"%>

<div class="container-fluid">
    <div class="row">
        <%@include file="../public/leftNav.jsp"%>
        <div class="center-content col-md-9 col-xl-10 py-md-3 pl-md-5">
            <%@include file="../public/fileCenterNav.jsp"%>

            <div class="container-fluid mt-md-4 bg-light">
                <div class="text-center p-md-2">
                    <h3 class="mb-0">影像地形文件上传</h3>
                    <small>（请选择切片后的文件夹）</small>
                </div>

                <div>
                    <form class="col-md-9 mx-auto h-75" action="${pageContext.request.contextPath}/file/uploadMultiFile" method="post" enctype="multipart/form-data">
                        <div class="form-group">
                            <label for="siteName">文件名称</label>
                            <input type="text" name="folderName" class="form-control" id="siteName" placeholder="请输入场地名..." required value="default">
                        </div>
                        <div class="form-group">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="imgFile" checked>
                                <label class="form-check-label" for="inlineRadio1">影像文件</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="demFile">
                                <label class="form-check-label" for="inlineRadio2">地形文件</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="customFileLang">文件选择</label>
                            <div class="custom-file">
                                <input onchange="showFilename(this.files)" type="file" multiple class="custom-file-input"
                                       id="customFileLang" lang="es" name="siteFile" webkitdirectory>
                                <label class="custom-file-label" for="customFileLang" id="filename_label">请选择一个文件...</label>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="extents">经纬度范围</label>
                            <div id="extents">
                                <div class="row pt-md-1">
                                    <label class="col-md-2">最小</label>
                                    <input class="offset-md-1 col-md-4" name="leftLon" >
                                    <input class="offset-md-1 col-md-4" name="leftLat">
                                </div>
                                <div  class="row pt-md-1">
                                    <label class="col-md-2">最大</label>
                                    <input class="offset-md-1 col-md-4" name="rightLon">
                                    <input class="offset-md-1 col-md-4" name="rightLat">
                                </div>
                            </div>

                        </div>

                        <div class="form-group">
                            <label for="description">文件描述</label>
                            <textarea id="description" class="form-control" rows="5" name="description"></textarea>
                        </div>

                        <div class="form-group text-center" >
                            <button class="btn btn-primary mp-9" type="submit" id="submit">上传</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </div>
</div>

<script>
    function showFilename(files) {
        $("#filename_label").text("已选择"+files.length+"个文件...")
        let length = files.length
        for (let i = 0; i < length; i++) {
            let name = files[i].name
            if (name === 'meta.json'){
                let reader = new FileReader();
                //异步方式，不会影响主线程
                reader.readAsBinaryString(files[i]);
                reader.onload = function(e) {
                    let urlData = this.result;

                    if (typeof urlData ===  "string"){
                        let dataJson = JSON.parse(urlData)
                        //边界赋值
                        let east = dataJson.latLonBounds.east
                        let north = dataJson.latLonBounds.north
                        let south = dataJson.latLonBounds.south
                        let west = dataJson.latLonBounds.west
                        let inputs = $('div#extents input')
                        $(inputs[0]).val(west)
                        $(inputs[1]).val(south)
                        $(inputs[2]).val(east)
                        $(inputs[3]).val(north)

                    }
                }
            }
        }
    }
</script>
</body>
</html>
