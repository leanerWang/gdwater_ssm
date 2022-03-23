<%--
  Created by IntelliJ IDEA.
  User: WIN10
  Date: 2021/6/17
  Time: 16:22
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>文件修改</title>
</head>
<body>
<%@include file="../public/leftNav.jsp"%>

<div class="main-content" >
    <%@include file="../public/header.jsp"%>

    <!--body wrapper start-->
    <div class="wrapper xl-wrapper-height">
        <div class="page-title-box">
            <h4 class="page-title">场地修改</h4>
            <ol class="breadcrumb">
                <li>
                    <a href="${pageContext.request.contextPath}/sites/">起步</a>
                </li>
                <li>
                    <a href="#">修改</a>
                </li>

                <li class="active">
                    场地
                </li>
            </ol>
            <div class="clearfix"></div>
        </div>
        <div class="col-md-12">

            <div class="white-box">

                <div class="container-fluid mt-md-4 bg-light pb-md-4">


                    <div class="mt-4">
                        <form action="${pageContext.request.contextPath}/sites/siteModify/${site.id}/${site.soilId}" class="col-md-9 mx-auto" method="post">
                            <div class="form-row">

                                <div class="form-group">
                                    <p class="lead text-center">场地服务</p>
                                </div>

                                <div class="form-group col-md-6">
                                    <label for="siteName">名称</label>
                                    <input id="siteName" type="text" class="form-control " name="siteName" value=${site.siteName}>
                                    <small class="form-text text-muted">起个好听的名字啦！</small>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="">描述</label>
                                    <textarea name="siteDescription" id="" cols="30" rows="3" class="form-control ">${site.siteDescription}</textarea>
                                    <small class="form-text text-muted">不要忘记它的用途哦！</small>
                                </div>
                                <div class="form-group col-md-6">
                                    <label >影像</label>
                                    <input type="text" class="form-control " name="imgName" disabled value=${img.fileName} >
                                </div>
                                <div class="form-group col-md-6">
                                    <label >地形</label>
                                    <input  type="text" class="form-control " name="demName" disabled value=${dem.fileName} >
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <p class="lead text-center">参数</p>
                                </div>
                                <div class="form-group col-md-4">
                                    <label >地下水位（米）</label>
                                    <input type="text" class="form-control" name="gdwaterName" value="${soil.gdwaterName}" disabled>
                                </div>
                                <div class="form-group col-md-4">
                                    <label >压力水头(米)</label>
                                    <input type="text" class="form-control" name="pressureName" value="${soil.pressureName}" disabled>
                                </div>
                                <div class="form-group col-md-4">
                                    <label for="porosity">孔隙度（百分比）</label>
                                    <input type="text" class="form-control" id="porosity" name="soilPorosity" value="${soil.porosityName}" disabled>
                                </div>
                                <div class="form-group col-md-4">
                                    <label for="permeability">渗透系数（米/小时）</label>
                                    <input id="permeability" class="form-control" name="soilPermeability" value="${soil.permeabilityName}" disabled>
                                </div>

                            </div>
                            <div class="form-group text-center">
                                <input type="submit" value="确定" class="btn btn-primary">
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>




    </div>
</div>

<%@include file="../public/end.jsp"%>
</body>
</html>
