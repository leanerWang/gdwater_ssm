import XLBox from './XLBox.js'
import XLParticleSystem from './XLParticleSystem.js'

class XLBoxParticle extends XLBox {
    _centerPosition = null
    _url = 'http://127.0.0.1:5500/image/whatever.jpg'
    _particleStyle = {} //粒子样式
    particleStyle = {
        Color: Cesium.Color.RED, //开始颜色
        emitter: new Cesium.BoxEmitter(new Cesium.Cartesian3(1,1,1)),
        speed: 0,
        imageSize: new Cesium.Cartesian2(11.0, 11.0),
        emissionRate: 20.0,
        loop: false,
        lifetime: 5,
        particleNumber: 100,
    } //粒子样式 改 2021年5月15日17:10:13
    speedRatio = 1 //粒子运动速度倍率
    maxDistance = 0.1 //粒子停止运动的最大范围
    massRatio = 1 //粒子数、该元胞污染物质量比率
    _modelMatrix = null //模型到世界的旋转矩阵
    _emitterInitialLocation = new Cesium.Cartesian3() //粒子发射的模型坐标
    _emitterModelMatrix = undefined
    _particleSystem = null //粒子系统
    _speed = 6000 //粒子速度
    _positionOffset = 0.0
    _dimensions = undefined //盒子长宽高
    _update = (particle, dt) => {
        if (particle.endPosition) { //有终点就会开始运动
            let distance = Cesium.Cartesian3.distance(particle.endPosition, particle.position)
            let positionDiff = Cesium.Cartesian3.subtract(particle.endPosition, particle.position, new Cesium.Cartesian3())
            Cesium.Cartesian3.normalize(positionDiff, particle.velocity)
            //Cesium.Cartesian3.multiplyByScalar(particle.velocity, 10000, particle.velocity) //(优化)
            Cesium.Cartesian3.multiplyByScalar(particle.velocity, this.speedRatio, particle.velocity) //(优化)
            
             //if (distance < 100) { //(优化)
            if (distance < this.maxDistance) { 
                particle.endPosition = null
                particle.velocity = new Cesium.Cartesian3()
            }

        }
    }

    /**
     * 
     * @param {模型中心世界坐标} centerPosition 
     * @param {盒子大小} dimensions 
     * @param {粒子发射模型偏移坐标} emitterInitialLocation 
     * 
     */
    constructor(centerPosition, dimensions,emitterInitialLocation) {
        super()
        if (emitterInitialLocation) {
            this._emitterInitialLocation = emitterInitialLocation
        }
        this._emitterModelMatrix = XLBoxParticle.computerEmitterModelMatrix(this._emitterInitialLocation)
        this._dimensions = dimensions
        this._centerPosition = centerPosition
        this._modelMatrix = this.computerModelMatrix(centerPosition)
    }

    get particleSystem() {
        return this._particleSystem
    }
    set particleSystem(value){
        if (value) {
            this._particleSystem = value
        }
    }

    get particles() {
        if (this.particleSystem) {
            return this.particleSystem._Particles
        }
    }

    /**
     * 
     * @returns 生成粒子系统，并返回指定数量存活的粒子数组
     */
    generate() {
        if (this._centerPosition == null | this._modelMatrix == null) {
            throw new Error('污染源、模型矩阵不能为空...')
        }
        let newParticleSystem = new XLParticleSystem({
            ...this._particleStyle,
            Color: Cesium.Color.RED, //开始颜色
            emitter: new Cesium.BoxEmitter(new Cesium.Cartesian3(50000, 50000, 25000)),
            image: XLBoxParticle.getImage(),
            // particleLife:20, //粒子生存时间
            speed: 0,
            imageSize: new Cesium.Cartesian2(17.0, 17.0),
            emissionRate: 20.0,
            loop: false,
            lifetime: 5,
            particleNumber: 100,
            //mass:10.0,
            updateCallback: this._update,
            modelMatrix: this._modelMatrix,
            emitterModelMatrix: this._emitterModelMatrix
        });
        this.particleSystem = scene.primitives.add(newParticleSystem)
    }

    //改 2021年5月15日17:04:45
    generateCoupling() {
        if (this._centerPosition == null | this._modelMatrix == null) throw new Error('污染源、模型矩阵不能为空...');
        let newParticleSystem = new XLParticleSystem({
            ...this.particleStyle,
            image: XLBoxParticle.getImage(),
            updateCallback: this._update,
            modelMatrix: this._modelMatrix,
            emitterModelMatrix: this._emitterModelMatrix
        });
        this.particleSystem = scene.primitives.add(newParticleSystem)
    }

