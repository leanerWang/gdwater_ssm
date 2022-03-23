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
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>场地信息</title>
</head>

<body>
<%@include file="../public/leftNav.jsp"%>

<div class="main-content" >
    <%@include file="../public/header.jsp"%>

    <!--body wrapper start-->
    <div class="wrapper xl-wrapper-height">
        <!--Start Page Title-->
        <div class="page-title-box">
            <h4 class="page-title">场地信息</h4>
            <ol class="breadcrumb">
                <li>
                    <a href="${pageContext.request.contextPath}/sites/">起步</a>
                </li>
                <li>
                    <a href="#">查询</a>
                </li>
                <li class="active">
                    场地
                </li>
            </ol>
            <div class="clearfix"></div>
        </div>

        <div class="col-md-12">
            <div class="white-box xl-full-height" >
                <h2 class="header-title">查询场地</h2>

                <div class="text-center " style="margin-bottom: 15px;">
                    <h3 class="mb-0">场地信息</h3>
                    <small>（点击文件查看详情）</small>
                </div>
                    <div class="list-group list-group-flush">
                        <div class="list-group-item bg-secondary xl-site-header">
                            <div class=" row text-light">
                                <p class="h6 col-md-4 align-self-center">序号</p>
                                <p class="h6 col-md-4 align-self-center">名称</p>
                                <p class="h6 col-md-4 align-self-center">修改日期</p>
                            </div>
                        </div>

                        <c:forEach items="${sites}" begin="0" step="1" var="c" varStatus="siteStatus" >
                            <a href="#" class="list-group-item list-group-item-action " data-toggle="modal"
                               data-target="#modalInfo${siteStatus.count}">
                                <div class="row justify-content-between">
                                    <div class="col-md-4 align-self-center">${siteStatus.count}</div>
                                    <div class="col-md-4 align-self-center">${c.siteName}</div>
                                    <div class="col-md-4 align-self-center"><fmt:formatDate value="${c.siteDate}" pattern="yyyy-MM-dd HH:mm:ss" /></div>
                                </div>
                            </a>
                        </c:forEach >

                        <c:forEach items="${sites}" begin="0" step="1" var="c" varStatus="siteStatus" >
                            <div class="modal fade" id="delAlert${c.id}">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">警告</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <p class="lead">确认删除吗？</p>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <a type="button" class="btn btn-primary" href="/sites/siteDelete/${c.id}" onclick="">确认</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="modal" id="modalInfo${siteStatus.count}" aria-labelledby="titleLable" aria-haspopup="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="titleLable">场地详情</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <div class="row">
                                                <div class="col-md-4"><p><strong>编号：</strong></p></div>
                                                <div class="col-md-8"><p>${siteStatus.count}</p></div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-4"><p><strong>名称：</strong></p></div>
                                                <div class="col-md-8"><p>${c.siteName}</p></div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-4"><p><strong>日期：</strong></p></div>
                                                <div class="col-md-8"><p><fmt:formatDate value="${c.siteDate}" pattern="yyyy-MM-dd HH:mm:ss" /></p></div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-4"><p><strong>描述：</strong></p></div>
                                                <div class="col-md-8"><p>${c.siteDescription}</p></div>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-primary" onclick="findUrl(${c.id})">加载</button>
                                            <a type="button" class="btn btn-warning" href="/sites/siteModify/${c.id}">修改</a>
                                            <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#delAlert${c.id}" id="delBtn"
                                                    onclick="hideModal('#modalInfo${siteStatus.count}')">删除
                                            </button>
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </c:forEach >

                    </div>
                </div>
            </div>
        </div>

    </div>
</div>

<%@include file="../public/end.jsp"%>
</body>

<script>
    $("dropdown-toggle").dropdown();

    //模态框
    function hideModal(id){
        $(id).modal("hide");
    }

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

</html>
