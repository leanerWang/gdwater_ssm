import RectangleDao from "../../Dao/RectangleDao.js"
import Computer from "./Computer.js"



class ComputerRectangle extends Computer{
    constructor(rectangle, cellDao){
        super()
        if (!rectangle) {
            return
        }
        this._rectangle = rectangle
        this._cellDao = cellDao
        this._xs = cellDao.xNumber
        this._ys = cellDao.yNumber
        this._recs = undefined
        this._computer()
    }

    get cellDao(){return this._cellDao}

    get recs(){
        return this._recs
    }

    _computer(){
        let rec = this._rectangle
        let lnt = rec.east - rec.west
        let lat = rec.north - rec.south
        let eachLnt = lnt / this._xs
        let eachLat = lat / this._ys
        this._setValueToDao(eachLnt, eachLat, '弧度')

        let recs = []
        for (let i = 0; i < this._xs; i++) {
            for (let j = 0; j < this._ys; j++) {
                let rect = new Cesium.Rectangle(
                    rec.west + eachLnt*i,
                    rec.south + eachLat*j,
                    rec.west + eachLnt * (i+1),
                    rec.south + eachLat*(j+1)
                )
                let center = Cesium.Rectangle.center(rect, new Cesium.Cartographic())
                let dao = new RectangleDao(rect, [i,j], center)
                recs.push(dao)
            } 
        }
        this._recs = recs
        return recs
    }

    _setValueToDao(l, w, u ){
        this._cellDao.length = l
        this._cellDao.width = w
        this._cellDao.unit = u
    }

}

export default ComputerRectangle