
//河海影像
var hhuImg = new Cesium.UrlTemplateImageryProvider({
    url:$("#imgUrl").text()+"/{z}/{x}/{y}.png"
});

//河海地形
var hhuDem_fill = new Cesium.CesiumTerrainProvider({
    url: $("#demUrl").text()
});

var viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: hhuImg,
    terrainProvider: hhuDem_fill,
    shouldAnimate: true,
    baseLayerPicker: false,
    selectionIndicator: false, //删除选中提示框
    infoBox: false,
    animation:false,
    timeline:false,
});

var scene = viewer.scene;
var globe = scene.globe;
var camera = viewer.camera;
var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas); //开启事件


function load() {

   // 请求坐标数据
    $.ajax({
        type: "GET",
        url: $("#imgUrl").text()+"/meta.json",
        dataType: "json",
        success: function (response) {
            let boundArrs = response.bounds;
            viewer.camera.setView({
                destination: Cesium.Rectangle.fromDegrees(boundArrs.west,boundArrs.south,boundArrs.east,boundArrs.north)
            });
        }
    });

};

globe.baseColor = Cesium.Color.BLACK; //变黑
scene.screenSpaceCameraController.enableCollisionDetection = false; //相机对地形的碰撞检测