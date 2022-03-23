
class Entity{
    constructor(){
        if (!viewer) {
            return
        }
        this._viewer = viewer 
        this._overlayLayer = new Cesium.CustomDataSource('entities-overlay-layer')
        this._viewer.dataSources.add(this._overlayLayer)
        this._entities = undefined
        this._type = undefined //实体的类型
        this._iconLayer = null
        this._billboardEntities = undefined
    }

    //更改实体数据集
    _init(name){
        this._overlayLayer = new Cesium.CustomDataSource(name)
        this._viewer.dataSources.add(this._overlayLayer)
        this._iconLayer = new Cesium.CustomDataSource(name)
        this._viewer.dataSources.add(this._iconLayer)
    }

    get type(){
        return this._type
    }

    set type(e){
        this._type = e
    }

    get billboardEntities(){
        return this._billboardEntities
    }

    get entities(){
        return this._entities
    }

    get overlayLayer() {
        return this._overlayLayer.entities
    }

    get iconLayer(){
        return this._iconLayer.entities
    }

    _getById(id){
        return this.overlayLayer.getById(id)
    }

    /**
     * 
     * @param {id} id 
     * @param {要更改的实体属性} property 
     * @param {实体样式} style 
     */
    _changeProperty(id, property, style){
        let e = this._getById(id)
        if (e) { 
            e[this._type][property] = style
        }
    }


    _addEntities(){
        if (this._entities.length != 0) {
            this._entities.map(item => {
                this.overlayLayer.add(item)
            })
        }
    }

    _addbillboardEntities(){
        if (this._billboardEntities.length !== 0) {
            this._billboardEntities.map(item => {
                this.iconLayer.add(item)
            })
        }
    }

    _getEntities() {}

    changeColor(id, color){
        if (typeof(color) == 'string') {
            let etxColor = Cesium.Color.fromCssColorString(color, new Cesium.Color())
            this._changeProperty(id, "material", etxColor)
        }
        if (XLType.isCesiumColor(color)) {
            this._changeProperty(id, "material", color)
        }
    }

    // 是否显示
    isShow(flag){
        this.overlayLayer.show = flag;
        this.iconLayer.show = flag;
    }
}

export default Entity