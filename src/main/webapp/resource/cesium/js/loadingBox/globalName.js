

//获取影像URL
var serverUrls = undefined; //影像地形路径的JSON对象
(function (){
    var siteProp = localStorage.getItem("fileProp");
    serverUrls = JSON.parse(siteProp);
    if (serverUrls === undefined ) {
        throw new Error("无法获取到正确的影像地形路径地址...");
    }else{
        if (serverUrls.imgUrl == null || serverUrls.demUrl == null) {
            throw new Error("无法获取到正确的影像地形路径地址...");
        }
    }
})();

const XlGlobalProvider = {
    getImageryProviderArr: function () {
        return [
            new Cesium.ProviderViewModel({
                name: '我的地图',
                tooltip: '现发布的影像',
                iconUrl: '../../image/my-image.png',
                creationFunction: function () {
                    return new Cesium.UrlTemplateImageryProvider({
                        url: serverUrls.imgUrl+"/{z}/{x}/{y}.png"
                    });

                }
            }),
            new Cesium.ProviderViewModel({
                //图层的名称。
                name: '天地图影像',
                //显示项目被隐藏的工具提示
                tooltip: '天地图影像底图',
                //代表图层的图标
                iconUrl: '../../image/td-icon.jpg',
                //一个函数或命令，用于创建一个或多个提供程序，这些提供程序将在选择此项目时添加到地球仪中。
                creationFunction: function () {
                    return new Cesium.UrlTemplateImageryProvider({
                        url: "https://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=4d59f4ef142725ef8c409801fc86be8b",
                        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
                        tilingScheme: new Cesium.WebMercatorTilingScheme(),
                        maximumLevel: 18,
                    });

                }
            }),
            new Cesium.ProviderViewModel({
                name: '天地图矢量',
                tooltip: '天地图矢量底图',
                iconUrl: '../../image/td-vec-icon.png',
                creationFunction: function () {
                    return new Cesium.UrlTemplateImageryProvider({
                        url: "https://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=4d59f4ef142725ef8c409801fc86be8b",
                        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
                        tilingScheme: new Cesium.WebMercatorTilingScheme(),
                        maximumLevel: 18,
                    });

                }
            }),
            new Cesium.ProviderViewModel({
                name: 'Bing地图',
                tooltip: 'Cesium全球影像',
                iconUrl: '../../image/bingAerial.png',
                creationFunction: function () {
                    return new Cesium.createWorldImagery();

                }
            }),
            new Cesium.ProviderViewModel({
                //图层的名称。
                name: 'ArcGIS地图',
                //显示项目被隐藏的工具提示
                tooltip: 'ArcGIS地图',
                //代表图层的图标
                iconUrl: '../../image/ac-icon.jpg',
                //一个函数或命令，用于创建一个或多个提供程序，这些提供程序将在选择此项目时添加到地球仪中。
                creationFunction: function () {
                    var options = {
                        style: 'img', // style: img、elec、cva
                        crs: 'WGS84' // 使用84坐标系，默认为：GCJ02
                    }
                    return new Cesium.AmapImageryProvider(options);

                }
            }),
            new Cesium.ProviderViewModel({
                //图层的名称
                name: 'OSM',
                //显示项目被隐藏的工具提示
                tooltip: '开放街道地图',
                //代表图层的图标
                iconUrl: '../../image/osm-icon.png',
                //一个函数或命令，用于创建一个或多个提供程序，这些提供程序将在选择此项目时添加到地球仪中
                creationFunction: function () {
                    return new Cesium.OpenStreetMapImageryProvider({
                        url: 'https://a.tile.openstreetmap.org/'
                    });
                }
            })
        ]
    },
    //地形
    getTerrainProviderViewModelsArr: function () {
        return [
            new Cesium.ProviderViewModel({
                name: '我的地形',
                tooltip: '现已发布的地形',
                iconUrl: '../../image/my-image.png',
                creationFunction: function () {
                    return new Cesium.CesiumTerrainProvider({
                        url: serverUrls.demUrl,
                        requestVertexNormals: true
                    });
                }
            }),
            new Cesium.ProviderViewModel({
                //图层的名称
                name: '无地形',
                //显示项目被隐藏的工具提示
                tooltip: 'WGS84标准球体',
                //代表图层的图标
                iconUrl: '../../image/tq-icon.png',
                //一个函数或命令，用于创建一个或多个提供程序，这些提供程序将在选择此项目时添加到地球仪中
                creationFunction: function () {
                    return new Cesium.EllipsoidTerrainProvider({
                        ellipsoid: Cesium.Ellipsoid.WGS84
                    })
                }
            }),
            new Cesium.ProviderViewModel({
                //图层的名称
                name: 'Cesium全球地形',
                //显示项目被隐藏的工具提示
                tooltip: 'Cesium在线地形',
                //代表图层的图标
                iconUrl: '../../image/cs-icon.jpg',
                //一个函数或命令，用于创建一个或多个提供程序，这些提供程序将在选择此项目时添加到地球仪中
                creationFunction: function () {
                    return Cesium.createWorldTerrain();
                }
            }),
            new Cesium.ProviderViewModel({
                name: '天地图全球地形',
                tooltip: '天地图在线地形',
                iconUrl: '../../image/td-dx-icon.jpg',
                creationFunction: function () {
                    var terrainUrls = new Array();
                    var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];
                    var tdtUrl = 'https://t{s}.tianditu.gov.cn/';
                    var token = '4d59f4ef142725ef8c409801fc86be8b'
                    for (var i = 0; i < subdomains.length; i++) {
                        var url = tdtUrl.replace('{s}', subdomains[i]) + 'DataServer?T=elv_c&tk=' + token;
                        terrainUrls.push(url);
                    }
                    return new Cesium.GeoTerrainProvider({
                        urls: terrainUrls
                    });
                }
            })
        ]
    }
}

var cesiumToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNTg4YmQ0ZC0xNzcyLTRlNDItYjZkMi0zNzc0ODI3N2E2ZjciLCJpZCI6MzI1MjYsImlhdCI6MTYyMjYyMjQxOX0.kUki8CUFlPiIiuwlqIb7TGWmhk6hnlY6gwYViX08tDc";
Cesium.Ion.defaultAccessToken = cesiumToken;
// 谷歌影像

var viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: false,
    // terrainProvider: hhuDem,
    shouldAnimate: false,
    animation: false,
    timeline: false,
    orderIndependentTranslucency: true, //有序透明的混合模式
    sceneModePicker: false, //是否显示3D控件
    baseLayerPicker: true, //是否显示图层选择控件
    geocoder: false, //是否显示地名查找控件
    fullscreenButton: true, //是否显示全屏控件
    homeButton: false, //是否显示home控件
    navigationHelpButton: false, //是否显示帮助信息控件
    //获取或设置可用于图像选择的ProviderViewModel实例数组。
    imageryProviderViewModels: XlGlobalProvider.getImageryProviderArr(),
    //获取或设置可用于地形选择的ProviderViewModel实例数组。
    terrainProviderViewModels: XlGlobalProvider.getTerrainProviderViewModelsArr(),
});

viewer._cesiumWidget._creditContainer.style.display="none";   //版权控件的显示隐藏
var scene = viewer.scene;
var camera = scene.camera;
var globe = scene.globe;
scene.globe.baseColor = Cesium.Color.BLACK;

// globe.depthTestAgainstTerrain = false; //关闭深度检测，实体不会被遮挡
scene.screenSpaceCameraController.enableCollisionDetection = false;
//Add Cesium Inspector
// viewer.extend(Cesium.viewerCesiumInspectorMixin);

// add ceisium CesiumWidgetMixin
viewer.extend(Cesium.CesiumWidgetMixin)
viewer.compass.enabled = true //罗盘
viewer.distanceLegend.enabled = true //缩放比例尺
viewer.locationBar.enabled = true //地理位置
viewer.zoomController.enabled = true //缩放控件
