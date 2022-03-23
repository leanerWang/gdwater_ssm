import XLType from "../XLType.js";
import Entity from "./Entity.js";


const DEF_STYLES = {
    material: Cesium.Color.GREEN.withAlpha(0.6),
    // height: 5000,
    // extrudedHeight: 8000,
}

class AddRectangle extends Entity {
    constructor(recs) {
        super()
        if (!recs) {
            return
        }
        this.type = 'rectangle'
        this._recs = XLType.numberToArrs(recs)
        this._recEntities = []
        this._getEntities()
    }

    get entities(){
        return this._entities
    }

    set entities(arr) {
        this._entities = arr
        this._addEntities()
    }

    get rectangles(){
        return this._recs
    }

    _getEntities() {
        this._recs.map(item => {
            let res = new Cesium.Entity({
                name: "green little translucent rectangle"+item.position,
                rectangle: {
                    coordinates: item.rectangle,
                    ...DEF_STYLES
                },
                id:this.type+item.position,
            })
            this._recEntities.push(res)
        })
        this.entities = this._recEntities
    }


    // changeColor(id, color){
    //     if (typeof(color) == 'string') {
    //         let etxColor = Cesium.Color.fromCssColorString(color, new Cesium.Color())
    //         this._changeProperty(id, "material", etxColor)
    //     }
    //     if (XLType.isCesiumColor(color)) {
    //         this._changeProperty(id, "material", color)
    //     }
    // }
}

export default AddRectangle