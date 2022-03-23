
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="en">

  <head>
    <title>首页</title>
    <link href="/css/origin/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/css/xlMain.css">
  </head>

  <body>

  <nav class="navbar navbar-expand-md navbar-light sticky-top xl-header-nav" role="navigation">
    <a class="navbar-brand" href="${pageContext.request.contextPath}/home/">
            <span class="xl-header-link">
                场地污染扩散三维仿真
            </span>
    </a>
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav ">
        <li class="nav-item ">
          <a class="xl-li-link" href="${pageContext.request.contextPath}/home/">首页</a>
        </li>
        <li class="nav-item ">
          <a class="xl-li-link" href="${pageContext.request.contextPath}/sites/">可视化模拟</a>
        </li>
      </ul>
    </div>
  </nav>

    <div class="container-fluid">
      <div class="row xl-home-header">
        <div class="col-md-8 p-0">
          <img src="/images/earth.png" class="img-fluid xl-home-image " alt="地球">
        </div>
        <div class="col-md-4 xl-home-content">

          <div class="pb-4">
            <h1 class="mb-4" style="color: #fff">场地污染扩散三维可视化模拟平台</h1>
            <p>
              可视化模拟场地三维空间中污染物随时间的迁移过程，为污染修复决策提供支持。
            </p>
          </div>

          <div class="pt-4">
            <p class="lead">可视化支持</p>
            <ul class="list-inline">
              <li class="list-inline-item"><a href="https://cesium.com/" class="xl-header-link"> Cesium</a>
              </li>
              <li class="list-inline-item"><a href="http://www.cesiumlab.com/" class="xl-header-link">
                Cesiumlab</a></li>
              <li class="list-inline-item"><a href="https://echarts.apache.org/" class="xl-header-link">
                Echart</a></li>
            </ul>
          </div>

          <div class="mt-4" style="margin-left: -3px;">
            <a type="button" href="${pageContext.request.contextPath}/sites/" class="btn btn-primary btn-lg">Start</a>
          </div>

        </div>
      </div>

      <div class="row xl-home-buttom"></div>

      <div class="xl-home-second">
        <header class="text-center">
          <h1 class="mb-4">可视化模拟</h1>
          <p>展示了污染物扩散模拟的部分可视化效果图。</p>
        </header>
        <div class="row xl-home-card">
          <div class="col-md-6 w-100">
            <img src="/images/vadose_color.png" class="card-img" alt="颜色渐变图">
          </div>
          <div class="col-md-6">
            <h5 class="card-title">颜色渐变</h5>
            <p class="card-text">模拟污染物在土壤中的扩散效果，颜色越深，污染物浓度越高。</p>
            <p class="card-text">2021年6月23日</p>
          </div>
        </div>

        <div class="row xl-home-card">
          <div class="col-md-6 w-100">
            <img src="/images/pollution.png" class="card-img " alt="污染物土壤扩散图">
          </div>
          <div class="col-md-6">
            <h5 class="card-title">三维图表</h5>
            <p class="card-text">Echart框架展示污染物浓度的三维分布范围，
              颜色最深的污染源处污染物浓度最高。</p>
            <p class="card-text">2021年6月23日</p>
          </div>
        </div>

        <div class="row xl-home-card">
          <div class="col-md-6 w-100">
            <img src="/images/grid.png" class="card-img" alt="三层网格图">
          </div>
          <div class="col-md-6">
            <h5 class="card-title">叠加展示</h5>
            <p class="card-text">影像、地形与地表、包气带、潜水面网格叠加，建立CA模型，
              模拟某地的污染物在三种地形中的扩散效果。</p>
            <p class="card-text">2021年6月23日</p>
          </div>
        </div>

      </div>

    </div>

    <div class=" xl-home-foot text-white">
      <div class="xl-home-center">
        <header class="text-center align-items-center">
          <h1>开始使用场地污染可视化模拟平台</h1>
        </header>
        <div class="text-center pt-2">
          <button class="btn btn-info btn-lg">   注册   </button>
        </div>
      </div>
    </div>

  </body>
</html>
