import XLBox from "../XLBox.js";
import XLBoxGeometry from "../XLBoxGeometry.js";
import XLType from "../XLType.js";
import XLCommonBox from "./XLCommonBox.js";


export default class XLGdwaterBox extends XLCommonBox{
    constructor(center, dimensions, depth, lengthNum, widthNum, heigth){
        super();
        XLType.determineCartesian3s(center, dimensions);
        XLType.notBeNull(depth, lengthNum, widthNum, heigth);
        this._center = center;
        this._dimensions = dimensions;
        this._depth = depth;
        this._lengthNum = lengthNum;
        this._widthNum = widthNum;
        this._heigth = heigth;
    }

    computerBox(){
        let xlBox = new XLBox();
        let z = 0  - this._dimensions.z / 2 - this._depth - this._heigth / 2;
        let modelCenter = Cesium.Cartesian3.fromElements(0,0,z);
        this.gdwaterCenter = xlBox.computerWorldPositionFromCenter(modelCenter, this._center);
        
        this.boxLength = this._dimensions.x / this._lengthNum;
        this.boxWidth = this._dimensions.y / this._widthNum;
        this.boxHeight = this._heigth;
        this.gdwaterDimensions = Cesium.Cartesian3.fromElements(this.boxLength, this.boxWidth, this.boxHeight);
    }

    gennerate(offset){
        XLType.determineCartesian3(offset);
        this.offset = offset;

        this.computerBox();
        this.xlGeo = new XLBoxGeometry(this.gdwaterCenter, this.gdwaterDimensions);
        this.xlGeo.initBoxPositionUpdate(offset, this._lengthNum, this._widthNum);

        //通过primitive生成
        // let boxGeometry = Cesium.BoxGeometry.fromDimensions({
        //     dimensions:new Cesium.Cartesian3(this.boxLength, this.boxWidth, this.boxHeight)
        // })
        // xlGeo.attributeStyle.color = Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.DEEPPINK.withAlpha(0.1)); //颜色
        // xlGeo.generate(boxGeometry)
        if (!this.boxEntitiesStyle.isChangeBoxStyle) {
            this.boxEntitiesStyle.material = Cesium.Color.DEEPPINK.withAlpha(0.5);
            this.boxEntitiesStyle.outlineColor = Cesium.Color.DEEPPINK;
            this.boxEntitiesStyle.isID = false;
        }
        this.beforeChangeBoxValue();
        this.xlGeo.generateByEntities();
    }

    //参数改变则更新网格
    update(isChanged){
        if (isChanged & XLType.isDefined(this.xlGeo)) {
            this.xlGeo.removeAllBoxsByEntities();
            this.gennerate(this.offset);
        } 
    }

}