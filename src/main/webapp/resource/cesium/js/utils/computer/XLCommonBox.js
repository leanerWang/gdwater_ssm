//所有网格对象的父类
//暂时弃用

import XLType from "../XLType.js";

export default class XLCommonBox{
    //盒子样式
    boxEntitiesStyle = {
        isChangeBoxStyle:false, //是否需要跳过初始化样式设置，即是否样式已经设置好
        material:  Cesium.Color.AZURE.withAlpha(0.1),
        fill:true,
        alpha:0.1,
        outline: false,
        outlineColor: Cesium.Color.AZURE,
        isID: true 
    }
    constructor(){}

    //删除,通过instance添加的实体
    remove(){
        if (XLType.isDefined(this.xlGeo)) {
            this.xlGeo.removeAllBoxs();
        }
    }

    //删除通过entity添加的实体
    removeByEntity(){
        if (XLType.isDefined(this.xlGeo)) {
            this.xlGeo.removeAllBoxsByEntities();
        }
    }


     //entities生成的边框
    showBoxOutline(flag){
        this.xlGeo.changeBoxOutline(flag);
    }

    //填充
    isFilled(flag){
        this.xlGeo.isFilled(flag)
    }

    //更改透明度
    changeBoxAlpha(value){
        this.xlGeo.changeBoxAlpha(value)
    }

    //生成box之前更改参数
    beforeChangeBoxValue(){
        this.xlGeo.boxEntitiesStyle.fill = Cesium.defaultValue(this.boxEntitiesStyle.fill,true);
        this.xlGeo.boxEntitiesStyle.material.withAlpha = Cesium.defaultValue(this.boxEntitiesStyle.alpha,0.1);
        this.xlGeo.boxEntitiesStyle.outline = Cesium.defaultValue(this.boxEntitiesStyle.outline,true);
        this.xlGeo.boxEntitiesStyle.outlineColor = Cesium.defaultValue(this.boxEntitiesStyle.outlineColor,Cesium.Color.AZURE);
        this.xlGeo.boxEntitiesStyle.material = Cesium.defaultValue(this.boxEntitiesStyle.material,Cesium.Color.AZURE.withAlpha(0.1));
        this.xlGeo.boxEntitiesStyle.isID = Cesium.defaultValue(this.boxEntitiesStyle.isID, true);
        
    }

    //更改当前类的样式值
    changeBoxValue(filled, alpha, color,outline, outlineColor, isID, isChange){
        this.boxEntitiesStyle.fill = Cesium.defaultValue(filled,this.boxEntitiesStyle.fill);
        this.boxEntitiesStyle.alpha = Cesium.defaultValue(alpha,this.boxEntitiesStyle.alpha);
        this.boxEntitiesStyle.material = Cesium.defaultValue(color,this.boxEntitiesStyle.material);
        this.boxEntitiesStyle.outline = Cesium.defaultValue(outline,this.boxEntitiesStyle.outline);
        this.boxEntitiesStyle.outlineColor = Cesium.defaultValue(outlineColor,this.boxEntitiesStyle.outlineColor);
        this.boxEntitiesStyle.isID = Cesium.defaultValue(isID,this.boxEntitiesStyle.isID);
        this.boxEntitiesStyle.isChangeBoxStyle = Cesium.defaultValue(isChange,this.boxEntitiesStyle.isChangeBoxStyle);

    }
}