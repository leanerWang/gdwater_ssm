<%--
  Created by IntelliJ IDEA.
  User: WIN10
  Date: 2021/4/17
  Time: 20:37
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户管理界面</title>
</head>

<body>
    <%@include file="../public/leftNav.jsp"%>

    <div class="main-content" >
        <%@include file="../public/header.jsp"%>

        <!--body wrapper start-->
        <div class="wrapper" style="min-height: 710px;">
            <!--Start Page Title-->
            <div class="page-title-box">
                <h4 class="page-title">起步</h4>
                <ol class="breadcrumb">
                    <li class="active">
                        起步
                    </li>
                </ol>
                <div class="clearfix"></div>
            </div>

            <div class="row">
                <div class="panel-wrap">
                    <div class="col-md-6">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title">surface pollution</h3>
                            </div>
                            <div class="panel-body">
                                <img width="100%" src="/images/pollution/surface-p1.png" alt="">
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title">soil pollution</h3>
                            </div>
                            <div class="panel-body">
                                <img width="100%" src="/images/pollution/soil-p1.png" alt="">
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
