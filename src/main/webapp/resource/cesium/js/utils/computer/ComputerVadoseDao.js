
//根据rectangle计算vadoseDao各个参数

import VadoseDao from "../../Dao/VadoseDao.js";
import XLBox from "../XLBox.js";
import Computer from "./Computer.js";

class ComputerVadoseDao extends Computer{

    constructor( rectangle, xs, ys, zs){
        super()
        this._rec = rectangle
        this._vd = new VadoseDao(
            undefined,undefined,undefined, ys, xs, zs, 100 //默认深度500米 
        )

    }

    computer(){
        this._getPoints()._setValue()
        return this._vd
    }



    _getPoints(){
        this._center = Cesium.Rectangle.center(this._rec, new Cesium.Cartographic())
        this._center = Cesium.Cartographic.toCartesian(this._center, Cesium.Ellipsoid.WGS84, new Cesium.Cartesian3())
        this._northeast = Cesium.Rectangle.northeast(this._rec, new Cesium.Cartographic())
        this._northeast = Cesium.Cartographic.toCartesian(this._northeast, Cesium.Ellipsoid.WGS84, new Cesium.Cartesian3())
        this._computer()
        return this
    }

    _setValue(){
        this._vd._center = this._center
        this._vd._dimensions = this._dimensions
        this._vd._offset = new Cesium.Cartesian3(0,0,-this._vd._depth / 2)
        return this
    }

    /**
     * 建立坐标系
     * @returns 当前对象
     */
    _computer(){
        let xlBox = new XLBox()
        this._modelMatrix = xlBox.computerModelMatrix(this._center)
        let neModel = xlBox.computerModelPositionFromCenter(this._northeast, this._center)
        let vd = this._vd
        let left = new Cesium.Cartesian3(neModel.x*2, neModel.y*2, vd._depth)
        let right = new Cesium.Cartesian3(vd._xs, vd._ys, vd._hs)
        this._dimensions = Cesium.Cartesian3.divideComponents(left, right, new Cesium.Cartesian3()) 
        return this
    }
}

export default ComputerVadoseDao