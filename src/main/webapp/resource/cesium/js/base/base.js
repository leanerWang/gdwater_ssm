/**创建对象*/
var MeasureObject = {
    pointLineEntity: null, //指示线段
    positionFloat: null, //鼠标移动位置的端点
    pointEntities: [],
    labelEntities: [], //标签
    positions: [], //线段端点
    floatingAnchor: undefined, //浮动端点
    polylines: [], //多段线
    siglePolylines: [],
    polylineStyle: {
        material: Cesium.Color.CHARTREUSE,
        width: 4,
        clampToGround: true
    },
    polylineZhiStyle: {
        material: Cesium.Color.AQUA,
        width: 4
    },
    labelStyle: {
        font: '18px Helvetica',
        fillColor: Cesium.Color.GOLD,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(20, -20),
        fillColor: null,
        eyeOffset:new Cesium.Cartesian3(10, 10, 10)
    },
    //添加点
    addPoint: function (position) {
        let pointEntitiy = viewer.entities.add({
            position: position,
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 1,
            }
        })
        this.pointEntities.push(pointEntitiy);
        return pointEntitiy
    },
    /**清除 */
    remove: function () {
        viewer.entities.removeAll()
        this.labelEntities = []
        this.pointEntities = []
        this.polylines = []
        this.siglePolylines = []
        this.positionFloat = null
        this.pointEntity = null
    },

    addPolyline: function () {
        let polyline = viewer.entities.add({
            polyline: {
                ...this.polylineStyle,
                positions: new Cesium.CallbackProperty(() => {
                    return this.positions
                }, false),
            }
        })
        return polyline
    },
    addZhiPolyline: function (positions) {
        viewer.entities.add({
            polyline: {
                ...this.polylineZhiStyle,
                positions: positions
            }
        })
    },
    //更新两点之间的直线
    updatePointLine: function (point1, point2) {
        let pointLineEntity = viewer.entities.add({
            polyline: {
                show: true,
                positions: [point1, point2],
                material: Cesium.Color.CHARTREUSE,
                width: 4,
                clampToGround: true
            }
        })
        this.pointLineEntity = pointLineEntity
        return pointLineEntity
    },
    //计算两点贴地距离
    getSurfaceDistance: function (point1, point2) {
        //return Cesium.Cartesian3.distance(point1, point2);
        const {
            Ellipsoid,
            EllipsoidGeodesic
        } = Cesium
        const pickedPointCartographic = Ellipsoid.WGS84.cartesianToCartographic(
            point1
        )
        const lastPointCartographic = Ellipsoid.WGS84.cartesianToCartographic(
            point2
        )
        const geodesic = new EllipsoidGeodesic(
            pickedPointCartographic,
            lastPointCartographic
        )
        return geodesic.surfaceDistance
    },
    //计算空间距离
    getSpaceDistance:function(point1,point2){
        return Cesium.Cartesian3.distance(point1, point2);
    },
    //添加提示框
    addLabel: function (position, text, style) {
        if (style) {
            this.labelStyle = style
        }
        let label = viewer.entities.add({
            position: position,
            label: {
                text: text.toString(),
                ...this.labelStyle
            }
        })
        this.labelEntities.push(label)
    },
    //获取选择点的cartesian3坐标
    getPointCartesian3: function (event) {
        let ray = viewer.camera.getPickRay(event.position);
        let lineEndPosition = globe.pick(ray, scene);
        return lineEndPosition;
    },
    //笛卡尔坐标批量转经纬度和高度
    getPointForDegree: function (positionsCartesian3) {
        let positionCartesian3 = positionsCartesian3;
        if (!Array.isArray(positionsCartesian3)) {
            positionsCartesian3 = [positionsCartesian3] //不是数组变为数组
        }
        if (positionsCartesian3 == undefined || positionsCartesian3.length == 0) {
            throw new Error("请传入点坐标")
        }
        let positions = []; //存放转换后结果的数组
        positionCartesian3.forEach(element => {
            let cartographic = globe.ellipsoid.cartesianToCartographic(element);
            let pointLat = Cesium.Math.toDegrees(cartographic.latitude);
            let pointLng = Cesium.Math.toDegrees(cartographic.longitude);
            let pointHgt = cartographic.height;
            positions.push([pointLat, pointLng, pointHgt]);
        });
        return positions;
    },
    /**利用海伦公式计算三角形面积 */
    getTriangleArea: function (points) {

        let distances = []; //存放边长的数组
        if (!Array.isArray(points) || points.length != 3) {
            throw new TypeError("请传入一个长度等于3的数组！")
        }

        for (let index = 0; index < points.length - 1; index++) {
            const element1 = points[index];
            const element2 = points[index + 1];
            const distance = this.getSurfaceDistance(element1, element2);
            distances.push(distance);
        }
        //计算首尾点的线段长
        const distance = this.getSurfaceDistance(points[0], points[points.length - 1]);
        distances.push(distance);
        //海伦公式
        const d1 = distances[0];
        const d2 = distances[1];
        const d3 = distances[2];
        let p = (d1 + d2 + d3)/2; //周长
        let s = Math.sqrt(p * (p - d1) * (p - d2) * (p - d3));
        return s;
    },
    //四舍五入
    round: function (number, precision) {
        return Math.round(+number + 'e' + precision) / Math.pow(10, precision);
    },
    //清除所有事件
    removeEvent: function () {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

};


