<%@ page import="cn.xin.domain.user.WaterUser" %>
<%@ page import="com.alibaba.fastjson.JSON" %>
<%@ page import="com.google.api.client.json.Json" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="cn.xin.utils.webUtil.WebUtil" %><%--
  Created by IntelliJ IDEA.
  User: WIN10
  Date: 2020/11/19
  Time: 19:25
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java"  %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>头部</title>

</head>

<body>
<%
    //判断登陆。
    WaterUser user = WebUtil.getLoginState(request, "user", "user");
    assert user != null;
    String username = user.getUsername();
    pageContext.setAttribute("username",username);
%>

<div class="header-section">

    <a class="toggle-btn"><i class="fa fa-bars"></i></a>

    <form class="searchform">
        <input type="text" class="form-control" name="keyword" placeholder="Search here..." />
    </form>

    <!--notification menu start -->
    <div class="menu-right">
        <ul class="notification-menu">
            <li>

                <c:if test="${username != null}" var="c" >
                    <a href="#" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                        <img src="/images/users/user-1.jpg" alt="" />
                        <%out.print(username);%>
                        <span class="caret"></span>
                    </a>
                </c:if>
                <c:if test="${username == null}" var="c" >
                    <a href="#" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                        <img src="/images/users/user-1.jpg" alt="" />
                        游客
                        <span class="caret"></span>
                    </a>
                </c:if>

                <ul class="dropdown-menu dropdown-menu-usermenu pull-right">
                    <li> <a href="#"> <i class="fa fa-wrench"></i> Settings </a> </li>
                    <li> <a href="#"> <i class="fa fa-user"></i> Profile </a> </li>
                    <li> <a href="#"> <i class="fa fa-info"></i> Help </a> </li>
                    <li> <a href="#"> <i class="fa fa-lock"></i> Logout </a> </li>
                </ul>
            </li>

        </ul>
    </div>
    <!--notification menu end -->

</div>


</body>

</html>