    /**
     * 颜色更新
     * @param {颜色} color 
     */
    changeColor(color){
        if (color) {
            this.particleStyle.Color = Cesium.Color.clone(color);
        }
    }
    /**
     * 
     * @param{粒子发射初始模型位置} emitterInitialLocation
     * @returns 返回模型矩阵
     */
    static computerEmitterModelMatrix(emitterInitialLocation) {
        return Cesium.Matrix4.fromTranslation(
            emitterInitialLocation,
            new Cesium.Matrix4()
        )
    }

    /**
     * 粒子图像的绘制
     * @returns 粒子图像
     */
    static getImage() {
        let particleCanvas = document.createElement('canvas');
        particleCanvas.width = 20;
        particleCanvas.height = 20;
        var context2D = particleCanvas.getContext('2d');
        context2D.beginPath();
        context2D.arc(8, 8, 8, 0, Cesium.Math.TWO_PI, true);
        context2D.closePath();
        context2D.fillStyle = 'rgb(255, 255, 255)';
        context2D.fill();
        return particleCanvas;
    }

    /**
     * 更新粒子函数
     * @param {粒子更新函数} fun 
     */
    updateFun(fun) {
        if (typeof (fun) == 'function') {
            this._particleSystem.updateCallback = fun
        } else {
            throw new TypeError('请传入一个粒子更新函数...')
        }
    }

    /**
     * 
     * @param {粒子系统} particleSystem 
     * @returns 指定时间后返回粒子数组，在原生粒子系统中有效（）
     */
    hasCompleted() {
        return new Promise((resolve, rejecet) => {
            setTimeout(() => {
                resolve(this.particles)
            }, (this.particleSystem.lifetime) * 1000)
        })
    }



    /**弃用 2021年5月17日15:23:11
     * 模拟粒子飞行，从父节点拿元胞粒子，父节点再从父节点拿去，迭代
     * @param {被该元胞污染的下层元胞} nextPollutedGrid 
     * @param {粒子飞行的模型终点坐标} endModelPositon 
     * @param {旋转变化矩阵} modelMatrix 
     */
    particleSimulate_backpack(currentPollutedGrid, nextPollutedGrid,spreadArea) {
        let particlePool = nextPollutedGrid.particlePool
        if (particlePool.length != 0) { //当前元胞粒子池中有粒子
            let len = particlePool.length
            let mass = nextPollutedGrid.cellMass
            let massFormate = Math.ceil(mass) * this.massRatio //当前元胞该有的粒子数量
            if (massFormate > len) {
                let catchParticleNum = massFormate - len
                this._particleCatch(currentPollutedGrid, nextPollutedGrid, catchParticleNum)
            }
        } else { //无粒子
            let nextPollutedGridChange = nextPollutedGrid
            while (nextPollutedGridChange.fatherNode) { //判断是否已经到了根节点，父节点为空就是根节点
                let mass = nextPollutedGridChange.cellMass
                let massFormate = Math.ceil(mass) * this.massRatio
                let particleNumber = nextPollutedGridChange.particlePool.length //当前池中粒子数量
                let catchParticleNum = massFormate - particleNumber > 0 ? massFormate - particleNumber : 0 //要从父节点获取的粒子数量

                let fatherPollutedGridPositon = nextPollutedGridChange.fatherNode //父节点的网格索引
                let fatherPollutedGrid = spreadArea[fatherPollutedGridPositon[0]][fatherPollutedGridPositon[1]] //父节点的元胞

                this._particleCatch(fatherPollutedGrid, nextPollutedGridChange, catchParticleNum)
                nextPollutedGridChange = fatherPollutedGrid //传入父节点，再从上级拿取粒子，迭代进行
            }
        }
    }


