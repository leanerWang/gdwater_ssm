<%--
  Created by IntelliJ IDEA.
  User: WIN10
  Date: 2021/10/15
  Time: 19:35
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <title>发布</title>
    <link href="/css/icons.css" rel="stylesheet">
</head>
<body>
<%@include file="../public/leftNav.jsp"%>

<div class="main-content" >
    <%@include file="../public/header.jsp"%>

    <div class="xl-my-wrapper" >
        <div class="page-title-box">
            <h4 class="page-title">新建场地</h4>
            <ol class="breadcrumb">
                <li>
                    <a href="${pageContext.request.contextPath}/sites/">起步</a>
                </li>
                <li>
                    <a href="#">场地</a>
                </li>
                <li class="active">
                    发布
                </li>
            </ol>
            <div class="clearfix"></div>
        </div>

        <div class="row">
            <c:forEach var="c" begin="0" items="${sites}" varStatus="siteStatus" >
                <div class="col-md-4">
                    <div class="card-profile2 " style="height: 360px">
                        <img src="/images/users/girl-1.jpg" class="profile-photo" alt="">
                        <h4>${c.siteName}</h4>
                        <p>${c.siteOwner}</p>
                        <p>${c.siteDescription}</p>
                        <ul class="profile-contact">
                            <li><i class="mdi mdi-alarm-multiple"></i>${c.siteDate}</li>
                        </ul>
                        <button onclick="findUrl(${c.id})" class="btn btn-primary">发布</button>
                    </div>
                </div>
            </c:forEach>
        </div>
    </div>

    <%@include file="../public/end.jsp"%>
</div>

<script>
    //查询url
    function findUrl(id){
        $.ajax({
            type: 'GET',
            datatype: 'json',
            url: '/sites/getSiteUrl/'+id,
            success: function (data) {
                localStorage.setItem("fileProp", JSON.stringify(data));
                location.href = "/cesium/html/loadingBox/loadingBox.html";
            },
            error: function (error) {
                console.log("获取经纬度失败！");
            }
        })
    }
</script>
</body>
</html>
