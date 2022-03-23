
/**
 * 计算类
 * 
 */
class XLComputer{
    _m = 0.084 //静态扩散系数
    _d = 0.16 //斜向扩散系数
    _kdiffs = [] 
    _rows = 9 //行数，Y
    _columns = 9 //列数，X
    _halfGridX = Math.floor(this._columns /2) // 元胞区域X方向半长
    _halfGridY = Math.floor(this._rows /2) //元胞区域Y方向半长
    spreadArea = undefined //所有元胞对象数组
    isPollutedArea = [] //所有被污染的元胞数组
    nextPollutedArea = [] //下一时刻将被污染的元胞数组
    constructor(heightMatrix,mass,rows,columns){
        this._heightMatrix = heightMatrix
        this._mass = mass
        this._rows = Cesium.defaultValue(this._rows, rows)
        this._columns = Cesium.defaultValue(this._columns,columns)
        this._init()
    }

    /**
     * 初始化元胞空间
     */
    _init(){
        this.spreadArea = new Array(this._rows)
        for (let i = 0; i < this._rows; i++) {
            this.spreadArea[i] = new Array(this._columns)
        }
        for (let i = 0; i < this._rows; i++) {
            for (let j = 0; j < this._columns; j++) {
                this.spreadArea[i][j] = {
                    'position':[i,j],
                    'cellMass':this._mass[i][j],
                    'elevation':this._heightMatrix[i][j],
                    'kdiff':0.0, 
                    'boundary':'noBoundary', //边界条件
                    'isPolluted':false, //是否被污染
                    'fatherNode':null, //父节点
                    'childNode':[], //子节点
                    'particlePool':[], //粒子池
                    'isTrailPloy':false, //当前元胞是否已经有流动线
                    'worldPosition':undefined, //元胞世界坐标
                    'modelPosition':undefined, //模型坐标
                    
                }               
                if (i == 0 ) {
                    this.spreadArea[i][j].boundary = 'topBoundary'
                }
                if (j == 0) {
                    this.spreadArea[i][j].boundary = 'leftBoundary'
                }
                if (i == this._rows -1) {
                    this.spreadArea[i][j].boundary = 'buttomBoundary'
                }
                if (j == this._columns -1) {
                    this.spreadArea[i][j].boundary = 'rightBoundary'
                }
                if (i == 0 & j == 0) {
                    this.spreadArea[i][j].boundary = 'leftTopBoundary'
                }
                if (i == 0 & j == this._columns -1) {
                    this.spreadArea[i][j].boundary = 'rightTopBoundary'
                }
                if (i == this._rows & j == 0 ) {
                    this.spreadArea[i][j].boundary = 'leftButtomBoundary' 
                }
                if (i == this._rows & j == this._columns) {
                    this.spreadArea[i][j].boundary = 'rightButtomBoundary'
                }
                if (i == this._halfGridX & j == this._halfGridY) {//污染源初始化时已经被污染
                    this.spreadArea[i][j].isPolluted = true
                    this.isPollutedArea.push(this.spreadArea[i][j])
                }
            }
        }
    }

    /**
     * 计算当前元胞与临近元胞的高差值和与高差比率
     * @param {元胞行号} i 
     * @param {元胞列号} j 
     * @returns 每个元胞的高程差影响因子
     */
    _computerKdiff(i,j){
        let heightMatrix = this._heightMatrix
        let center = heightMatrix[i][j]
        let hfull = 0
        let kdiffs = []
        for (let m = i-1; m < i+2; m++) {
            for (let n = j-1; n < j+2; n++) {
                const element = heightMatrix[m][n]
                let heightDiff = center-element
                if (heightDiff>0) {
                    hfull += heightDiff
                }
            }            
        }
        if (hfull == 0) {//临近元胞高程都大于中心，谷点
            return 0
        }
        let k = 0
        for (let m = i-1; m < i+2; m++) {
            for (let n = j-1; n < j+2; n++) {
                const element = heightMatrix[m][n]
                let heightDiff = center-element
                if (heightDiff >0) {
                    let kdiff = heightDiff / hfull
                    kdiffs[k] = heightDiff / hfull
                    this.spreadArea[m][n].kdiff = kdiff
                }else{
                    kdiffs[k] = 0
                }
                k ++
            }            
        }
        // kdiffs[0] = (heightMatrix[i-1][j-1] -center)/ hfull
        // kdiffs[1] = (heightMatrix[i-1][j]-center)   / hfull
        // kdiffs[2] = (heightMatrix[i-1][j]-center)   / hfull
        // kdiffs[3] = (heightMatrix[i][j-1] -center)  / hfull
        // kdiffs[4] = (heightMatrix[i][j]   -center)  / hfull
        // kdiffs[5] = (heightMatrix[i][j+1] -center)  / hfull
        // kdiffs[6] = (heightMatrix[i+1][j-1] -center)/ hfull
        // kdiffs[7] = (heightMatrix[i+1][j]   -center)/ hfull
        // kdiffs[8] = (heightMatrix[i+1][j+1] -center)/ hfull
        this._kdiffs = kdiffs
        return kdiffs
    }

