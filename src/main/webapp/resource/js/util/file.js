Dropzone.autoDiscover = false;
var myDropzone = new Dropzone("#myDropzone", {
    url: "/file/upload", //需要上传的后台接口地址
    method:"post",
    dictDefaultMessage: '拖动文件至此或者点击上传', // 设置默认的提示语句
    paramName: "siteFile", // 传到后台的参数名称
    autoProcessQueue: false, //关闭自动上传功能，默认会true会自动上传,也就是添加一张图片向服务器发送一次请求
    uploadMultiple: true,
    parallelUploads: 5,
    maxFiles: 5,
    maxFilesize: 100,
    addRemoveLinks: true,
    dictFallbackMessage: '不好意思，您的浏览器不支持！', //如果浏览器不支持,默认消息将被替换为这个文本。默认为 “Your browser does not support drag'n'drop file uploads.”。
    dictInvalidFileType: '该文件不允许上传', //如果文件类型不匹配时显示的错误消息。
    dictResponseError: '上传失败，请稍后重试', //如果服务器响应是无效的时候显示的错误消息。 {{statusCode}} ` 将被  替换为服务器端返回的状态码。
    init: function () {
        var submitButton = $("#submit")
        myDropzone = this; // closure
        //为上传按钮添加点击事件
        submitButton.on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (myDropzone.getAcceptedFiles().length !== 0) {
                    myDropzone.processQueue();
                }
        });
        this.on("sending", function (data, xhr, formData) {
            formData.append("folderName", $("#folderName").val());
            formData.append("siteDescription", $("#siteDescription").val());
        });
        this.on("success", function (file, data) {
            // 上传成功触发的事件
            //弹窗提示
            swal("上传成功！", file.name,"success")
        });
    }
});


