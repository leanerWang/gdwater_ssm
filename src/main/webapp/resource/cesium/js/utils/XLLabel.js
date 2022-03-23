import XLType from './XLType.js'

class XLLabel {
    styles={
        font:'sans-serif 10px',
        pixelOffset: new Cesium.Cartesian2(5, 5),
        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e6, 0.1),
    }
    labelCollection = undefined

    constructor() { 
        this.labelCollection = scene.primitives.add(new Cesium.LabelCollection())
    }
    
    gennerate(position,text){
        this.labelCollection.add({
            ...this.styles,
            position : position,
            text     : text.toString(),
            
        })
    }

    removeAll(){
        this.labelCollection.removeAll ()
    }

    /**
     * 
     * @param {污染扩散区域} spreadArea 
     * @param {标签文本} value 
     * @param {样式} style 
     */
    addlabel(spreadArea,value,style) {
        XLType.determineDoubleArray(spreadArea)
        if (this.labelCollection) {
            this.removeAll()
        }
        if (style) {
            this.styles = style
        }
        spreadArea.forEach(element1 => {
            element1.forEach(element2 => {
                this.gennerate(element2.worldPosition,this.getValue(element2,value))
            });
        });
    }

    addlabel3D(spreadArea,value,style) {
        XLType.determineDoubleArray(spreadArea)
        if (this.labelCollection) {
            this.removeAll()
        }
        if (style) {
            this.styles = style
        }
        spreadArea.forEach(element1 => {
            element1.forEach(element2 => {
                element2.forEach((element3)=>{
                    this.gennerate(element3.worldPosition,this.getValue(element3,value))
                })
            });
        });
    }

    getValue(cell,value){
       XLType.determineObject(cell)
       if (value in cell) {
           return eval('cell.'+value)
       }
    }

}

export default XLLabel