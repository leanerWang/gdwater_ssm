<%--
  Created by IntelliJ IDEA.
  User: WIN10
  Date: 2021/6/13
  Time: 19:26
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>文件管理中央导航条</title>
</head>
<body>

<nav class="navbar navbar-expand-sm navbar-light bg-light xl-center-nav">
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
            <li class="nav-item ">
                <div class="dropdown">
                    <a class="nav-link dropdown-toggle" role="button" data-toggle="dropdown"
                       id="find">
                        文件查询
                    </a>
                    <div class="dropdown-menu xl-find-menu" aria-labelledby="find">
                        <a class="dropdown-item" href="${pageContext.request.contextPath}/file/findImages">查询影像文件</a>
                        <a class="dropdown-item" href="${pageContext.request.contextPath}/file/findDems">查询地形文件</a>
                        <a class="dropdown-item" href="${pageContext.request.contextPath}/file/findCommons">查询普通文件</a>
                    </div>
                </div>

            </li>
            <li class="nav-item ">
                <div class="dropdown">
                    <a class="nav-link dropdown-toggle" role="button" data-toggle="dropdown"
                       id="navbarDropdownMenuLink">
                        文件上传
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <a class="dropdown-item" href="${pageContext.request.contextPath}/file/addFile">普通文件上传</a>
                        <a class="dropdown-item" href="${pageContext.request.contextPath}/file/addMultiFile">影像地形文件上传</a>
                    </div>
                </div>
            </li>
        </ul>
    </div>

</nav>
</body>
</html>
