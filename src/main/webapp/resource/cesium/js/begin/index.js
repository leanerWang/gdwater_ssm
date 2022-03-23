
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YTExZjgxNC1iMTI2LTQ3OTEtYWE1NS05NmFmZTdlMWQ5MDciLCJpZCI6MzI1MjYsImlhdCI6MTYwMTYyNjkyMX0.WipE3GFstF4z482DCbLHEDF8c8RGfwKGCwrU4_9gFJk';


// 谷歌影像
var ggImagery = new Cesium.UrlTemplateImageryProvider({
    url: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali"
});

//bing地图
var bingMap = new Cesium.IonImageryProvider({
    assetId: 2
});

//河海影像
var hhuImg = new Cesium.UrlTemplateImageryProvider({
    //url:$("#imgUrl").text()+"/{z}/{x}/{y}.png"
    url: "http://127.0.0.1:5500/resource/hhu_img2/{z}/{x}/{y}.png"
});

//河海地形
var hhuDem_fill = new Cesium.CesiumTerrainProvider({
    url: "http://127.0.0.1:5500/resource/finallyout3857"
    //url: $("#demUrl").text()
});

var viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: false,
    shouldAnimate: true,
    baseLayerPicker: false,
    selectionIndicator: false, //删除选中提示框
    infoBox: false,
    animation:false,
    timeline:false,
});
var imagerylayerCollections = viewer.scene.imageryLayers;
var hhuImgLayer = imagerylayerCollections.addImageryProvider(hhuImg);
//imagerylayerCollections.raiseToTop(hhuImgLayer);

var scene = viewer.scene;
var globe = scene.globe;
var camera = viewer.camera;
var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas); //开启事件
 //viewer.terrainProvider = hhuDem; //加载地形
viewer.terrainProvider = hhuDem_fill; //加载地形

//影像矩形
var ModelObject = {
    lon1: 118.774051666259766,
    lat1: 31.909913158302139,
    lon2: 118.791561126708984,
    lat2: 31.921570015932399,
    left_buttom: {
        x: 13221866.950941843900,
        y: 3751491.129722262270
    },
    left_top: {
        x: 13221866.950941843900,
        y: 3753019.870287965980
    },
    right_buttom: {
        x: 13223816.095163114400,
        y: 3751491.129722262270
    },

    //计算土壤模型位置
    computerBoxPosition: function () {

        let rectangle = Cesium.Rectangle.fromDegrees(this.lon1, this.lat1, this.lon2, this.lat2);

        //加载土壤模型
        let centerLon = (this.lon1 + this.lon2) * 0.5;
        let centerLat = (this.lat1 + this.lat2) * 0.5;
        let box_length = Math.abs(this.left_buttom.x - this.right_buttom.x);
        let box_width = Math.abs(this.left_buttom.y - this.left_top.y);
        let trBoxPosition = Cesium.Cartesian3.fromDegrees(centerLon, centerLat);

        let boxModel = [trBoxPosition, box_length, box_width, rectangle];
        return boxModel;
    }
}


var boxModel = ModelObject.computerBoxPosition();


function load() {
    viewer.camera.setView({
        destination: boxModel[3]
    });
    //请求坐标数据
    // $.ajax({
    //     type: "GET",
    //     url: $("#imgUrl").text()+"/meta.json",
    //     dataType: "json",
    //     success: function (response) {
    //         let boundArrs = response.bounds;
    //         viewer.camera.setView({
    //             destination: Cesium.Rectangle.fromDegrees(boundArrs.west,boundArrs.south,boundArrs.east,boundArrs.north)
    //         });
    //     }
    // });

};

globe.baseColor = Cesium.Color.BLACK; //变黑
scene.screenSpaceCameraController.enableCollisionDetection = false; //相机对地形的碰撞检测