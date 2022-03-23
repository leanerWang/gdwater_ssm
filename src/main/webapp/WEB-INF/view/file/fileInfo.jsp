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
    <link href="/css/xlMain.css" rel="stylesheet">
    <title>文件信息</title>
</head>

<body>
<%@include file="../public/leftNav.jsp"%>

<div class="main-content" >
    <%@include file="../public/header.jsp"%>

        <!--body wrapper start-->
        <div class="wrapper">

            <!--Start Page Title-->
            <div class="page-title-box">
                <h4 class="page-title">文件信息</h4>
                <ol class="breadcrumb">
                    <li>
                        <a href="${pageContext.request.contextPath}/sites/">起步</a>
                    </li>
                    <li>
                        <a href="#">查询</a>
                    </li>

                    <li class="active">
                        信息
                    </li>
                </ol>
                <div class="clearfix"></div>
            </div>

            <div class="col-md-12">

                <div class="white-box">
                    <h2 class="header-title">查询文件</h2>

                    <div class="container-fluid mt-md-4 h-75 bg-light">

                        <div class="text-center xl-title-margin">
                            <h3 class="mb-0">文件信息</h3>
                            <small>（点击文件查看详情）</small>
                        </div>

                        <div class="list-group list-group-flush">
                            <div class="list-group-item bg-secondary ">
                                <div class=" row xl-font-header">
                                    <p class="h5 col-md-4 align-self-center" >序号</p>
                                    <p class="h5 col-md-4 align-self-center ">名称</p>
                                    <p class="h5 col-md-4 align-self-center">修改日期</p>
                                </div>
                            </div>

                        <c:forEach items="${files}" begin="0" step="1" var="c" varStatus="siteStatus" >
                            <a href="#" class="list-group-item list-group-item-action " data-toggle="modal"
                               data-target="#modalInfo${siteStatus.count}">
                                <div class="row justify-content-between">
                                    <div class="col-md-4 align-self-center">${siteStatus.count}</div>
                                    <div class="col-md-4 align-self-center">${c.fileName}</div>
                                    <div class="col-md-4 align-self-center"><fmt:formatDate value="${c.fileDate}" pattern="yyyy-MM-dd HH:mm:ss" /></div>
                                </div>
                            </a>
                        </c:forEach >

                        <c:forEach items="${files}" begin="0" step="1" var="c" varStatus="siteStatus" >
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
                                            <a type="button" class="btn btn-primary" href="/file/delete/${c.id}/${c.fileType}">确认</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="modal" id="modalInfo${siteStatus.count}" aria-labelledby="titleLable" aria-haspopup="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="titleLabel">文件详情</h5>
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
                                                <div class="col-md-8"><p>${c.fileName}</p></div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-4"><p><strong>日期：</strong></p></div>
                                                <div class="col-md-8"><p><fmt:formatDate value="${c.fileDate}" pattern="yyyy-MM-dd HH:mm:ss" /></p></div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-4"><p><strong>描述：</strong></p></div>
                                                <div class="col-md-8"><p>${c.fileDescription}</p></div>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
                                            <a type="button" class="btn btn-warning" href="/file/modify/${c.id}&${c.fileType}">修改</a>
                                            <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#delAlert${c.id}" id="delBtn"
                                                    onclick="hideModal('#modalInfo${siteStatus.count}')">删除
                                            </button>
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

<%--信息提示框--%>
<c:if test="${param.delSuccess == true}">
    <c:set var="now" value="<%=new java.util.Date()%>" />
<div class="position-fixed bottom-0 right-0 p-3" style="z-index: 5; right: 0; bottom: 0;">
    <div id="liveToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-delay="3000">
        <div class="toast-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-check" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
            </svg>
            <strong class="mr-auto ml-1">提示</strong>
            <small class="ml-1 mr-0"><fmt:formatDate value="${now}" type="time" /></small>
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="toast-body">
            删除成功！
        </div>
    </div>
</div>
</c:if>

<%@include file="../public/end.jsp"%>


        <script>

            //显示删除成功信息
            $('#liveToast').toast('show');

            $("dropdown-toggle").dropdown();

            //模态框
            function hideModal(id){
                $(id).modal("hide");
            }

        </script>

</body>


</html>
