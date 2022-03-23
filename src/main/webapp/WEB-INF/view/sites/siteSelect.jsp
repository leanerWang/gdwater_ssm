<%--
  Created by IntelliJ IDEA.
  User: WIN10
  Date: 2021/4/26
  Time: 16:40
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <title>选择场地</title>

    <%@include file="../public/header.jsp"%>
    <%@include file="../public/leftNav.jsp"%>
    <link rel="stylesheet" href="/css/bootstrap-select.min.css">
    <script src="/js/bootstrap-select.min.js"></script>
</head>
<body>
<div class="center-content col-md-9 offset-md-3">
    <header class="container">
        <nav class="navbar navbar-expand-lg navbar-light " >
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item ">
                        <a class="btn btn-outline-primary" href="/sites/getAllSites">查询所有场地</a>
                    </li>
                    <li class="nav-item ">
                        <div class="dropdown">
                            <a class="btn btn-outline-primary dropdown-toggle" type="button"  data-toggle="dropdown"  >
                                添加场地
                            </a>
                            <div class="dropdown-menu" >
                                <a class="dropdown-item" href="/sites/addSite">单文件上传</a>
                                <a class="dropdown-item" href="/sites/addSiteMultiFile">文件夹上传</a>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="btn btn-outline-primary" href="/sites/test">删除场地</a>
                    </li>
                    <li class="nav-item">
                        <a class="btn btn-outline-primary" href="/sites/siteSelect">加载场地</a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>

    <main role="main" >
        <div class="container">
            <form action="" class="form-group-sm" method="POST" id="siteForm">
            <div class="row mt-5"><p class="lead text-md-center col-md-6" >文件选择</p></div>
            <div class="row" style="margin: 18px 0px;">
                <div class="col-md-4"><strong>影像文件：</strong></div>
                <div class="col-md-8">
                    <select class="selectpicker" data-size="5" name="imgName">
                        <c:forEach varStatus="v" var="c" step="1" begin="0" items="${allSites}">
                            <option>${c.siteName}</option>
                        </c:forEach>
                    </select>
                </div>
            </div>
            <div class="row" style="margin: 10px 0px;">
                <div class="col-md-4"><strong>地形文件：</strong></div>
                <div class="col-md-8">
                    <select class="selectpicker" data-size="5" name="demName">
                        <c:forEach varStatus="v" var="c" step="1" begin="0" items="${allSites}">
                            <option>${c.siteName}</option>
                        </c:forEach>
                    </select>
                </div>
            </div>
            <div class=" text-md-center col-md-6">
                <button type="submit" class="btn btn-primary" role="button" id="loadSite">提交</button>
            </div>
            </form>
        </div>
    </main>
</div>

<script>
   $("#loadSite").click(function (e) {
       e.preventDefault();
       $.ajax({
           type: 'POST',
           datatype: 'json',
           url: '/sites/getFileUrl',
           data: $("#siteForm").serialize(),
           success: function (data) {
                localStorage.setItem("fileProp", JSON.stringify(data));
                location.href = "/cesium/html/loadingBox/loadingBox.html";
                // location.href = "/cesium/html/tes1.html";
           },
           error: function (error) {
               console.log("获取经纬度失败！");
           }
       })
   })
</script>

</body>
</html>
