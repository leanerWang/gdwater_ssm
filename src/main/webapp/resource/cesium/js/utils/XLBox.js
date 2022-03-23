import XLType from './XLType.js'

/**顶层父类 */
class XLBox{
    constructor(){
        this._modelMatrix = undefined
        this._worldToModel = undefined
    }

    computerModelMatrix(centerPosition){
        this.determineTypeCartesian3(centerPosition)
        this._modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(centerPosition)
        return this._modelMatrix
    }

    computerModelMatrixInverse(centerPosition){
        if (this._worldToModel) {
            return this._worldToModel
        }
        if (!this._modelMatrix) {
            this._modelMatrix = this.computerModelMatrix(centerPosition)
        }
        this._worldToModel = this.inverseModelMatrix()
        return this._worldToModel
    }

    inverseModelMatrix(){
        this._worldToModel = Cesium.Matrix4.inverseTransformation( 
            this._modelMatrix,
            new Cesium.Matrix4()
        );
        return this._worldToModel
    }

    computerWorldPosition(modelPosition,modelMatrix){
        this.determineTypeCartesian3(modelPosition)
        return Cesium.Matrix4.multiplyByPoint(
            modelMatrix, 
            modelPosition, 
            new Cesium.Cartesian3() 
        )
    }

    computerModelPosition(worldPosition,worldToModel){
        this.determineTypeCartesian3(worldPosition)
        return Cesium.Matrix4.multiplyByPoint(
            worldToModel, 
            worldPosition, 
            new Cesium.Cartesian3() 
        )
    }

    /**
     * 计算点的模型坐标
     * @param {目标点世界坐标} worldPosition 
     * @param {模型原点坐标} centerPosition 
     */
    computerModelPositionFromCenter(worldPosition,centerPosition){
        let worldToModel = this.computerModelMatrixInverse(centerPosition)
        return this.computerModelPosition(worldPosition,worldToModel)
    }

    computerModelPositionFromCenterArrs(worldPositions,centerPosition){
        XLType.determineArray(worldPositions)
        let modelPositions = []
        if (!this._worldToModel) {
            this.computerModelMatrixInverse(centerPosition)
        }
        worldPositions.map(value => {
            let modelPosition = this.computerModelPosition(value,this._worldToModel)
            modelPositions.push(modelPosition)
        })
        return modelPositions
    }

    /**
     * 计算点的世界坐标
     * @param {目标点模型坐标} modelPosition 
     * @param {模型原点世界坐标} centerPosition 
     */
    computerWorldPositionFromCenter(modelPosition,centerPosition){
        let modelMatrix = this.computerModelMatrix(centerPosition)
        return this.computerWorldPosition(modelPosition,modelMatrix)
    }

    /**判定传进来的变量是cartesian3 */
    determineTypeCartesian3(centerPosition){
        if ((!'x' in centerPosition) | (!'y' in centerPosition) | (!'z' in centerPosition)) {
            throw new Error('请传入一个cartesian类型的位置坐标...')
        }
    }

    /**
     * 将笛卡尔坐标转换为经纬度坐标
     * @param {笛卡尔坐标} cartesian3 
     * @returns 
     */
    cartesian3ToDegrees(cartesian3){
        this.determineTypeCartesian3(cartesian3)
        let postionCarto = Cesium.Cartographic.fromCartesian (cartesian3)
        let longitude = Cesium.Math.toDegrees(postionCarto.longitude )
        let latitude = Cesium.Math.toDegrees(postionCarto.latitude )
        return new Cesium.Cartesian3(longitude,latitude)
    }

    /**
     * 经纬度转cartesian3
     * @param {经度} lon 
     * @param {纬度} lat 
     * @returns 
     */
    degreeToCartesian3(lon, lat){
        return Cesium.Cartesian3.fromDegrees(lon, lat);
    }

    //经纬度转弧度
    degreeToRadians(lon, lat){
        return Cesium.Cartographic.fromDegrees(lon, lat);
    }

    //获取地形高度
    getTerrainHeight(terrainProvider, positions){
        if (terrainProvider.availability){
            return Cesium.sampleTerrainMostDetailed(terrainProvider, positions);
        }else {
            return positions
        }
    }

    //弧度转笛卡尔坐标
    radiansToCartesian3(cartographic){
       return Cesium.Cartographic.toCartesian(cartographic, Cesium.Ellipsoid.WGS84, new Cesium.Cartesian3());
    }

    //弧度转经纬度
    radiansToDegree(r1,r2){
        let lon =Cesium.Math.toDegrees(r1)
        let lat= Cesium.Math.toDegrees(r2)
        return [lon,lat]
    }

}

export default XLBox