/**
 * 判断类型并报错
 */

class XLType{
    constructor(){

    }

    // 判断数组
    static determineArray(arr){
        if (!Array.isArray(arr)) {
            throw new TypeError('请传入一个数组对象...')
        }
    }

    // 判断二维数组
    static determineDoubleArray(arrs){
        this.determineArray(arrs)
        this.determineArray(arrs[0])
    }

    //判断对象
    static determineObject(obj){
        if(! obj instanceof Object){
            throw new Error('请传入一个对象..')
        }
    }

    //判断cartesian3
    static determineCartesian3(obj){
        if (! ('x'in obj & 'y' in obj & 'z' in obj)) {
            throw new Error('请传入一个cartesian3对象....')
        }
    }

     //判断cartesian3
    static determineCartesian3s(...args){
        args.forEach(arg => {
            if (! ('x'in arg & 'y' in arg & 'z' in arg)) {
                throw new Error('请传入一个cartesian3对象....')
            }
        })
       
    }


    // 是否继续进行
    //当传入参数都为真时，返回结果为真； 当传入参数有一个为假时，会弹出警告框，返回假
    static xlAlert(){
        let length = arguments.length
        let flag = true
        if (length < 2) {
            throw new Error('请传入2个以上的参数...')
        }
        for (let i = 0; i < length-1; i++) {
            if (!arguments[i]) {
                alert(arguments[length-1]);
                flag = false
                break
            }
        }
        return flag      
    }

    //参数不能为空或未定义
   static notBeNull(...args){
        args.forEach(arg => {
           if (arg == null || arg == undefined) {
               throw new Error("传入参数不能为空或未定义...")
           }
       });
   }

   //不能为空或未定义
    static isDefined(...args){
        let flag = true;
        for (const arg of args) {
            if (arg == null || arg == undefined) {
                flag = false;
            }
        }
        return flag;
    }
       
    static merge(dest, ...sources) {
        let i, j, len, src
        for (j = 0, len = sources.length; j < len; j++) {
          src = sources[j]
          for (i in src) {
            dest[i] = src[i]
          }
        }
        return dest
      }

      static isCartesian3(p){
          if ('z' in p) {
              return true
          }else{
              return false
          }
      }

      static numberToArrs(recs){
        if (!Array.isArray(recs)) {
            let recss = new Array()
            recss.push(recs)
            return recss
        }else{
            return recs            
        }
      }


      static isCesiumColor(c){
          if (c.red) {
              return true
          }else{
              return false
          }
      }

      static isRectangleDao(r){
          if (r.type == 'RectangleDao') {
              return true
          }else{
              return false
          }
      }

      //提取数组中的一个值重新组成一个数组
      static extractArrs(arrs, value){
        let result = arrs.map(item => {
            return item[value]
        })
        return result
      }
    
}    

export default XLType