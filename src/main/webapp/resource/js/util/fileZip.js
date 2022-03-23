Dropzone.autoDiscover = false;
var myDropzone = new Dropzone("#myDropzone", {
    url: "/file/uploadZip", //需要上传的后台接口地址
    method: "post",
    dictDefaultMessage: '点击添加.zip和.tar的压缩文件', // 设置默认的提示语句
    paramName: "siteFileZip", // 传到后台的参数名称
    autoProcessQueue: false, //关闭自动上传功能，默认会true会自动上传,也就是添加一张图片向服务器发送一次请求
    uploadMultiple: false,
    parallelUploads: 8,
    maxFiles: 5,
    createImageThumbnails: true, //缩略图
    maxFilesize: 3072,
    addRemoveLinks: true,
    dictFallbackMessage: '不好意思，您的浏览器不支持！', //如果浏览器不支持,默认消息将被替换为这个文本。默认为 “Your browser does not support drag'n'drop file uploads.”。
    dictInvalidFileType: '该文件不允许上传', //如果文件类型不匹配时显示的错误消息。
    dictResponseError: '上传失败，请稍后重试', //如果服务器响应是无效的时候显示的错误消息。 {{statusCode}} ` 将被  替换为服务器端返回的状态码。
    init: function () {
        let submitButton = $("#submit")
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
        this.on("sending", function (data, xhr, formData) {
            if (!formData.has("folderName")){
                formData.append("folderName", $("#folderName").val());
                formData.append("siteDescription", $("#siteDescription").val());
                formData.append("inlineRadioOptions",$("input[name='inlineRadioOptions']:checked").val())
            }
        });
        this.on("success", function (file,data){
            let spendTime = (new Date().getTime() - timeStamp) / 1000/60;
            let name = file.name
            file.webkitRelativePath ? name = file.webkitRelativePath: true
            swal("上传成功！", name.split("/")[0] + "，耗时"+spendTime+"分钟", "success")

        });
        this.on('uploadprogress', function(file, progress, bytesSent) {
            if (progress == 100){
                swal({
                    title: "请等待！",
                    text: "文件正在解压上传，请不要关闭当前窗口...",
                    imageUrl: "/images/logo-1.png"
                });
            }
        })


    }
});



