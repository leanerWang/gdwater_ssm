

class PointDao{
    constructor(type, position, level) {
        this._t = type//类型比如gdwater
        this._p = position//cartesian3坐标
        this._l = level//如高度值
    }

    get type(){return this._t}

    get position(){return this._p}

    get level(){return this._l}

}

export default  PointDao