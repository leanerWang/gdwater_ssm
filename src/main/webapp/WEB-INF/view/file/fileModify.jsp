<%--
  Created by IntelliJ IDEA.
  User: WIN10
  Date: 2021/6/17
  Time: 16:22
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>文件修改</title>
</head>
<body>
<%@include file="../public/leftNav.jsp"%>

<div class="main-content" >
    <%@include file="../public/header.jsp"%>

    <!--body wrapper start-->
    <div class="wrapper xl-wrapper-height">
        <div class="page-title-box">
            <h4 class="page-title">文件</h4>
            <ol class="breadcrumb">
                <li>
                    <a href="${pageContext.request.contextPath}/sites/">起步</a>
                </li>
                <li>
                    <a href="#">修改</a>
                </li>

                <li class="active">
                    文件
                </li>
            </ol>
            <div class="clearfix"></div>
        </div>
        <div class="col-md-12">

            <div class="white-box">

                <div class="text-center p-md-2">
                    <h3 class="mb-0">文件修改</h3>
                    <small></small>
                </div>

                <div class="mt-4">
                    <form action="/file/modify/${file.id}&${file.fileType}" class="col-md-8 mx-auto" method="post">
                        <div class="form-group">
                            <label for="siteName">名称：</label>
                            <input id="siteName" type="text" class="form-control " name="fileName" value=${file.fileName}>
                            <small class="form-text text-muted">起个好听的名字啦！</small>
                        </div>
                        <div class="form-group">
                            <label for="">描述：</label>
                            <textarea name="fileDescription" id="" cols="30" rows="8" class="form-control " >${file.fileDescription}</textarea>
                            <small class="form-text text-muted">不要忘记它的用途哦！</small>
                        </div>
                        <div class="form-group text-center">
                            <input type="submit" value="确定" class="btn btn-primary">
                        </div>
                    </form>
                </div>

            </div>
        </div>




    </div>
</div>

<%@include file="../public/end.jsp"%>
</body>
</html>
