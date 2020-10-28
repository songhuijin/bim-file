<template>
<!--  <div class='model' v-show="visible">-->
<!--    <div style="flex:1" id="domId"></div>-->
<!--  </div>-->
  <div class="model" id="domId" v-if="visible"></div>
</template>

<script>
    let viewer2D;
    let app;
    let viewToken = '9a303def55db486084da5a9aead5f5b8';
    export default {
        name: "Drawing",
        data() {
            return {
                visible: false
            }
        },
        mounted() {
            // this.loadDrawing();
        },
        methods: {
            loadDrawing() {
                let options = new BimfaceSDKLoaderConfig();
                options.viewToken = viewToken;
                BimfaceSDKLoader.load(options, this.successCallback, this.failureCallback);
            },
            successCallback(viewMetaData) {
                if (viewMetaData.viewType == "drawingView") {
                    // ======== 判断是否为Drawing模型 ========
                    // 获取DOM元素
                    var dom4Show = document.getElementById('domId');
                    var webAppConfig = new Glodon.Bimface.Application.WebApplicationDrawingConfig();
                    webAppConfig.domElement = dom4Show;
                    webAppConfig.drawingUrl = viewMetaData.drawingUrl;
                    webAppConfig.viewToken = viewMetaData.viewToken;
                    // 创建WebApplication
                    app = new Glodon.Bimface.Application.WebApplicationDrawing(webAppConfig);
                    // 添加待显示的模型
                    app.load(viewToken);
                    // 从WebApplication获取viewerDrawing对象
                    viewer2D = app.getViewer();
                    // 监听添加view完成的事件
                    viewer2D.addEventListener(Glodon.Bimface.Viewer.ViewerDrawingEvent.Loaded, function () {
                        let obj = document.getElementById("DrawingdomId-main-drawing");
                        obj.style.position= "unset";
                        //自适应屏幕大小
                        window.onresize = function () {
                            viewer2D.resize(document.documentElement.clientWidth, document.documentElement.clientHeight - 40)
                        }
                    });
                    // viewer2D.addEventListener(Glodon.Bimface.Viewer.ViewerDrawingEvent.MouseClicked, function (objectdata) {
                    //     // 调用viewerDrawing对象的Method，可以继续扩展功能
                    //     alert(JSON.stringify(objectdata))
                    // });
                }
            },
            failureCallback(error) {
                console.log(error);
            }
        }
    }
</script>

<style scoped>
  .model {
    width: 100%;
    height: 100%;
  }
</style>