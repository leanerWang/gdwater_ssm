<%--
  Created by IntelliJ IDEA.
  User: WIN10
  Date: 2021/6/14
  Time: 17:47
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java"  isELIgnored="false" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html>
<head>
    <title>信息中转站</title>
</head>
<body>

<c:set var="now" value="<%=new java.util.Date()%>" />

<%@include file="../public/leftNav.jsp"%>

<div class="main-content" >
    <%@include file="../public/header.jsp"%>

    <!--body wrapper start-->
    <div class="wrapper" style="min-height: 710px;">
        <!--Start Page Title-->
        <div class="page-title-box">
            <h4 class="page-title">提示</h4>
            <ol class="breadcrumb">
                <li>
                    <a href="${pageContext.request.contextPath}/sites/">起步</a>
                </li>
                <li class="active">
                    提示
                </li>
            </ol>
            <div class="clearfix"></div>
        </div>

        <div class="col-md-12">

            <div class="white-box">
                <div class="container-fluid mt-md-4 bg-light h-75">
                    <div class="card mb-3 h-100 w-75 offset-md-1">
                        <div class="row no-gutters h-100" >

                            <div class="col-md-3">
                                <div class="card-body">
                                    <h5 class="card-title">提示信息</h5>
                                    <p class="card-text">${info.massage}</p>
                                    <c:if test="${info.linkAddress == null}" var="c">
                                        <a href="${pageContext.request.contextPath}/home" class="card-link">回到主页</a>
                                    </c:if>
                                    <c:if test="${info.linkAddress != null}" var="c">
                                        <a href="${info.linkAddress}" class="card-link">${info.linkName}</a>
                                    </c:if>
                                    <p class="card-text"><small class="text-muted"><fmt:formatDate value="${now}" type="time" /></small></p>
                                </div>
                            </div>

                            <div class="col-md-9 h-100" >
                                <img src="/images/girl.jpg" alt="帽子女孩..." class="xl-card-img">
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
</div>

<%@include file="../public/end.jsp"%>

</body>
</html>
