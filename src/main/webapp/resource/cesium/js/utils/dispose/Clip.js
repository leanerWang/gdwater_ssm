//裁剪父类

const DEF_OPTION = {
    edgeWidth:1.0,
    edgeColor: Cesium.Color.WHITE,
}

class Clip{

    constructor(viewer){
        if (!viewer) {
            return
        }
        this._options = {}
        this._viewer = viewer
        this._cpc = new Cesium.ClippingPlaneCollection({...DEF_OPTION}) //裁剪面集合
        this._boundingSphere = undefined //包围球
        this._m = undefined
        this._planes = undefined
        this._center = undefined
        this.isFly = true //是否开始飞行
    }

    get center(){return this._center}

    get modelMatrix(){return this._m}

    set modelMatrix(m){
        this._m = m
        this._setCpcOption('modelMatrix', this._m)
    }

    get planes(){return this._planes}

    set planes(p){
        this._planes = p
        this._cpc.removeAll() //移除所有切面
        if (Array.isArray(p)) {
            this._planes.map(item => {
                this._cpc.add(item)
            })
        }else{
            this._cpc.add(p)
        }
    }

    get clippingPlaneCollection(){
        return this._cpc
    }

    /* 暴露出去修改默认属性的接口*/
    setOption(name, value){
        this._options[name] = value
    }

    
    //修改切面集合的属性，私有
    _setCpcOption(name, value){
        this._cpc[name] = value
    }

    // 是佛开启裁剪
    enabled(flag){
        this._setCpcOption('enabled', flag)
    }


    _clip(){
        let globe = this._viewer.scene.globe
        globe.clippingPlanes = this._cpc
        globe.showSkirts = false
    }

    _setView(){
        this._viewer.camera.viewBoundingSphere(
            this._boundingSphere,
            new Cesium.HeadingPitchRange(0.5, -0.5, this._boundingSphere.radius * 5.0)
        )
        this._viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    }
}

export default Clip