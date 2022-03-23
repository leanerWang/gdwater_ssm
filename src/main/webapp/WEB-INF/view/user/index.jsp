
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"  isELIgnored="false" %>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">
    <meta name="generator" content="Jekyll v4.0.1">
    <title>用户后台</title>


    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <style>
      .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      @media (min-width: 768px) {
        .bd-placeholder-img-lg {
          font-size: 3.5rem;
        }
      }
    </style>
    <!-- Custom styles for this template -->
<%--    <link href="css/dashboard.css" rel="stylesheet">--%>
  </head>
  <body>

  <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Navbar</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                  <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="#">Link</a>
              </li>
              <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Dropdown
                  </a>
                  <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                      <a class="dropdown-item" href="#">Action</a>
                      <a class="dropdown-item" href="#">Another action</a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="#">Something else here</a>
                  </div>
              </li>
              <li class="nav-item">
                  <a class="nav-link disabled" href="#">Disabled</a>
              </li>
          </ul>

          <a class="nav-link btn btn-light" href="#">登陆</a>
      </div>
  </nav>

<%--    页面左侧导航条--%>


<%-- 右侧页面内容 --%>
    <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
      <div class="table-responsive">
        <table class="table table-striped table-sm">

<%--          跳转新建场地页面--%>
          <a href="new" type="button" class="btn btn-success">新建场地</a>

          <a href="sites/all" type="button" class="btn btn-success">所有文件</a>

          <thead>
            <tr>
              <th>编号</th>
              <th>场地名</th>
              <th>操作</th>

            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1,001</td>
              <td>Lorem</td>
              <td>
                  <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-secondary">修改</button>
                    <button type="button" class="btn btn-secondary">删除</button>
                    <a href="#" type="button" class="btn btn-secondary">模拟</a>
                  </div>
              </td>
            </tr>
          </tbody>

        </table>


      </div>
    </main>

  </body>
</html>
