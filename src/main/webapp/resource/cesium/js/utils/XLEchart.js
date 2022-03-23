import xlType from './XLType.js'

class XlEchart{
    chart = undefined
    options = {
        grid3D: {},
        xAxis3D: {},
        yAxis3D: {},
        zAxis3D: {},
        grid3D: {
            axisLine : {
                lineStyle:{
                    color:'#fff'
                }
            },
            axisPointer:{
                lineStyle:{
                    color:'#ffbd67'
                }
            }
        },
        
        visualMap: {
            top: 'middle',
            calculable: true,
            dimension: 'z',
            max:9,
            text:['Z值'],
            inRange: {
                color: ['#1710c0', '#0b9df0', '#00fea8', '#00ff0d', '#f5f811', '#f09a09', '#fe0300'],
                opacity:[0.2,1.0],
                symbolSize: [8,20]
            },
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {},
        series: [{
            name:'x  y  z  质量g  浓度g/l',
            type: 'scatter3D',
            //type: 'surface',
            data:[],
            dimensions:['x','y','z','质量','浓度'],
            encode: { tooltip: [0,1,2,3,4] },
            itemStyle: {
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.8)'
            }
        }],
        title: {
            text: '污染物浓度分布',
            subtext: 'xinlei',
            textStyle:{color:'#fff'}
        },
        toolbox: {
            show: true,
            feature: {
                myTool1: {
                    show: true,
                    title: '散点图',
                    icon: 'image://../../image/scatter3D.png',
                    onclick: function (){  
                    }
                },
                myTool2: {
                    show: true,
                    title: '三维曲面图',
                    icon: 'image://../../image/surface.png',
                    onclick: function (){  
                    }
                },
                myTool3: {
                    show: true,
                    title: '立体柱状图',
                    icon: 'image://../../image/bar3D.png',
                    onclick: function (){  
                    }
                },
                dataView: {
                    title:'数据视图',
                    readOnly: false 
                },//数据视图，可编辑
                saveAsImage: {
                    backgroundColor:'rgba(42, 42, 42, 0.8);'
                },
                magicType:{
                    type:['scatter3D','surface','bar3D']
                },
                
            },
            iconStyle:{
                color:'#fff'
            },
        },
    }
    constructor(dom,maxX,maxY,maxZ){
        this.chart = echarts.init(dom)
        if (maxX ||maxY || maxZ) {
            this.options.zAxis3D.max = maxZ
            this.options.yAxis3D.max = maxY
            this.options.xAxis3D.max = maxX

            this.options.visualMap.max = maxZ
        }

        this.generateTool('myTool1','scatter3D')
        this.generateTool('myTool2','surface')
        this.generateTool('myTool3','bar3D')
    }

    generate(){
        this.chart.setOption(this.options)
    }

    setDataAndUpdate(position){
        xlType.determineArray(position)
        this.options.series[0].data.push(position)
        this.generate()
    }

    //清空数据
    removeData(){
        this.options.series[0].data = []
    }

    generateTool(toolName,typeStr){
        this.options.toolbox.feature[toolName].onclick =  ()=> {
            this.options.series[0].type = typeStr
            this.generate()
        }
    }
}

export default XlEchart