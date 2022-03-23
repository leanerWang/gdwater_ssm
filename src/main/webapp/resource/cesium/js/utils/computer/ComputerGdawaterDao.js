
//根据rectangle计算vadoseDao各个参数

import GdwaterDao from "../../Dao/GdwaterDao.js";

import XLBox from "../XLBox.js";
import Computer from "./Computer.js";

class ComputerGdawaterDao extends Computer{

    constructor( rectangle, xs, ys, zs, depth = 500){
        super()
        this._rec = rectangle
        this._gd = new GdwaterDao(
            undefined,undefined,undefined, ys, xs, zs, depth, 10 //默认网格高度为1米 ，深度为100米
        )

    }

    computer(){
        this._getPoints()._setValue()
        return this._gd
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
        this._gd._center = this._center
        this._gd._dimensions = this._dimensions
        this._gd._offset = new Cesium.Cartesian3(0,0, this._gd._depth- this._gd._boxHs/2)
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
        let gd = this._gd
        let left = new Cesium.Cartesian3(neModel.x*2, neModel.y*2, gd._boxHs)
        let right = new Cesium.Cartesian3(gd._xs, gd._ys, gd._hs)
        this._dimensions = Cesium.Cartesian3.divideComponents(left, right, new Cesium.Cartesian3()) 
        return this
    }
}

export default ComputerGdawaterDao