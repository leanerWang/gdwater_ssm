
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
    <title>场地参数</title>
</head>
<body>
<%@include file="../public/leftNav.jsp"%>

<div class="main-content" >
    <%@include file="../public/header.jsp"%>

    <!--body wrapper start-->
    <div class="wrapper xl-wrapper-height">
        <!--Start Page Title-->
        <div class="page-title-box">
            <h4 class="page-title">地下水</h4>
            <ol class="breadcrumb">
                <li>
                    <a href="${pageContext.request.contextPath}/sites/">起步</a>
                </li>
                <li>
                    <a href="#">查询</a>
                </li>
                <li class="active">
                    地下水
                </li>
            </ol>
            <div class="clearfix"></div>
        </div>

        <div class="col-md-6">
            <div class="white-box" style="min-height: 332px;">
                <h2 class="header-title">查询</h2>
                <form>
                    <div class="form-group">
                        <label>名称</label>
                        <select class="form-control" id="inputGroupSelect01">
                            <c:forEach var="c" items="${siteParams}">
                                <option>${c.name}</option>
                            </c:forEach>
                        </select>
                    </div>
                </form>
                    <div class="text-center">
                        <button class="btn btn-primary outline-btn" onclick="findWaterLevel()">查询</button>
                    </div>

            </div>
        </div>


        <div class="col-md-6">
            <div class="white-box">
                <h2 class="header-title">IDW（反距离权重插值）</h2>
                <form>
                    <div class="form-group">
                        <label>经度</label>
                        <input class="form-control" placeholder="Enter longitude" id="interpolation-longitude" name="interpolation-longitude">
                    </div>
                    <div class="form-group">
                        <label>纬度</label>
                        <input class="form-control" placeholder="Enter latitude" id="interpolation-latitude" name="interpolation-latitude">
                    </div>
                    <div class="form-group">
                        <label>水位</label>
                        <input class="form-control" placeholder="interpolation value" id="interpolation-level" name="interpolation-level">
                    </div>
                </form>
                    <div class="text-center">
                        <button class="btn btn-primary outline-btn" onclick="interpolation()">插值</button>
                    </div>

            </div>
        </div>

        <div class="col-md-12">
            <div class="white-box" style="min-height: 196px">
                <h2 class="header-title">查询结果</h2>

                <div class="table-wrap">
                    <table class="table table-bordered table-dark xl-table-color" id="table">
                        <thead>
                        <tr>
                            <th scope="col">序号</th>
                            <th scope="col">点名</th>
                            <th scope="col">经度</th>
                            <th scope="col">纬度</th>
                            <th scope="col">水位值</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>

                <div hidden id="dataJson"></div>
            </div>
        </div>

    </div>
</div>

<%@include file="../public/end.jsp"%>


<script>
<%--    查询特定所有水位值 并渲染--%>
 function findWaterLevel(){
    let name = $("#inputGroupSelect01").val()
    $.get("/param/findWaterLevels/"+name, function (data){
        if (data){
            let dataJson = JSON.parse(data)
            let tbody = $("#table tbody")
            tbody[0].innerHTML = ''
            for (let i = 0; i < dataJson.length; i++) {
                let trNode = ` <tr>
                            <th scope="row">\${i+1}</th>
                            <td>\${dataJson[i].pointName}</td>
                            <td>\${dataJson[i].longitude}</td>
                            <td>\${dataJson[i].latitude}</td>
                            <td>\${dataJson[i].level}</td>
                        </tr>`
                tbody.append(trNode)
            }
            $('#dataJson').innerText = dataJson
        }
    })
 }

 // 计算差值结果 IDM差值
 function interpolation(){
     let longitude = $('#interpolation-longitude').val()
     let latitude = $('#interpolation-latitude').val()
     let name = $("#inputGroupSelect01").val()

     $.ajax({
         type: "post",
         url: '/param/interpolation',
         data: JSON.stringify({
             'longitude':longitude,
             'latitude':latitude,
             'type':'groundwater',
             'name':name
         }),
         contentType:"json/application",
         charset:"utf-8",
         dataType: "json",
         scriptCharset: 'utf-8',
         success: function (data) {
             let dataJson = JSON.parse(JSON.stringify(data))
             $('#interpolation-level').val(dataJson.level)
         }
     })
 }

</script>

</body>
</html>
