//处理前后端交互
//基于JQUERY
//元素的NAME属性必须和对象中的属性名称一样

export default class XLInteract{
    constructor(){}

    //获取参数展示
    static getPara(slectors, goalObj){
        $.each($(slectors), function (i, element) { 
            let name = $(element).attr('name');
            if (goalObj) {
                $(element).val(goalObj[name]);
            }
        });
    }

    //设置参数 并返回参数是否有改动
    static setPara(slectors, goalObj){
        let map = new Map();
        $.each($(slectors), function (i, element) { 
            let name = $(element).attr('name');
            map.set(name, $(element).val());
            
        });
        let flag = false;
        for (let [key, value] of map.entries()) {
           if (goalObj[key] !== value) {
                goalObj[key] = value;
               flag = true;
           }
        }
        return flag;
    }

    //获取参数展示 cartesian3
    //三个选项 必须一次为x y z
    static getParaCts(slectors, goalValue){
        if (goalValue) {
            let newArr = [goalValue.x, goalValue.y, goalValue.z];
            $.each($(slectors), function (i, element) { 
                $(element).val(newArr[i]);
            })
        }
    }

    //设置参数 并返回参数是否有改动
    static setParaCts(slectors, goalValue){
        let newArr = new Array(3);
        $.each($(slectors), function (i, element) { 
            newArr[i] =  parseFloat( $(element).val());
            
        });
        let newCartesian3 = new Cesium.Cartesian3(newArr[0], newArr[1], newArr[2]);
        
        let flag = false;
        if (! Cesium.Cartesian3.equals(goalValue, newCartesian3) ) {
            
            goalValue = newCartesian3;
            flag = true;
        }
        return {"isChange":flag, "value":newCartesian3};
    }

    //判断某一个值是否改变
    /**
     * 比较两个对象共有的属性值是否一样
     * 保持同步更新
     * @param {选择器} slector 
     * @param {改变的对象} goalObj 
     * @param {受改变对象影响的对象} updateObj 
     * @returns 
     */
    static valueIsChange(slector, goalObj, updateObj){
       let value1 =  updateObj[$(slector).attr('name')]
        let value2 = goalObj[$(slector).attr('name')]
        if (value1 != value2) {
            updateObj[$(slector).attr('name')] = value2;
            return true;
        }else{
            return false;
        }
    }

}