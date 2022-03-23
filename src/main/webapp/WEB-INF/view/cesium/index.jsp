<%--
  Created by IntelliJ IDEA.
  User: WIN10
  Date: 2021/4/26
  Time: 16:08
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java"  isELIgnored="false" %>
<html>
<head>
    <title>影像加载</title>
    <script src="/cesium/Cesium/Cesium.js"></script>
    <script src="/cesium/js/source/Sandcastle-header.js"></script>
    <script src="/js/jquery-3.6.0.min.js"></script>
    <link href="/cesium/Cesium/Widgets/widgets.css" rel="stylesheet">
    <style>
        @import url(/cesium/css/bucket.css);

        #toolbar {
            background: rgba(42, 42, 42, 0.8);
            padding: 4px;
            border-radius: 4px;
        }

        #toolbar table tr {
            transform: translateY(0);
            transition: transform 0.4s ease-out;
        }

        #toolbar input {
            vertical-align: middle;
            padding-top: 2px;
            padding-bottom: 2px;
        }
    </style>
</head>
<body>

<div id="cesiumContainer" class="fullSize"></div>
<div id="toolbar">
    <table>
        <tr>
            <td>相机</td>
            <td>
                <button onclick="load()" class="cesium-button">定位</button>
            </td>
        </tr>
    </table>
</div>

<div hidden>
    <div id="imgUrl">${imgUrl}</div>
    <div id="demUrl">${demUrl}</div>
</div>

</body>
<script src="/cesium/js/test/index.js"></script>
<%--tmd为什么我直接在这写就加载不出来，还报错，east找不到，有毒。。。--%>
<%--<script>--%>
<%--    var hhuImg = new Cesium.CesiumTerrainProvider({--%>
<%--        url: $("#imgUrl").text()+"/{z}/{x}/{y}.png"--%>
<%--    });--%>

<%--    //河海地形--%>
<%--    var hhuDem_fill = new Cesium.CesiumTerrainProvider({--%>
<%--        url: $("#demUrl").text()--%>
<%--    });--%>
<%--    var viewer = new Cesium.Viewer('cesiumContainer',{--%>
<%--        imageryProvider: hhuImg,--%>
<%--        baseLayerPicker: false,--%>
<%--        animation:false,--%>
<%--        timeline:false,--%>
<%--    });--%>
<%--    viewer._cesiumWidget._creditContainer.style.display="none";   //版权控件的显示隐藏--%>
<%--    var scene = viewer.scene;--%>
<%--    scene.globe.baseColor = Cesium.Color.BLACK;--%>
<%--    viewer.terrainProvider = hhuDem_fill;--%>

<%--    let lon1 = 118.774051666259766;--%>
<%--    let lat1 = 31.909913158302139;--%>
<%--    let lon2 = 118.791561126708984;--%>
<%--    let lat2 = 31.921570015932399;--%>
<%--    let rectangle = Cesium.Rectangle.fromDegrees(lon1, lat1, lon2, lat2);--%>
<%--    function load() {--%>
<%--        viewer.camera.setView({--%>
<%--            destination: rectangle--%>
<%--        });--%>
<%--    }--%>

<%--</script>--%>
</html>
