
export default class XLEchartUpdate{
   
    constructor(dom, style){
        style? true: style = 'light'
        this.chart = echarts.init(dom, style);
        
    }
    generate(){
        this.chart.setOption(this.option);
    }
    data;
    set setData(data){
        this.data = data;
        this.option.series[0].data = data;
        this.generate();
    }
    chart;
    xAxis = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
        '7a', '8a', '9a','10a','11a',
        '12p', '1p', '2p', '3p', '4p', '5p',
        '6p', '7p', '8p', '9p', '10p', '11p'];
    yAxis = ['Saturday', 'Friday', 'Thursday',
    'Wednesday', 'Tuesday', 'Monday', 'Sunday'];
   
    option = {
        tooltip: {
            position: 'top'
        },
        grid: {
            height: '50%',
            top: '10%'
        },
        xAxis: {
            type: 'category',
            data: this.xAxis,
            splitArea: {
                show: true
            }
        },
        yAxis: {
            type: 'category',
            data: this.yAxis,
            splitArea: {
                show: true
            }
        },
        visualMap: {
            min: 0,
            max: 10,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%'
        },
        series: [{
            name: 'Punch Card',
            type: 'heatmap',
            data: this.data,
            label: {
                show: true
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };

}