/**测量两点贴地距离*/
function measureLineSpace() {
    let positions = [];
    MeasureObject.removeEvent()
    //鼠标单击事件
    handler.setInputAction(function (event) {
        let earthPositionCartesian3 = MeasureObject.getPointCartesian3(event);
        if (positions.length == 0) {
            positions.push(earthPositionCartesian3);
            MeasureObject.addPoint(earthPositionCartesian3); // 存储第一个点，并在点击处绘制一个点entity 
        }
        if (positions.length == 2) {
            let point1 = positions[0];
            let point2 = positions[1];
            //添加点，更新线段
            MeasureObject.addPoint(point2);
            let pointLineEntity = MeasureObject.updatePointLine(point1, point2);
            MeasureObject.siglePolylines.push(pointLineEntity)
            //计算距离
            let textDisance = MeasureObject.getSurfaceDistance(point1, point2);
            textDisance = MeasureObject.round(textDisance, 6)
            //添加提示框
            MeasureObject.addLabel(point2, textDisance);
            //清空数组
            positions = [];
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //鼠标移动事件
    handler.setInputAction(function (event) {

        if (positions.length == 0) {
            return;
        }
        let ray = viewer.camera.getPickRay(event.endPosition);
        let lineEndPosition = globe.pick(ray, scene);
        //只有一个点，则再添加一个点
        if (positions.length == 1) {
            positions.push(lineEndPosition);
        } else { //不断更新第二个点
            positions[1] = lineEndPosition;
        }

        MeasureObject.updatePointLine(positions[0], positions[1]);
        if (MeasureObject.pointLineEntity != undefined) {
            MeasureObject.pointLineEntity.polyline.positions = positions;
        }


    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

/**测量多点贴地距离 */
function measureMoreLineSpace() {
    let labelStyle = {
        font: '18px Helvetica',
        fillColor: Cesium.Color.GOLD,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(20, -20),
        fillColor: null,
    }
    let positions = MeasureObject.positions;
    handler.setInputAction(function (event) {
        let len = positions.length
        let earthPositionCartesian3 = MeasureObject.getPointCartesian3(event);
        if (len == 0) {
            MeasureObject.floatingAnchor = MeasureObject.addPoint(earthPositionCartesian3);
            positions.push(earthPositionCartesian3)
            positions.push(earthPositionCartesian3)
            return
        }
        MeasureObject.positions.pop()
        positions.push(earthPositionCartesian3);
        MeasureObject.addPoint(earthPositionCartesian3)
        let polyline = MeasureObject.addPolyline()
        MeasureObject.polylines.push(polyline)
        len = positions.length
        let point1 = positions[len - 1]
        let point2 = positions[len - 2]
        //计算距离
        let textDisance = MeasureObject.getSurfaceDistance(point1, point2);
        textDisance = MeasureObject.round(textDisance, 6)
        MeasureObject.addLabel(point2, textDisance, labelStyle);
        positions.push(earthPositionCartesian3);

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction(function (event) {
        if (MeasureObject.floatingAnchor != undefined) {
            let ray = viewer.camera.getPickRay(event.endPosition);
            let position = globe.pick(ray, scene);
            MeasureObject.positions.pop()
            MeasureObject.positions.push(position)
            MeasureObject.addPolyline()
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(function (event) {
        let earthPositionCartesian3 = MeasureObject.getPointCartesian3(event);
        MeasureObject.addPoint(earthPositionCartesian3)
        let len = MeasureObject.positions.length
        let point1 = positions[len - 1]
        let point2 = positions[len - 2]
        //计算距离
        let textDisance = MeasureObject.getSurfaceDistance(point1, point2);
        textDisance = MeasureObject.round(textDisance, 6)
        MeasureObject.addLabel(point2, textDisance, labelStyle);
        MeasureObject.removeEvent()
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

/**计算三角形面积 利用海伦公式*/
function measureArea() {
    let labelStyle = {
        font: '18px Helvetica',
        fillColor: Cesium.Color.GOLD,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(20, -20),
        fillColor: null,
    }
    let positions = [];
    MeasureObject.removeEvent()
    //鼠标左击事件
    handler.setInputAction((event) => {
        let point = MeasureObject.getPointCartesian3(event);
        positions.push(point);
        MeasureObject.addPoint(point);
        //有两个以上的点就进行连线
        if (positions.length >= 2) {
            MeasureObject.updatePointLine(positions[positions.length - 1], positions[positions.length - 2]);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //鼠标右击事件
    handler.setInputAction(() => {
        //三个及三个以上的点就闭合曲线
        if (positions.length >= 3) {
            MeasureObject.updatePointLine(positions[positions.length - 1], positions[0]);
            //显示计算面积
            let area = 0;
            for (let i = 0; i < positions.length - 2; i++) {
                let pts = [positions[0], positions[i + 1], positions[i + 2]];
                area += MeasureObject.getTriangleArea(pts);
            }
            area = MeasureObject.round(area, 6)
            MeasureObject.addLabel(positions[positions.length - 1], area, labelStyle);
            positions = []
        }


    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

}

/**计算坐标 */
function getlocation() {
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(function (event) {
        if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
            throw new Error('当前浏览器不支持地形图');
        }
        let earthPositionCartesian3 = MeasureObject.getPointCartesian3(event)
        let cartographic = globe.ellipsoid.cartesianToCartographic(earthPositionCartesian3);
        let choiceLat = Cesium.Math.toDegrees(cartographic.latitude);
        let choiceLng = Cesium.Math.toDegrees(cartographic.longitude);
        let choiceAlt = cartographic.height;
        choiceLat = MeasureObject.round(choiceLat, 6)
        choiceLng = MeasureObject.round(choiceLng, 6)
        choiceAlt = MeasureObject.round(choiceAlt, 6)
        let labelText = `经度：${choiceLng}
纬度：${choiceLat}
高度：${choiceAlt}`
        MeasureObject.addPoint(earthPositionCartesian3)
        let style = {
            showBackground: true,
            font: '14px sans-serif',
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            fillColor: Cesium.Color.SKYBLUE,
        }
        MeasureObject.addLabel(earthPositionCartesian3, labelText, style)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

}

/**计算多点空间距离 */
function mesasureSpaceDistance() {
    let positions = []
    handler.setInputAction(function (event) {
        let len = positions.length
        if (len == 0) {
            let earthPositionCartesian3 = MeasureObject.getPointCartesian3(event);
            MeasureObject.addPoint(earthPositionCartesian3)
            positions.push(earthPositionCartesian3)
            return
        }
        let earthPositionCartesian3 = MeasureObject.getPointCartesian3(event);
        MeasureObject.addPoint(earthPositionCartesian3)
        positions.push(earthPositionCartesian3)
        len = positions.length
        let distance = MeasureObject.getSpaceDistance(positions[len-1],positions[len-2])
        distance = MeasureObject.round(distance,6)
        MeasureObject.addZhiPolyline([positions[len-1],positions[len-2]])
        MeasureObject.addLabel(positions[len-2],distance)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    handler.setInputAction(function (event) {
        let len = positions.length
        if (len > 0) {
            let earthPositionCartesian3 = MeasureObject.getPointCartesian3(event);
            MeasureObject.addPoint(earthPositionCartesian3)
            positions.push(earthPositionCartesian3)
            len = positions.length
            let distance = MeasureObject.getSpaceDistance(positions[len-1],positions[len-2])
            distance = MeasureObject.round(distance,6)
            MeasureObject.addZhiPolyline([positions[len-1],positions[len-2]])
            MeasureObject.addLabel(positions[len-2],distance)
            positions = []
        }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

}

/**清除实体 */
function clearBaseOptions() {
    MeasureObject.remove()
}