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
    <!-- BEGIN PAGE LEVEL STYLES -->
    <link href="/plugins/dropzone/dropzone.css" rel="stylesheet" type="text/css"/>
    <link href="/plugins/sweetalert/sweetalert.css" rel="stylesheet" type="text/css"/>
    <!-- END PAGE LEVEL STYLES -->


</head>
<body>

<%@include file="../public/leftNav.jsp" %>

<div class="main-content">
    <%@include file="../public/header.jsp" %>

    <!--body wrapper start-->
    <div class="wrapper">

        <!--Start Page Title-->
        <div class="page-title-box">
            <h4 class="page-title">文件夹</h4>
            <ol class="breadcrumb">
                <li>
                    <a href="#">起步</a>
                </li>
                <li>
                    <a href="#">上传</a>
                </li>
                <li class="active">
                    文件夹
                </li>
            </ol>
            <div class="clearfix"></div>
        </div>

        <div class="col-md-12">

            <div class="white-box">
                <h2 class="header-title">切片文件夹</h2>

                <form class="form-horizontal" action="" method="POST">
                    <div class="form-group">
                        <label class="col-md-2 control-label">名称</label>
                        <div class="col-md-10">
                            <input class="form-control" value="default" type="text" name="folderName" id="folderName">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-2 control-label">类型</label>
                        <div class="col-md-10">
                            <div class="radio d-inline-block">
                                <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="imgFile"
                                       checked>
                                <label for="inlineRadio1">影像</label>
                            </div>
                            <div class="radio d-inline-block">
                                <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="demFile">
                                <label for="inlineRadio2">地形</label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-2 control-label">描述</label>
                        <div class="col-md-10">
                            <textarea class="form-control" rows="5" name="siteDescription"
                                      id="siteDescription"></textarea>
                        </div>
                    </div>

                    <div class="form-group">
                        <!--Start row-->
                        <div class="col-md-10 col-md-offset-2">
                            <div id="myDropzone" class="dropzone form-control" style="overflow: auto;"></div>
                        </div>
                        <!-- end row -->
                    </div>

                    <div class="form-group">
                        <div class="text-center">
                            <button class="btn btn-danger col-md-offset-2" id="removeAllFiles">Clear All Files</button>
                        </div>
                    </div>

                    <div class="form-group" id="longitudes">
                        <label class="col-md-2 control-label">经度范围</label>
                        <div class="col-md-10">
                            <input class="col-md-5 " name="minLon" type="text" id="minLon">
                            <input class="col-md-5 col-md-offset-2" name="maxLon" type="text" id="maxLon">
                        </div>

                    </div>

                    <div class="form-group" id="latitudes">
                        <label class="col-md-2 control-label">纬度范围</label>
                        <div class="col-md-10">
                            <input class="col-md-5 " name="minLat" type="text" id="minLat">
                            <input class="col-md-5 col-md-offset-2" name="maxLat" type="text" id="maxLat">
                        </div>

                    </div>

                    <div class="form-group">
                        <div class="text-center col-md-offset-2">
                            <button type="submit" class="btn btn-primary" id="submit">上传</button>
                        </div>
                    </div>
                </form>

            </div>


        </div>

    </div>

</div>

<%@include file="../public/end.jsp" %>
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="/plugins/dropzone/dropzone.js"></script>
<script src="/js/util/folder.js"></script>
<script src="/plugins/sweetalert/sweet-alert.js"></script>
<script>

</script>
</body>
</html>
