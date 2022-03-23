import XLBoxGeometry from '../utils/XLBoxGeometry.js'


var longitude = 118.78;
var latitude = 31.915;
var groundHeight = 1000; //相机距地面高度
var rows = 9 ;//元胞行数
var cloumns = 9 ;//元胞列数
var heights = 9 ;//元胞纵数
var gdwaterRows = 17; //潜水层元胞行数
var gdwaterCols = 17; //潜水层元胞列数
var centerPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude);
var dimensions = new Cesium.Cartesian3(1.0, 1.0, 1.0);
var centerOffset1 = new Cesium.Cartesian3(0.0, 0.0, 11.0);
var centerOffset2 = new Cesium.Cartesian3(0.0, 0.0, 6.0);
var centerOffset3 = new Cesium.Cartesian3(0.0, 0.0, 1.0);
var xlGeoSurface = undefined //地表盒子流动线对象
var xlGeoVadose = undefined //包气带盒子流动线对象
var xlGeoGdwater = undefined //潜水层盒子流动线对象


function initCellBox(){
    xlGeoSurface = new XLBoxGeometry(centerPosition, dimensions)
    xlGeoSurface.initBoxPosition(centerOffset1, rows, cloumns)
    xlGeoSurface.generate()

    xlGeoVadose = new XLBoxGeometry(centerPosition, dimensions)
    xlGeoVadose.initBoxPosition3D(centerOffset2, rows, cloumns, heights)
    xlGeoVadose.generateByEntities()

    xlGeoGdwater = new XLBoxGeometry(centerPosition, dimensions)
    xlGeoGdwater.initBoxPosition(centerOffset3, gdwaterRows, gdwaterCols)
    xlGeoGdwater.attributeStyle = {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.DEEPPINK)
    }
    xlGeoGdwater.generate()
}

function main(){
    camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees(longitude, latitude, groundHeight)
    });
    // initCellBox();
}



$('#load').click(function (e) { 
    main();    
});