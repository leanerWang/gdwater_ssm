import XLBox from "../XLBox.js";
import XLBoxGeometry from "../XLBoxGeometry.js";
import XLType from "../XLType.js";
import XLCommonBox from "./XLCommonBox.js";

//包气带土壤层网格划分和显示
export default class XLVadoseBox extends XLCommonBox{
    constructor(center, dimensions, depth, lengthNum, widthNum, depthNum){
        super();
        XLType.determineCartesian3s(center, dimensions);
        XLType.notBeNull(depth, lengthNum, widthNum, depthNum);
        this._center = center;
        this._dimensions = dimensions;
        this._depth = depth;
        this._lengthNum = lengthNum;
        this._widthNum = widthNum;
        this._depthNum = depthNum;
    }

    //计算小盒子参数
    _computerBox(){
        let z =  - this._dimensions.z / 2 - this._depth / 2;
        let centerModelPosition = Cesium.Cartesian3.fromElements(0,0,z);
        let xlBox = new XLBox();
        this.vadoseCenter = xlBox.computerWorldPositionFromCenter(centerModelPosition, this._center);

        this.boxLength = this._dimensions.x / this._lengthNum;
        this.boxWidth = this._dimensions.y / this._widthNum;
        this.boxHeight = this._depth  / this._depthNum;
        this.vadoseDimensions = Cesium.Cartesian3.fromElements(this.boxLength, this.boxWidth, this.boxHeight);
    }

    //生成
    gennerate(offset){
        XLType.determineCartesian3(offset);
        this.offset = offset;

        this._computerBox();
        this.xlGeo = new XLBoxGeometry(this.vadoseCenter, this.vadoseDimensions);
        this.xlGeo.initBoxPosition3DUpdate(offset, this._lengthNum, this._widthNum, this._depthNum);
        
        this.beforeChangeBoxValue();
        this.xlGeo.generateByEntities();
    }

    //修改更新网格
    update(isChanged){
        if (isChanged &  XLType.isDefined(this.xlGeo) ) {
            this.xlGeo.removeAllBoxsByEntities();
            this.gennerate(this.offset);
        } 
    }

}