    /**
     * 计算中央元胞的污染物质量，并更新周围元胞的污染物质量
     * @param {元胞行号} i 
     * @param {元胞列号} j 
     * @returns 每个元胞新的污染物质量
     */
    _computerNewMass(i,j){
        const mxshu = this._m
        const dxshu = this._d
        const centerMass = this.spreadArea[i][j].cellMass
        this.nextPollutedArea = [] //清空下个时刻被污染的元胞数组
        let kdiffs = this._computerKdiff(i,j)
        if (typeof kdiffs == "number" & kdiffs == 0) {//遇到谷点，返回原来的值
            return centerMass
        }
        
        let k = 0
        let crossMass = 0.0
        let inclineMass = 0.0
        for (let m = i-1; m < i+2; m++) {
            for (let n = j-1; n < j+2; n++) {
                let currentMass = this.spreadArea[m][n].cellMass
                if (kdiffs[k] > 0 ) {
                    if (k %2 == 1) {
                        let updateCellMass = mxshu* (kdiffs[k])*(currentMass -centerMass)
                        this.spreadArea[m][n].cellMass += -updateCellMass //更新下个污染元胞的质量
                        crossMass += updateCellMass // 当前元胞的静态扩散量
                        
                    }else{
                        let updateCellMass = mxshu* dxshu * (kdiffs[k])*(currentMass - centerMass) 
                        this.spreadArea[m][n].cellMass += -updateCellMass
                        inclineMass += updateCellMass
                    }
                    if (! this.spreadArea[m][n].isPolluted) { //当前元胞还未被污染，这是新的污染元胞
                        this.spreadArea[m][n].isPolluted = true //表示当前元胞已被污染
                        this.isPollutedArea.push(this.spreadArea[m][n]) //表示所有污染元胞的集合
                        this.spreadArea[m][n].fatherNode = this.spreadArea[i][j].position //为该节点添加父节点
                        this.spreadArea[i][j].childNode.push(this.spreadArea[i][j].position) //为该节点添加子节点
                    }
                    this.nextPollutedArea.push(this.spreadArea[m][n])
                }
                k ++
            }
        }
        let newMass = centerMass + crossMass + inclineMass
        this.spreadArea[i][j].cellMass = newMass
        return newMass
        
        // let newMass = centerMass
        // +m * (kdiffs[1]*(this.spreadArea[i-1][j].cellMass - centerMass)
        // +kdiffs[7] *(this.spreadArea[i+1][j].cellMass -centerMass)
        // +kdiffs[3]*(this.spreadArea[i][j-1].cellMass - centerMass)
        // +kdiffs[5]* (this.spreadArea[i][j+1].cellMass -centerMass))
        // +m* d *(kdiffs[0]*(this.spreadArea[i-1][j-1].cellMass - centerMass)
        // +kdiffs[2]*(this.spreadArea[i-1][j+1].cellMass -centerMass)
        // +kdiffs[6] *(this.spreadArea[i+1][j-1].cellMass -centerMass)
        // +kdiffs[8] *(this.spreadArea[i+1][j+1].cellMass -centerMass))
        // return newMass
    }

    /**
     * 计算元胞一次模拟后的临近3*3元胞的污染物质量（废弃）
     * @param {污染源行号} i 
     * @param {污染源列号} j 
     * 
     */
    _computerCellMass(i,j){
        let currentSpreadArea = this.spreadArea[i][j]
        let updateSpreadArea = [] //下个时刻会被污染的元胞对象
        if (currentSpreadArea.boundary == 'noBoundary') {  //当前元胞无边界  
            for (let m = i-1; m < i+2; m++) {
                for (let n = j-1; n < j+2; n++) {
                    let nearSpreadArea = this.spreadArea[m][n]
                    if (nearSpreadArea.boundary == 'noBoundary') { //相邻元胞无边界
                        let newMass = this._computerNewMass(m,n)        
                        if (newMass > 0) { //质量大于0则更新
                            nearSpreadArea.beforeCellMass = newMass
                            // nearSpreadArea.isPolluted = true
                            nearSpreadArea.isMassUpdate = true
                            if (! nearSpreadArea.isPolluted) { //未被污染则更新
                                updateSpreadArea.push(nearSpreadArea)
                                this.isPollutedArea.push(nearSpreadArea)
                                nearSpreadArea.isPolluted = true
                            }
                        }
                    }    
                }
            }
        }
        return updateSpreadArea
    }

    /**
     * 污染物质量计算、更新的入口函数
     * @param {被污染的元胞对象} currentSpreadArea 
     */
    computerCellMass(currentSpreadArea){
        if (currentSpreadArea.boundary == 'noBoundary') {  //当前元胞无边界  
            let position = currentSpreadArea.position
            this._computerNewMass(position[0],position[1])
        }
        return this.nextPollutedArea
    }

    /**
     * 更新一个时态后的元胞污染质量(废弃)
     */
    updateCellMass(){
        for (let i = 0; i < this._rows; i++) {
            for (let j = 0; j < this._columns; j++) {
                if (this.spreadArea[i][j].isMassUpdate) {
                    this.spreadArea[i][j].cellMass = this.spreadArea[i][j].beforeCellMass
                    this.spreadArea[i][j].isMassUpdate = false
                }
            }
        }
    }

    /**
     *（废弃）
     * @param {第一个元胞对象} grid1 
     * @param {第二个元胞对象} grid2 
     * @returns  判断第一个元胞高程是否小于第二个，小于为真，大于为假
     */
    heightIsLess(grid1,grid2){
        if(Cesium.defined(grid1.elevation) & Cesium.defined(grid2.elevation)){
            return grid1.elevation - grid2.elevation < 0 ? true:false
        }
    }

}
export default XLComputer