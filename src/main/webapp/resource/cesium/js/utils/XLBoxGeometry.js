import XLBox from './XLBox.js'
import PolylineImageTrailMaterialProperty from '../material/property/PolylineImageTrailMaterialProperty.js'
import addPolylineImageTrailType from '../material/type/polyline.js'
import PolylineLightingTrailMaterialProperty from '../material/property/PolylineLightingTrailMaterialProperty.js'
import addPolylineLightingTrailType from '../material/type/polylineLightingTrail.js'
import XLType from './XLType.js'

class XLBoxGeometry extends XLBox {
    _centerPoint = null
    _centerOffset = null //中心点偏移量
    _dimensions = null
    _offsets = []

    _TrailPloyLineColor = undefined //箭头颜色
    trailPloys = [] //存放已经生成的流动线实体
    lightingTrailPloys = [] //发光流动线
    geometry = undefined //盒子样式
    _boxPrimitives = new Cesium.PrimitiveCollection() //盒子的primitive实体集合
    _boxPrimitive = undefined //一个primitive
    attributeStyle = {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.AQUA)
    }
    appearance = new Cesium.PerInstanceColorAppearance({
        flat: true //使用BoxOutlineGeometry时，要将光照关闭
    })
    _boxEntities = new Cesium.EntityCollection() //盒子entities
    boxEntitiesStyle = {
        material:  Cesium.Color.AZURE.withAlpha(0.1),//Cesium.Color.AQUA.withAlpha(0.5),
        fill:true,
        outline: false,
        outlineColor: Cesium.Color.AZURE,
        set showOutline(flag){this.outline = flag;},
        set changeOutlineColor(color){this.outlineColor = color;} ,
        isID: true //是否给实体添加id属性，为了避免id重复，暂时这样写
    }
    constructor(centerPoint, dimensions, offsets) {
        super()
        this._centerPoint = centerPoint
        this._dimensions = dimensions
        if (offsets) {
            this._offsets = offsets
        }
        this._initModelMatrix(centerPoint)
        addPolylineImageTrailType() //添加流动线材质
        addPolylineLightingTrailType() //添加光线
    }
    /**
     * 初始化模型矩阵和逆矩阵
     * @param {模型坐标原点的世界坐标} centerPosition 
     */
    _initModelMatrix(centerPosition) {
        this.computerModelMatrixInverse(centerPosition)
    }

    /**
     * 初始化网格模型位置,只能是奇数
     * @param {模型原点偏移位置} offset 
     * @param {x方向网格个数} xNum 
     * @param {y方向网格个数} yNum 
     */
    initBoxPosition(offset, xNum, yNum) {
        this._centerOffset = offset
        let offsetFinal = Cesium.defaultValue(offset, new Cesium.Cartesian3())
        let halfXNum = Math.floor(xNum/2)
        let halfYNum = Math.floor(yNum/2)
        for (let i = -halfXNum; i < halfXNum + 1; i++) {
            for (let j = -halfYNum; j < halfYNum + 1; j++) {
                let x = j * this._dimensions.x + offsetFinal.x
                let y = i * this._dimensions.y + offsetFinal.y
                let z = 0 + offsetFinal.z
                this._offsets.push(new Cesium.Cartesian3(x, y, z))
            }
        }
        return this._offsets
    }

    initBoxPositionUpdate(offset, xNum, yNum) {
        this._centerOffset = offset
        let offsetFinal = Cesium.defaultValue(offset, new Cesium.Cartesian3())
        let halfXNum = Math.floor(xNum/2);
        let halfYNum = Math.floor(yNum/2);
        let xChangeValue = 0;
        let yChangeValue = 0;
        let xTop = halfXNum + 1;
        let yTop = halfYNum + 1;
        if (xNum % 2 === 0) {
            xChangeValue = this._dimensions.x / 2 ;
            xTop = halfXNum;
        }
        if (yNum % 2 === 0) {
            yChangeValue = this._dimensions.y / 2 ;
            yTop = halfYNum;
        }
        for (let i = -halfXNum; i < xTop; i++) {
            for (let j = -halfYNum; j < yTop; j++) {
                
                let x = i * this._dimensions.x + xChangeValue + offsetFinal.x
                let y = j * this._dimensions.y + yChangeValue + offsetFinal.y
                let z = 0 + offsetFinal.z
                this._offsets.push({
                    position:[i+halfXNum, j+halfYNum], //和元胞挂钩
                    modelPosition:new Cesium.Cartesian3(x, y,z)
                })
            }
        }
        
    }

    /**
     * 初始化网格模型位置
     * @param {模型原点偏移位置} offset 
     * @param {x方向网格个数} xNum 
     * @param {y方向网格个数} yNum 
     * @param {z方向网格个数} zNum 
     */
    initBoxPosition3D(offset, xNum, yNum, zNum) {
        this._centerOffset = offset
        let offsetFinal = Cesium.defaultValue(offset, new Cesium.Cartesian3())
        let halfXNum = Math.floor(xNum / 2)
        let halfYNum = Math.floor(yNum / 2)
        let halfZNum = Math.floor(zNum / 2)
        for (let i = -halfXNum; i < halfXNum + 1; i++) {
            for (let j = -halfYNum; j < halfYNum + 1; j++) {
                for (let k = -halfZNum; k < halfZNum + 1; k++) {
                    let x = j * this._dimensions.x + offsetFinal.x //注意网格坐标的i是坐标系中的y
                    let y = i * this._dimensions.y + offsetFinal.y
                    let z = k * this._dimensions.z + offsetFinal.z
                    this._offsets.push(new Cesium.Cartesian3(x, y, z))
                }
            }
        }
        return this._offsets
    }
    
    initBoxPosition3DUpdate(offset, xNum, yNum, zNum) {
        this._centerOffset = offset
        let offsetFinal = Cesium.defaultValue(offset, new Cesium.Cartesian3())
        let halfXNum = Math.floor(xNum / 2)
        let halfYNum = Math.floor(yNum / 2)
        let halfZNum = Math.floor(zNum / 2)
        let xChangeValue = 0;
        let yChangeValue = 0;
        let zChangeValue = 0;
        let xTop = halfXNum + 1;
        let yTop = halfYNum + 1;
        let zTop = halfZNum + 1;
        if (xNum % 2 === 0) {
            xChangeValue = this._dimensions.x / 2 ;
            xTop = halfXNum;
        }
        if (yNum % 2 === 0) {
            yChangeValue = this._dimensions.y / 2 ;
            yTop = halfYNum;
        } 
        if (zNum % 2 === 0) {
            zChangeValue = this._dimensions.z / 2 ;
            zTop = halfZNum;
        }
        for (let i = -halfXNum; i < xTop; i++) {
            for (let j = -halfYNum; j < yTop; j++) {
                for (let k = -halfZNum; k < zTop; k++) {
                    let x = i * this._dimensions.x + xChangeValue+ offsetFinal.x //注意网格坐标的i是坐标系中的y
                    let y = j * this._dimensions.y + yChangeValue+ offsetFinal.y
                    let z = k * this._dimensions.z + zChangeValue + offsetFinal.z
                    this._offsets.push({
                        position:[i+halfXNum, j+halfYNum, halfZNum-k], //和元胞挂钩
                        modelPosition:new Cesium.Cartesian3(x, y, z)
                    })
                }
            }
        }
    }
    /**
     * 生成盒子
     */
    generate(geometry) {
        if (this._offsets.length == 0) {
            throw new Error('请传入一个非空的偏移坐标...')
        }

        let geometryDefault = Cesium.BoxOutlineGeometry.fromDimensions({
            dimensions: this._dimensions
        })
        this.geometry = Cesium.defaultValue(geometry, geometryDefault)

        let modelMatrix = this.computerModelMatrix(this._centerPoint)
        let geometryInstances = []
        for (const offset of this._offsets) {
            let instance = new Cesium.GeometryInstance({
                geometry: this.geometry,
                modelMatrix: Cesium.Matrix4.multiplyByTranslation(
                    modelMatrix,
                    offset,
                    new Cesium.Matrix4()),
                attributes: this.attributeStyle,
                id: offset.toString()
            });
            geometryInstances.push(instance)
        }

        // 后面有时间再优化
        this._boxPrimitive = new Cesium.Primitive({
            geometryInstances: geometryInstances,
            appearance: this.appearance
        })
        this._boxPrimitives.add(this._boxPrimitive)
        scene.primitives.add(this._boxPrimitives);
    }

    // 获取设置元胞的颜色透明度等
    getAndSetGeometry(position) {
        XLType.determineCartesian3(position)
        let attributes = this._boxPrimitive.getGeometryInstanceAttributes(position.toString());
        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(new Cesium.Color(1, 0, 0, 1));
    }

    removeAllBoxs() {
        if (this._boxPrimitive) {
            this._boxPrimitives.remove(this._boxPrimitive)
            this._boxPrimitive = undefined
        }
    }

    //生成实体通过viewer.entities的方式
    //type 网格id类型
    generateByEntities(type) {
        if (this._offsets.length == 0) {
            throw new Error('请传入一个非空的偏移坐标...')
        }

        //这样子就只需生成一次，节省性能
        if (this._boxEntities.values.length != 0) {
            this._boxEntities.show = true
            return
        }

        for (const offset of this._offsets) {
            let worldPosition = this.computerWorldPosition(offset.modelPosition,this._modelMatrix)
           
            let box = viewer.entities.add({
                position: worldPosition,
                box: {
                    dimensions: this._dimensions,
                    ...this.boxEntitiesStyle
                },
                id: this.boxEntitiesStyle.isID?type + offset.position.toString():null,
            });
            this._boxEntities.add(box)
        }
        //viewer.entities.add(this._boxEntities)
        this._boxEntities.show = true 
    }

    //隐藏实体
    hideAllBoxsByEntities(){
        this._boxEntities.show = false 
    }

    //删除所有实体
    removeAllBoxsByEntities(){
        if (this._boxEntities.values.length > 0) {
            this._boxEntities.values.forEach(element => {
                viewer.entities.remove(element)
            })
        } 
    }

    //更改污染元胞颜色
    getAndSetBoxEntites(id,currentColor){
        // XLType.determineCartesian3(id)
        Cesium.Check.typeOf.object('currentColor',currentColor)
        let boxEntity = this._boxEntities.getById (id.toString())
        if (boxEntity) {
            boxEntity.box.material = currentColor
        }
    }

    //还原污染元胞颜色
    restoreBoxEntites(id){
        XLType.determineCartesian3(id)
        let boxEntity = this._boxEntities.getById (id.toString())
        if (boxEntity) {
            boxEntity.box.material = this.boxEntitiesStyle.material
            boxEntity.box.outline = this.boxEntitiesStyle.outline
            boxEntity.box.outlineColor = this.boxEntitiesStyle.outlineColor
        }
    }

    //更改元胞边框
    changeBoxOutline(flag){
        this._boxEntities.values.forEach((element)=>{
            element.box.outline = flag
        })
    }

    //更改元胞透明度
    changeBoxAlpha(value){
        this._boxEntities.values.forEach((element)=>{
            element.box.material.color.setValue(element.box.material.color.valueOf().withAlpha(parseFloat(value)))
        })
    }

    //是否填充
    isFilled(value){
        this._boxEntities.values.forEach((element)=>{
            element.box.fill = value
        })
    }

    /**
     * 生成流动线
     * @param {起点} startPosition 
     * @param {终点} endPosition 
     */
    generateTrailPloyline(startPosition, endPosition) {
        let color = Cesium.defaultValue(this._TrailPloyLineColor, Cesium.Color.DEEPSKYBLUE)
        let trailPloyline = viewer.entities.add({
            name: 'PolylineTrail',
            polyline: {
                positions: [startPosition, endPosition],
                width: 10,
                material: new PolylineImageTrailMaterialProperty({
                    color: color,
                    speed: 20,
                    image: '../../image/arrow.png',
                    repeat: {
                        x: 4,
                        y: 1
                    }
                }),
            }
        });
        this.trailPloys.push(trailPloyline)

    }

    /**
     * 移除所有流动线
     */
    removeAllTrailPolyline() {
        this.trailPloys.forEach((element) => {
            viewer.entities.remove(element)
        })
    }

    /**
     * 生成发光流动线
     * @param {起点} startPosition 
     * @param {终点} endPosition 
     */
    generateLightingTrailPloyline(startPosition, endPosition) {
        let color = Cesium.defaultValue(this._TrailPloyLineColor, new Cesium.Color(0, 1, 1))
        let trainPloyline = viewer.entities.add({
            name: 'PolylineTrail',
            polyline: {
                positions: [startPosition, endPosition],
                width: 15,
                material: new PolylineLightingTrailMaterialProperty({
                    color: color,
                    speed: 5.0,
                    image: '../../image/lighting.png',
                }),
            }
        });
        this.lightingTrailPloys.push(trainPloyline)

    }

    /**
     * 移除所有发光流动线
     */
    removeAllLightingTrailPolyline() {
        this.lightingTrailPloys.forEach((element) => {
            viewer.entities.remove(element)
        })
    }

    fly(position) {
        let destination = Cesium.Cartesian3.fromDegrees(...position, 100)
        viewer.camera.flyTo({
            destination: destination
        });
    }

    setView(position) {
        let destination = Cesium.Cartesian3.fromDegrees(...position, 100)
        viewer.camera.setView({
            destination: destination
        });
    }

}

export default XLBoxGeometry