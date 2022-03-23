<%--
  Created by IntelliJ IDEA.
  User: WIN10
  Date: 2021/6/15
  Time: 21:34
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>新建场地</title>
</head>
<body>
    <%@include file="../public/leftNav.jsp"%>

<div class="main-content" >
    <%@include file="../public/header.jsp"%>

        <!--body wrapper start-->
        <div class="wrapper xl-wrapper-height">
            <!--Start Page Title-->
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
                        新建场地
                    </li>
                </ol>
                <div class="clearfix"></div>
            </div>

            <div class="col-md-12">

                <div class="white-box xl-full-height">
                    <form class="form-horizontal" action="${pageContext.request.contextPath}/sites/commit"
                          method="post" enctype="multipart/form-data">
                        <div class="col-md-6">
                            <h2 class="header-title">场地服务</h2>
                            <div class="form-group">
                                <label class="col-md-3 control-label">名称</label>
                                <div class="col-md-6">
                                    <input type="text" name="siteName" class="form-control">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label">描述</label>
                                <div class="col-md-6">
                                    <textarea class="form-control" name="siteDescription" rows="3"></textarea>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label">影像</label>
                                <div class="col-md-6">
                                    <select  class="form-control"  name="imgId">
                                        <c:forEach varStatus="v" var="c" step="1" begin="0" items="${imgFiles}">
                                            <c:if test="${v.count == 1}">
                                                <option selected value="${c.id}">${c.fileName}</option>
                                            </c:if>
                                            <c:if test="${v.count > 1}">
                                                <option value="${c.id}">${c.fileName}</option>
                                            </c:if>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label">地形</label>
                                <div class="col-md-6">
                                    <select name="demId" class="form-control">
                                        <c:forEach varStatus="v" var="c" step="1" begin="0" items="${demFiles}">
                                            <c:if test="${v.count == 1}">
                                                <option selected value="${c.id}">${c.fileName}</option>
                                            </c:if>
                                            <c:if test="${v.count > 1}">
                                                <option value="${c.id}">${c.fileName}</option>
                                            </c:if>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <h2 class="header-title">参数</h2>
                            <div class="form-group">
                                <label class="col-md-3 control-label">边界点</label>
                                <div class="col-md-6">
                                    <select name="boundingName"  class="form-control">
                                        <c:forEach varStatus="v" var="c" step="1" begin="0" items="${boundingPoints}">
                                            <c:if test="${v.count == 1}">
                                                <option selected value="${c.siteName}">${c.siteName}</option>
                                            </c:if>
                                            <c:if test="${v.count > 1}">
                                                <option value="${c.siteName}">${c.siteName}</option>
                                            </c:if>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label">地下水位</label>
                                <div class="col-md-6">
                                    <select name="gdwaterName"  class="form-control">
                                        <c:forEach varStatus="v" var="c" step="1" begin="0" items="${waterLevel}">
                                            <c:if test="${v.count == 1}">
                                                <option selected value="${c.name}">${c.name}</option>
                                            </c:if>
                                            <c:if test="${v.count > 1}">
                                                <option value="${c.name}">${c.name}</option>
                                            </c:if>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label">压力水头</label>
                                <div class="col-md-6">
                                    <select name="pressureName"  class="form-control">
                                        <option selected>1</option>
                                        <option >2</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label">土壤孔隙度</label>
                                <div class="col-md-6">
                                    <select name="porosityName"  class="form-control">
                                        <option selected>1</option>
                                        <option >2</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label">渗透系数</label>
                                <div class="col-md-6">
                                    <select name="permeabilityName" class="form-control">
                                        <option selected>1</option>
                                        <option >2</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="form-group text-center m-t-15">
                            <button type="submit" class="btn btn-primary">创建</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
</div>
    <%@include file="../public/end.jsp"%>
</body>

</html>
