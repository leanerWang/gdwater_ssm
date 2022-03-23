


    let siteProp = localStorage.getItem("fileProp");
    let urls = JSON.parse(siteProp);
    var imgUrl = urls.imgUrl;
    var  demUrl = urls.demUrl;


    //河海影像
    var hhuImg = new Cesium.UrlTemplateImageryProvider({
        url:imgUrl+"/{z}/{x}/{y}.png"
    });

//河海地形
    var hhuDem_fill = new Cesium.CesiumTerrainProvider({
        url: demUrl
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



function load() {

    // 请求坐标数据
    $.ajax({
        type: "GET",
        url: imgUrl+"/meta.json",
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