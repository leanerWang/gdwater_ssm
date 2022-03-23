import XLBox from './XLBox.js'

class XLBoxFun extends XLBox{

    constructor(centerPoint,leftButtom,rightTop){
        super()
        this._centerPoint = centerPoint
        this._leftButtom = leftButtom
        this._rightTop = rightTop
        this.generateFun()
    }

    /**
     * 返回粒子更新函数
     * @returns 返回粒子更新函数
     */
    generateFun(){
        let that = this 
        return function (particle, dt) {
            let parPosition = particle.position
            parPosition = that.computerModelPositionFromCenter(parPosition,that._centerPoint)
            let subtract1 = Cesium.Cartesian3.subtract (parPosition, that._leftButtom, new Cesium.Cartesian3())
            let subtract2 = Cesium.Cartesian3.subtract (that._rightTop, parPosition, new Cesium.Cartesian3())
            let s1 = Cesium.Cartesian3.minimumComponent (subtract1)
            let s2 = Cesium.Cartesian3.minimumComponent (subtract2)
            if ((s1 < 0)| (s2<0)) {
                Cesium.Cartesian3.negate (particle.velocity, particle.velocity) 
            }
        }
    }
}

export default XLBoxFun