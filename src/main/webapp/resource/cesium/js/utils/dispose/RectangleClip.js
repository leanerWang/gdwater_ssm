import XLBox from "../XLBox.js";
import Clip from "./Clip.js";


const DEF_OPTION = {
    'clipDirection': 1, //与距离想乘
    'unionClippingRegions': true
}

//四个面矩形切
class RectangleClip extends Clip{

    constructor(viewer, rectangle){
        super(viewer)
        this._options = {
            ...DEF_OPTION
        }
        this._rec = rectangle
        this._distance = undefined
        this._boundingRectangle = undefined
        this._clipDirection = 'outside'
    }

    get distance(){return this._distance}

    get clipDirection(){
        return this._clipDirection
    }
    
    set clipDirection(c){
        this._clipDirection = c
        if (c === 'inside') {
            this._options.clipDirection = -1
            this._options.unionClippingRegions = false
        }else{
            this._options = {...DEF_OPTION}
        }
    }
    

    clip(){
        this._setCpcOption('unionClippingRegions', this._options.unionClippingRegions)
        this._getPoints()._setPlans()
        this._clip()
        this._setView()
    }


    _setPlans(){
        let planes = [
            new Cesium.ClippingPlane(
                new Cesium.Cartesian3(1.0, 0.0, 0.0),
                this._distance.x
              ),
              new Cesium.ClippingPlane(
                new Cesium.Cartesian3(-1.0, 0.0, 0.0),
                this._distance.x
              ),
              new Cesium.ClippingPlane(
                new Cesium.Cartesian3(0.0, 1.0, 0.0),
                this._distance.y
              ),
              new Cesium.ClippingPlane(
                new Cesium.Cartesian3(0.0, -1.0, 0.0),
                this._distance.y
              ),
        ]
        this.planes = planes
    }

    _getBS(){ 
       
    }

    _getPoints(){
        this._center = Cesium.Rectangle.center(this._rec, new Cesium.Cartographic())
        this._center = Cesium.Cartographic.toCartesian(this._center, Cesium.Ellipsoid.WGS84, new Cesium.Cartesian3())
        this._northeast = Cesium.Rectangle.northeast(this._rec, new Cesium.Cartographic())
        this._northeast = Cesium.Cartographic.toCartesian(this._northeast, Cesium.Ellipsoid.WGS84, new Cesium.Cartesian3())
        this._computer()
        return this
    }

    /**
     * 建立坐标系
     * @returns 当前对象
     */
    _computer(){
        let xlBox = new XLBox()
        this.modelMatrix = xlBox.computerModelMatrix(this._center)
        let neModel = xlBox.computerModelPositionFromCenter(this._northeast, this._center)
        this._distance = {
            x: neModel.x * this._options.clipDirection,
            y: neModel.y * this._options.clipDirection
        }
        return this
    }

    _setView(){
        if(this.isFly){
            this._viewer.camera.setView({
                destination : this._rec
            });
        }  
    }
}

export default RectangleClip