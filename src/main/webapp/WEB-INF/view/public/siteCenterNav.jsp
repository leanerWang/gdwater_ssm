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
    <title>场地管理中央导航条</title>
</head>
<body>

<nav class="navbar navbar-expand-sm navbar-light bg-light xl-center-nav">
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
            <li class="nav-item ">
                <a class="nav-link" href="${pageContext.request.contextPath}/sites/findSites">查询场地</a>
            </li>

            <li class="nav-item ">
                <a class="nav-link" href="c">新建场地</a>
            </li>

            <li class="nav-item ">
                <a class="nav-link" href="${pageContext.request.contextPath}/param/addParam">添加参数</a>
            </li>

            <li class="nav-item ">
                <a class="nav-link" href="${pageContext.request.contextPath}/param/findWater">查询参数</a>
            </li>

        </ul>
    </div>
</nav>
</body>
</html>