    /**
     * 优化 2021年5月17日15:23:01
     * @param {下个步长污染的元胞} nextPollutedGrid 
     * @param {地表元胞} spreadArea 
     * @param {包气带元胞} vadoseSpreadArea 
     * @param {潜水层元胞} gdwaterSpreadArea 
     */
    particleSimulate(nextPollutedGrid,spreadArea,vadoseSpreadArea, gdwaterSpreadArea) {
        let particlePool = nextPollutedGrid.particlePool
        
        let len = particlePool.length
        let mass = nextPollutedGrid.cellMass
        let massFormate = Math.ceil(mass) * this.massRatio //当前元胞该有的粒子数量
        if (massFormate > len) {
            let catchParticleNum = massFormate - len
            let nextPollutedGridChange = nextPollutedGrid
            while (nextPollutedGridChange.fatherNode) { //判断是否已经到了根节点，父节点为空就是根节点
                let fatherPollutedGridPositon = nextPollutedGridChange.fatherNode //父节点的网格索引
                let fatherPollutedGrid = undefined;
                if ((nextPollutedGridChange.name == "surfaceCell" || nextPollutedGridChange.name == "vadoseCell") & fatherPollutedGridPositon.length == 2) { //父节点在地表
                    fatherPollutedGrid = spreadArea[fatherPollutedGridPositon[0]][fatherPollutedGridPositon[1]] //父节点的元胞
                }else if((nextPollutedGridChange.name == "vadoseCell" || nextPollutedGridChange.name == "gdwaterCell") & fatherPollutedGridPositon.length == 3){ //父节点在包气带
                    fatherPollutedGrid = vadoseSpreadArea[fatherPollutedGridPositon[0]][fatherPollutedGridPositon[1]][fatherPollutedGridPositon[2]] //父节点的元胞
                }else if (nextPollutedGridChange.name == "gdwaterCell" & fatherPollutedGridPositon.length == 2) { //父节点在潜水面
                    fatherPollutedGrid = gdwaterSpreadArea[fatherPollutedGridPositon[0]][fatherPollutedGridPositon[1]] //父节点的元胞
                }else{
                    console.log("出现父节点找不到的情况啦...");
                }
                this._particleCatch(fatherPollutedGrid, nextPollutedGridChange, catchParticleNum)
               
                nextPollutedGridChange = fatherPollutedGrid //传入父节点，再从上级拿取粒子，迭代进行
            }
        }   
    }


    /**
     * 从父节点拿元胞粒子，飞行模拟，
     * @param {当前污染元胞} currentPollutedGrid 
     * @param {下一个被污染的元胞} nextPollutedGrid 
     * @param {需要运动的粒子个数} catchParticleNum 
     * @param {终点的模型坐标} endModelPositon 
     * @param {模型矩阵} modelMatrix 
     */
    _particleCatch(currentPollutedGrid, nextPollutedGrid, catchParticleNum) {
        let particlePool = currentPollutedGrid.particlePool
        if (particlePool.length != 0) {
            for (let i = 0; i < catchParticleNum; i++) {
                let particle = particlePool.pop() //起始点元胞粒子池删除该粒子

                // 给粒子添加偏移
                let offsetMultiply1 = Cesium.Math.randomBetween(-0.3, 0.3)
                let offsetMultiply2 = Cesium.Math.randomBetween(-0.3, 0.3)
                let offsetMultiply3 = Cesium.Math.randomBetween(-0.3, 0.3)
                let offset = Cesium.Cartesian3.multiplyComponents(this._dimensions, new Cesium.Cartesian3(offsetMultiply1, offsetMultiply2, offsetMultiply3), new Cesium.Cartesian3())
                let endModelPositonScrach = Cesium.Cartesian3.add(nextPollutedGrid.modelPosition, offset, new Cesium.Cartesian3())
                let endWorldPositon = this.computerWorldPosition(endModelPositonScrach, this._modelMatrix)
                
                this._catchOriginParticle(particle, this.particleSystem, endWorldPositon)
                nextPollutedGrid.particlePool.push(particle) //终点元胞粒子池中添加粒子
            }

        }
    }

    /**
     * 从粒子系统中获取真正的粒子对象
     * @param {粒子对象} particle 
     * @param {粒子系统对象} system 
     * @param {飞行终点的世界坐标} endWorldPositon 
     */
    _catchOriginParticle(particle, system, endWorldPositon) { //获取粒子池中的粒子,给粒子添加终点位置
        //改变飞行粒子颜色
        particle.startColor =  Cesium.Color.clone(this.particleStyle.Color);
        particle.endColor =  Cesium.Color.clone(this.particleStyle.Color);
        //添加终点位置
        system._Particles[particle.id].endPosition = endWorldPositon
    }

    
    

}

export default XLBoxParticle