/**计算box各坐标边界的类 */

import XLBox from './XLBox.js'

class XLBoxPosition extends XLBox{
    _halfLen = 0 //x坐标方向的半长
    _halfWid = 0
    _halfhei = 0
    _boxCenterPosition = undefined
    /** 
     * @param {存放角点的模型坐标} twoPositions
    */
    twoPositions = {
        leftButtom:null,
        rightTop:null
    }
    /**
     * 
     * @param {模型原点坐标} centerPosition 
     * @param {目标点坐标} boxCenterPosition 
     * @param {x方向长度} length 
     * @param {y方向长度} width 
     * @param {z方向长度} height 
     */
    constructor(boxCenterPosition,length,width,height){
        super()
        super.determineTypeCartesian3(boxCenterPosition)
        this._boxCenterPosition = boxCenterPosition 
        this._halfLen = length / 2
        this._halfWid = width / 2
        this._halfhei = height / 2
        this.computerleftButtomPos()
        this.computerrightTopPos()
    }

    computerleftButtomPos(){
        let x =  this._boxCenterPosition.x - this._halfLen
        let y = this._boxCenterPosition.y - this._halfWid
        let z = this._boxCenterPosition.z - this._halfhei
        this.twoPositions.leftButtom = new Cesium.Cartesian3(x,y,z)
    }

    computerrightTopPos(){
        let x =  this._boxCenterPosition.x + this._halfLen
        let y = this._boxCenterPosition.y + this._halfWid
        let z = this._boxCenterPosition.z + this._halfhei
        this.twoPositions.rightTop = new Cesium.Cartesian3(x,y,z)
    }


}

export default XLBoxPosition