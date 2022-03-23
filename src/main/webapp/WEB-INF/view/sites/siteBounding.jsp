<%--
  Created by IntelliJ IDEA.
  User: WIN10
  Date: 2021/9/28
  Time: 19:49
  To change this template use File | Settings | File Templates.
  场地参数数据提交页面
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <title>场地边界点</title>
    <style>
        #param-form{
            counter-reset: chapter;

        }
        #param-form [role = 'id'] span::after{
            counter-increment: chapter;
            content: counter(chapter);
        }
    </style>
</head>
<body>
<%@include file="../public/leftNav.jsp"%>

<div class="main-content" >
    <%@include file="../public/header.jsp"%>

    <!--body wrapper start-->
    <div class="wrapper xl-wrapper-height">
        <!--Start Page Title-->
        <div class="page-title-box">
            <h4 class="page-title">边界点</h4>
            <ol class="breadcrumb">
                <li>
                    <a href="${pageContext.request.contextPath}/sites/">起步</a>
                </li>
                <li>
                    <a href="#">场地</a>
                </li>
                <li class="active">
                    边界点
                </li>
            </ol>
            <div class="clearfix"></div>
        </div>

        <div class="col-md-12">
            <div class="white-box">
                <h2 class="header-title">场地边界点</h2>

                <div class="col-md-offset-11">
                    <button type="button" class="btn btn-success outline-btn" onclick="addFormRow()">
                            <span class="center-block"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                            fill="currentColor" class="bi bi-plus-square-fill" viewBox="0 0 16 16">
                                    <path
                                            d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z" />
                                </svg></span>
                        <span>添加</span>
                    </button>
                </div>

                <form class="" id="param-form" action="${pageContext.request.contextPath}/sites/boundingPoints/add"
                      method="post" enctype="multipart/form-data">
                    <div class="row xl-title-margin">
                        <label class="col-md-1">场地名称</label>
                        <div class="col-md-3">
                            <input type="text" class="xl-form-control" name="siteName">
                        </div>
                    </div>
                    <div class="row">
                        <label class="col-md-1">序号</label>
                        <label class="col-md-2">点名</label>
                        <label class="col-md-2">经度</label>
                        <label class="col-md-2">纬度</label>
                    </div>
                    <c:forEach var="i" begin="1" end="10">
                        <div class="row m-b-10">
                            <div class="col-md-1" role="id">
                                <span class=""></span>
                            </div>
                            <div class="col-md-3">
                                <input type="text" class="xl-form-control" name="pointName">
                            </div>
                            <div class="col-md-3">
                                <input type="text" class="xl-form-control" name="longitude">
                            </div>
                            <div class="col-md-3">
                                <input type="text" class="xl-form-control" name="latitude">
                            </div>
                            <div class="col-md-2">
                                <button type="button" class="btn btn-danger outline-btn btn-sm" onclick="removeFormRow(this)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         class="bi bi-dash-square xl-svg-center" viewBox="0 0 16 16">
                                        <path
                                                d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                                    </svg>
                                    <span class="xl-svg-center">删除</span>
                                </button>
                            </div>
                        </div>
                    </c:forEach>
                </form>
                <div class="text-center">
                    <button type="submit" class="btn btn-primary " onclick="commit()">提交</button>
                </div>
            </div>
        </div>

    </div>
</div>

<%@include file="../public/end.jsp"%>

<script>
    function addFormRow(){
        let formRow = `  <div class="row m-b-10">
                            <div class="col-md-1" role="id">
                                <span class=""></span>
                            </div>
                            <div class="col-md-3">
                                <input type="text" class="xl-form-control" name="pointName">
                            </div>
                            <div class="col-md-3">
                                <input type="text" class="xl-form-control" name="longitude">
                            </div>
                            <div class="col-md-3">
                                <input type="text" class="xl-form-control" name="latitude">
                            </div>
                            <div class="col-md-2">
                                <button type="button" class="btn btn-danger outline-btn btn-sm" onclick="removeFormRow(this)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         class="bi bi-dash-square xl-svg-center" viewBox="0 0 16 16">
                                        <path
                                                d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                                    </svg>
                                    <span class="xl-svg-center">删除</span>
                                </button>
                            </div>
                        </div>`

        $('#param-form').append(formRow)
    }

    function removeFormRow(dom){
        let fatherNode = dom.parentNode.parentNode
        let nodeClass = fatherNode.getAttribute('class')
        if (nodeClass === 'row m-b-10') {
            fatherNode.parentNode.removeChild(fatherNode)
        }
    }

    function commit(){
        document.getElementById("param-form").submit()
    }

</script>

</body>
</html>
