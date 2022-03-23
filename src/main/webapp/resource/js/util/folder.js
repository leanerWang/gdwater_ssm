Dropzone.autoDiscover = false;

var myDropzone = new Dropzone("#myDropzone", {
    url: "/file/foldUpload", //需要上传的后台接口地址
    method: "post",
    dictDefaultMessage: '拖动文件至此或者点击上传', // 设置默认的提示语句
    paramName: "siteFiles", // 传到后台的参数名称
    autoProcessQueue: false, //关闭自动上传功能，默认会true会自动上传,也就是添加一张图片向服务器发送一次请求
    uploadMultiple: true,
    parallelUploads: 8,
    maxFiles: null,
    createImageThumbnails: false, //关闭缩略图
    maxFilesize: 3072,
    addRemoveLinks: true,
    dictFallbackMessage: '不好意思，您的浏览器不支持！', //如果浏览器不支持,默认消息将被替换为这个文本。默认为 “Your browser does not support drag'n'drop file uploads.”。
    dictInvalidFileType: '该文件不允许上传', //如果文件类型不匹配时显示的错误消息。
    dictResponseError: '上传失败，请稍后重试', //如果服务器响应是无效的时候显示的错误消息。 {{statusCode}} ` 将被  替换为服务器端返回的状态码。
    init: function () {
        let submitButton = $("#submit")
        let removeButton = $("#removeAllFiles")
        this.hiddenFileInput.setAttribute("webkitdirectory", true);
        let timeStamp = null;
        myDropzone = this; // closure
        //为上传按钮添加点击事件
        submitButton.on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (myDropzone.getAcceptedFiles().length !== 0) {
                    timeStamp = new Date().getTime();
                    myDropzone.processQueue();
                }
        });
        //为删除按钮添加事件
        removeButton.on("click", function(){
            myDropzone.getAcceptedFiles().forEach(element => {
                myDropzone.removeFile(element)
            })
            myDropzone.hiddenFileInput.setAttribute("webkitdirectory", true);
        });
        this.on("sending", function (data, xhr, formData) {
            if (!formData.has("folderName")){
                formData.append("folderName", $("#folderName").val());
                formData.append("siteDescription", $("#siteDescription").val());
                formData.append("inlineRadioOptions",$("input[name='inlineRadioOptions']:checked").val())
                formData.append("minLon",$("#minLon").val());
                formData.append("maxLon",$("#maxLon").val());
                formData.append("minLat",$("#minLat").val());
                formData.append("maxLat",$("#maxLat").val());
            }
        });
        this.on("success", function (file,data){
            if (myDropzone.getQueuedFiles().length !== 0) {
                if (myDropzone.getUploadingFiles().length  === 0){
                    myDropzone.processQueue();
                }
            }else {
                let spendTime = (new Date().getTime() - timeStamp) / 1000 / 60;
                let name = file.name
                file.webkitRelativePath ? name = file.webkitRelativePath: true
                swal("上传成功！", name.split("/")[0] + "，耗时"+spendTime+"分钟", "success")
            }
        })
        this.on("addedfile",function(file){
            showFilename(file)
        });
    }
});

function showFilename(file) {
    // let length = files.length
    // for (let i = 0; i < length; i++) {
    let name = file.name
    if (name === 'meta.json'){
        let reader = new FileReader();
        //异步方式，不会影响主线程
        reader.readAsBinaryString(file);
        reader.onload = function(e) {
            let urlData = this.result;
            if (typeof urlData ===  "string"){
                let dataJson = JSON.parse(urlData)
                //边界赋值
                let east = dataJson.latLonBounds.east
                let north = dataJson.latLonBounds.north
                let south = dataJson.latLonBounds.south
                let west = dataJson.latLonBounds.west
                let inputs1 = $('div#longitudes input')
                let inputs2 = $('div#latitudes input')
                $(inputs1[0]).val(west)
                $(inputs1[1]).val(east)
                $(inputs2[0]).val(south)
                $(inputs2[1]).val(north)
            }
        }
    }
    // }
}


