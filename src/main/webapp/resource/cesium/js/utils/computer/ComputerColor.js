//根据质量插值计算颜色
//线性内插或外推

import Computer from "./Computer.js"


class ComputerColor extends Computer{

    constructor(currentVal, totalVal){

        super()
        this._startCor = Cesium.Color.ROYALBLUE
        this._endCor = Cesium.Color.DARKORANGE
        this._currentVal = currentVal
        this._totalVal = totalVal

    }

    get currentVal(){return this._currentVal}

    set currentVal(cv){
        this._currentVal = cv
    }

    get totalVal(){
        return this._totalVal
    }

    set totalVal(tv){
         this._totalVal = tv
    }

    get startColor(){
        return this._startCor
    }

    set startColor(c){
        this._startCor = c
    }

    get endColor(){
        return this._endCor
    }

    set endColor(c){
        this._endCor = c
    }

    _computer(){
       
        let radio = this._computerRadioByDis()
        // let radio = this._currentVal / this._totalVal
        let sc = Cesium.Cartesian4.fromColor(this._startCor, new Cesium.Cartesian4()) 
        let ec = Cesium.Cartesian4.fromColor(this._endCor, new Cesium.Cartesian4()) 
        let fc = Cesium.Cartesian4.lerp(sc, ec, radio, new Cesium.Cartesian4())
        let fcc = Cesium.Color.fromCartesian4(fc, new Cesium.Color())
        return fcc
    }



    /**
     * 根据与污染源的坐标距离计算颜色插值
     * @returns 颜色插值点
     */
    _computerRadioByDis(){
        let xVal = Math.abs( this._currentVal[0] - this._totalVal[0])
        let yVal = Math.abs( this._currentVal[1] - this._totalVal[1])
        let xRadio = 1 - xVal / this._totalVal[0]
        let yRadio = 1 - yVal / this._totalVal[1]
        let radio = 0
        if (xRadio < yRadio) {
            radio = xRadio
        }else{
            radio = yRadio
        }   
        return radio
    }

    getColor(){
        return this._computer()
    }

    setAndGetColor(cv, tv){
        this._currentVal = cv
        this._totalVal = tv
        return this._computer()
    }


}

export default ComputerColor