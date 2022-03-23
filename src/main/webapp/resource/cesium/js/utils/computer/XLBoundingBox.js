import xlType from '../XLType.js'
import XLBox from '../XLBox.js'

class XLBoundingBox {
    _xlBox = undefined //对象
    featurePoints = [] //特征点经纬度数组
    featurePointsForRadians = []; //特征点弧度数组
    featurePointsForCartesian3 = [] //特征点笛卡尔数组
    boundingBox = undefined //包围盒
    center = undefined; //中心笛卡尔位置
    dimensions = undefined; //长宽高

    constructor(lon1, lat1, lon2, lat2) {
        xlType.notBeNull(lon1, lat1, lon2, lat2);
        this._lon1 = lon1;
        this._lat1 = lat1;
        this._lon2 = lon2;
        this._lat2 = lat2;
        this._init();
    }

    //初始化
    _init() {
        this._xlBox = new XLBox();

    }

    //获取9个特征点
    get9FeaturePoints() {
        let perLon = (this._lon2 - this._lon1) / 2;
        let perLat = (this._lat2 - this._lat1) / 2;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let point = [this._lon1 + i * perLon, this._lat1 + j * perLat];
                let pointForRadians = this._xlBox.degreeToRadians(point[0], point[1]);
                this.featurePointsForRadians.push(pointForRadians);
                this.featurePoints.push(point);
            }
        }

    }

    //获取特征点的笛卡尔坐标
    async getPointsForCartesian3() {
        let newPositions = await this._xlBox.getTerrainHeight(viewer.terrainProvider, this.featurePointsForRadians);
        newPositions.forEach(element => {
            let point = this._xlBox.radiansToCartesian3(element);
            this.featurePointsForCartesian3.push(point);
        });
    }

    //获取包围盒
    async getBoundingBox() {
        this.get9FeaturePoints();
        await this.getPointsForCartesian3();
        let boundingBox = new Cesium.OrientedBoundingBox();
        Cesium.OrientedBoundingBox.fromPoints(this.featurePointsForCartesian3, boundingBox);
        this.boundingBox = boundingBox;
    }

    //飞行效果
    fly() {
        let center = Cesium.Cartesian3.fromDegrees((this._lon1 + this._lon2) / 2, (this._lat1 + this._lat2) / 2, 5000);
        // let destination = Cesium.Rectangle.fromDegrees(this._lon1, this._lat1, this._lon2, this._lat2);
        viewer.camera.flyTo({
            destination: center,
            complete: () => {
                setTimeout(() => {
                    //var transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
                    //viewer.camera.lookAtTransform(transform, new Cesium.Cartesian3(-5000, -5000.0, 0.0));
                    camera.flyTo({
                        destination: Cesium.Cartesian3.fromDegrees(
                            this._lon1 - 0.013,
                            this._lat1 - 0.01,
                            1300
                        ),
                        orientation: {
                            heading: Cesium.Math.toRadians(45.0),
                            pitch: Cesium.Math.toRadians(-30.0),
                        },
                        duration: 1.6,
                        easingFunction: Cesium.EasingFunction.LINEAR_NONE,
                    });
                }, 1000);
            },
        });
    }

    //展示包围盒
    async showBoundingBox() {
        await this.getBoundingBox();
        let dimensions = Cesium.Matrix3.getScale(this.boundingBox.halfAxes, new Cesium.Cartesian3());
        Cesium.Cartesian3.multiplyByScalar(dimensions, 2, dimensions);
        let matrix3 = new Cesium.Matrix3(1, 0, 0, 0, 0, 1, 0, 1, 0);
        Cesium.Matrix3.multiplyByVector(matrix3, dimensions, dimensions);
        this.center = this.boundingBox.center;
        this.dimensions = dimensions;
        this.entity = viewer.entities.add({
            position: this.boundingBox.center,
            box: {
                dimensions: dimensions,
                material: Cesium.Color.WHITE.withAlpha(0.3),
                outline: true,
                outlineColor: Cesium.Color.WHITE,
                show: false
            }
        });
        this.fly();
        // viewer.trackedEntity = this.entity;
        // globe.depthTestAgainstTerrain = false;  
    }

    //展示包围盒
    show(flag) {
        if (flag !== undefined) {
            this.entity.show = flag
        }
    }

}
export default XLBoundingBox;