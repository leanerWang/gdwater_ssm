<%--
  Created by IntelliJ IDEA.
  User: WIN10
  Date: 2021/4/20
  Time: 15:54
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html lang="en">

<head>
    <title>左侧导航条</title>

    <link href="/css/icons.css" rel="stylesheet">
    <link href="/css/bootstrap.min.css" rel="stylesheet">
    <link href="/css/style.css" rel="stylesheet">
    <link href="/css/responsive.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->

    <link rel="stylesheet" href="/css/xlMain.css">

</head>

<body>

<div class="left-side sticky-left-side">
    <!--logo-->
    <div class="logo">
        <a href="${pageContext.request.contextPath}/home/"><img class="xl-logo" src="/images/logo.png" alt=""></a>
    </div>

<%--    <div class="logo-icon text-center">--%>
<%--        <a href="${pageContext.request.contextPath}/home/"><img src="/images/logo-icon.png" alt=""></a>--%>
<%--    </div>--%>
    <!--logo-->

    <div class="left-side-inner">
        <!--Sidebar nav-->
        <ul class="nav nav-pills nav-stacked custom-nav">
            <li><a href="${pageContext.request.contextPath}/sites/"><i class="icon-home"></i> <span>起步</span></a></li>

            <li class="menu-list"><a href=""><i class="icon-layers"></i> <span>上传</span></a>
                <ul class="sub-menu-list">
                    <li><a href="${pageContext.request.contextPath}/file/addFile">文件</a></li>
                    <li ><a href="${pageContext.request.contextPath}/file/addMultiFile">文件夹</a></li>
                    <li ><a href="${pageContext.request.contextPath}/file/addZip">压缩包</a></li>
                </ul>
            </li>

            <li class="menu-list"><a href=""><i class="icon-grid"></i> <span>管理</span></a>
                <ul class="sub-menu-list">
                    <li><a href="${pageContext.request.contextPath}/file/findCommons">文件</a></li>
                    <li><a href="${pageContext.request.contextPath}/file/findImages">影像</a></li>
                    <li><a href="${pageContext.request.contextPath}/file/findDems">地形</a></li>
                    <li><a href="${pageContext.request.contextPath}/sites/findSites">场地</a></li>
                    <li><a href="${pageContext.request.contextPath}/param/findWater">地下水</a></li>
                </ul>
            </li>

            <li class="menu-list"><a href=""><i class="icon-loop"></i> <span>采样点</span></a>
                <ul class="sub-menu-list">
                    <li><a href="${pageContext.request.contextPath}/param/addParam">地下水位</a></li>
                    <li><a href="">土壤孔隙度</a></li>
                    <li ><a href="">渗透系数</a></li>
                    <li><a href="">压力水头</a></li>
                </ul>
            </li>

            <li class="menu-list"><a href=""><i class="icon-envelope-open"></i> <span>场地</span></a>
                <ul class="sub-menu-list">
                    <li><a href="${pageContext.request.contextPath}/sites/boundingPoints">边界点</a></li>
                    <li><a href="${pageContext.request.contextPath}/sites/new">新建</a></li>
                    <li> <a href="${pageContext.request.contextPath}/sites/release">发布</a></li>
                </ul>
            </li>

        </ul>
        <!--End sidebar nav-->

    </div>
</div>

</body>
</html>


