<%@ page import="java.util.Date" %><%--
  Created by IntelliJ IDEA.
  User: WIN10
  Date: 2021/4/20
  Time: 15:16
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" isELIgnored="false" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>场地管理</title>
</head>

<body>
    <%@include file="../public/header.jsp"%>

<div class="container-fluid">
    <div class="row">
        <%@include file="../public/leftNav.jsp"%>
        <div class="center-content col-md-9 col-xl-10 py-md-3 pl-md-5">
            <%@include file="../public/fileCenterNav.jsp"%>
        </div>
    </div>
</div>


</body>

</html>
