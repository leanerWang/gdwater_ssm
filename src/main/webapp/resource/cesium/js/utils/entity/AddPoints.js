import XLType from "../XLType.js";
import Entity from "./Entity.js";
import PointDao from "../../dao/PointDao.js";

let DEF_STYLES = {
    show: true,
    pixelSize: 5,
    color: Cesium.Color.NAVY,
    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND //相对地形的高度
}
let DEF_BILLBOARD_STYLE = {
    show:true,
    image: "../../image/point-2.png",//"../../image/circle_blue.png",
    width: 12,
    height: 12,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    // eyeOffset: new Cesium.Cartesian3(0, 0, 50),
}
class AddPoints extends Entity {
    constructor(pointDao) {
        super()
        if (!pointDao | pointDao instanceof  PointDao) {
            return
        }
        this.type = 'point-entitites-dataSource'
        this._init(this.type)
        this._pointDao = XLType.numberToArrs(pointDao)
        this._pointEntities = []
        this._billboard = []
    }

    set pointType(t){
        if (t === 'gdwater'){
            DEF_BILLBOARD_STYLE.heightReference = Cesium.HeightReference.NONE;
            DEF_BILLBOARD_STYLE.image = '../../image/point-water.png'
            DEF_BILLBOARD_STYLE.width = 20
            DEF_BILLBOARD_STYLE.height = 20
        }
    }

    //添加点
    set entities(arr) {
        this._entities = arr
        this._addEntities()
    }

    //添加标签
    set billboardEntities(b){
        this._billboardEntities = b 
        this._addbillboardEntities()
    }

    generate(){
        this._getEntities()
    }

    _getEntities() {
        this._pointDao.map(pointDao => {
            // let res = new Cesium.Entity({
            //     name: "green little point",
            //     position: position,
            //     point: new Cesium.PointGraphics(DEF_STYLES),
            //     id: this.type + position,
            // })
            //this._pointEntities.push(res)
            let billboard = new Cesium.Entity({
                name: pointDao.type +'-'+ pointDao.level,
                position: pointDao.position,
                billboard: new Cesium.BillboardGraphics(DEF_BILLBOARD_STYLE),
            })
            this._billboard.push(billboard)
        })
        //this.entities = this._pointEntities
        this.billboardEntities = this._billboard
    }
}

export default AddPoints;