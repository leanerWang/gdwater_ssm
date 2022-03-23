<%--
  Created by IntelliJ IDEA.
  User: WIN10
  Date: 2020/11/19
  Time: 18:53
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java"  %>
<html>
<head>
    <title>新建场地</title>
    <style>
        .description{
            height: 100px;
        }
    </style>


</head>
<body>
<%--引入页面框架--%>
<%@ include file="../public/header.jsp" %>

    <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
        <form class="">
            <div class="form-group">
                <label for="exampleInputEmail1">场地名称</label>
                <input class="form-control" id="exampleInputEmail1" >
            </div>
            <div class="form-group">
                <label for="description">场地描述</label>
                <input class="form-control" id="description" >
            </div>
            <div class="form-group">
                <label for="exampleInputFile">选择DOM数据</label><br>
                <input type="file" id="exampleInputFile">
            </div>
            <div class="form-group">
                <label for="demData">选择DEM数据</label><br>
                <input type="file" id="demData">
            </div>
            <div class="form-group">
                <input class="btn btn-primary" type="submit" value="提交">
            </div>

        </form>
    </main>
</body>
</html>
