<template>
  <div class="source" id="source" v-if="visible">
    <div class="buttons" v-if="isLoaded">
      <a-button type="primary" class="button" @click="generateViewCode">生成视点二维码</a-button>
<!--      <a-button type="primary" class="button" @click="explosion">爆炸</a-button>-->
<!--      <a-button type="primary" class="button" @click="getCameraStatus">视角</a-button>-->
    </div>
    <div v-if="showCode" class="bf-panel bf-modelTree-panel bf-has-title bf-sizable"
         style="right:10px;top:10px;width:236px;min-height:236px">
      <div class="bf-close" @click="hideCode"></div>
      <div class="bf-title">构件二维码分享</div>
      <div class="bf-panel-body" style="padding:15px 30px 20px;display:flex;flex-direction:column;align-items:center">
        <div v-if="showCode" style="background-color:white;padding:10px 20px;width:100%">
          <vue-qr :logoSrc="imageSrc"
                  :text="componentCodeUrl"
                  :size="100"
                  :margin="0"
                  :logoScale="20"
          ></vue-qr>
          <div
            style="color:black;font-size:12px;font-weight:600;display:flex;margin-top:10px;text-align:left;justify-content: flex-end">
            <span style="width:30%">名称</span>
            <span style="width:60%">{{name}}</span>
          </div>
          <div style="color:black;font-size:12px;font-weight:600;display:flex;text-align:left;justify-content:flex-end">
            <span style="width:30%">类型</span>
            <span style="width:60%">{{categoryName}}</span>
          </div>
          <div style="color:black;font-size:12px;font-weight:600;display:flex;text-align:left;justify-content:flex-end">
            <span style="width:30%">ID</span>
            <span style="width:60%">{{elementId}}</span>
          </div>
        </div>
        <div style="width:100%;display:flex;justify-content:space-around;margin-top:20px">
          <a-button type="primary" size="small">导出图片</a-button>
          <a-button type="primary" size="small">导出打印</a-button>
        </div>
      </div>
    </div>
    <div v-if="viewCode" class="bf-panel bf-modelTree-panel bf-has-title bf-sizable"
         style="right:10px;top:10px;width:236px;min-height:236px">
      <div class="bf-close" @click="hideViewCode"></div>
      <div class="bf-title">视点二维码分享</div>
      <div class="bf-panel-body" style="padding:15px 30px 20px;display:flex;flex-direction:column;align-items:center">
        <vue-qr v-if="viewCode"
                :logoSrc="imageSrc"
                :text="viewCodeUrl"
                :size="160"
                :margin="12"
                :logoScale="36"
        ></vue-qr>
        <div style="width:100%;display:flex;justify-content:space-around;margin-top:20px">
          <a-button type="primary" size="small">导出图片</a-button>
          <a-button type="primary" size="small">导出打印</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import VueQr from 'vue-qr'
    import Util from '@/api/utils'
    import {postAction} from '@/api/manage'

    let arr;
    let app;
    let viewer3D;

    export default {
        name: "OutlineTest",
        components: {
            VueQr
        },
        data() {
            return {
                explore: '爆炸',
                visible: false,
                name: '',
                componentId: '',
                elementId: '',
                categoryName: '',
                isLoaded: false,
                showCode: false,
                viewCode: false,
                viewCodeUrl: '',
                componentCodeUrl: '',
                modelViewer: {
                    toolbar: undefined,  // 工具条
                    annotationmanager: undefined,  // annotation的绘制管理器
                    annotationToolbar: undefined,
                    annotationControl: undefined,  // 重写annotation的保存、取消
                },
                imageSrc: require("../../../assets/cicdi.png"),
                baseUrl: 'http://172.16.12.51:3000',
                // baseUrl: 'http://121.37.197.45:3000',
                url: {
                    add: "/sys-qr-code/add"
                    // add: "/qrcode/save"
                },
                cameraState: '{"name":"persp","position":{"x":-118117.77442876926,"y":-165500.9343622026,"z":56890.37990716948},"target":{"x":834410.8040632994, "y":741380.8602513558, "z":46685.279396391124},"up":{"x":0.005621365710666494, "y":0.005348306549092513, "z":0.999969897479221},"fov":45,"version":1}'
            }
        },
        mounted() {
            Util.$on('hideModel', ()=> {
                this.visible = false;
                // viewer3D.destroy();
            });
            // let BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
            //
            // BimfaceLoaderConfig.dataEnvType = BimfaceEnvOption.Local;
            // BimfaceLoaderConfig.sdkPath = '/qr-code/jssdk';
            // BimfaceLoaderConfig.path = '/qr-code/a0c9e1fa89c0f35022cc92406d5c453c/viewToken.json';
            // BimfaceSDKLoader.load(
            //     BimfaceLoaderConfig,
            //     this.successCallback,
            //     this.failureCallback
            // );

            window.generateComponentCode = this.generateComponentCode;
            window.generateViewCode = this.generateViewCode;
            window.explosion = this.explosion;
            window.renew = this.renew;
        },
        methods: {
            getCameraStatus() {
                let cameraState = viewer3D.getCameraStatus();
                console.log(cameraState);
            },
            loadModal() {
                let BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();

                BimfaceLoaderConfig.dataEnvType = BimfaceEnvOption.Local;
                BimfaceLoaderConfig.sdkPath = '/qr-code/jssdk';
                BimfaceLoaderConfig.path = '/qr-code/a0c9e1fa89c0f35022cc92406d5c453c/viewToken.json';
                BimfaceSDKLoader.load(
                    BimfaceLoaderConfig,
                    this.successCallback,
                    this.failureCallback
                )
            },
            generateViewCode() {
                let cameraState = viewer3D.getCameraStatus();
                console.log(cameraState);
                this.showCode = false;
                postAction(this.url.add, {content: JSON.stringify(cameraState),userId: 0}).then((res) => {
                    if (res.success) {
                        this.viewCodeUrl = this.baseUrl + '?cameraState=' + res.result.id;
                        setTimeout(() => {
                            this.viewCode = true;
                        }, 100);
                    }
                    if (res.code === 510) {
                        this.$message.warning(res.message);
                    }
                })
            },
            explosion() {
                viewer3D.setExplosionExtent(3.0);
                let cameraState = '{"fov":45,"name":"persp","position": {"x": 66906.76685739282, "y": -886292.1063309382, "z": 52240.41117403255},"target": {"x": 1003103.4289036342, "y": 37440.103794186805, "z": 42035.42054936324},"up": {"x": 0.005524956049473199, "y": 0.005447723884279932, "z": 0.9999698981295047},"version": 1,"zoom": 0}'
                viewer3D.setCameraStatus(cameraState);
                viewer3D.render();
                let annotationButton = document.querySelector('.bf-toolbar-bottom .gld-bf-eye');
                annotationButton.title = "恢复";
                annotationButton.innerHTML = "<div onclick='renew()'>恢复</div>";
            },
            renew() {
                viewer3D.setExplosionExtent(0);
                viewer3D.setCameraStatus(this.cameraState);
                viewer3D.render();
                let annotationButton = document.querySelector('.bf-toolbar-bottom .gld-bf-eye');
                annotationButton.title = "爆炸";
                annotationButton.innerHTML = "<div onclick='explosion()'>爆炸</div>";
            },
            successCallback(viewMetaData) {
                if (viewMetaData.viewType == "3DView") {
                    // ======== 判断是否为3D模型 ========
                    // 获取DOM元素
                    let dom4Show = document.getElementById('source');
                    let webAppConfig = new Glodon.Bimface.Application.WebApplication3DConfig();
                    webAppConfig.domElement = dom4Show;
                    // 设置模型爆炸配置项
                    webAppConfig.enableExplosion = true;
                    //是否启用ViewHouse控件
                    webAppConfig.enableViewHouse = false;
                    // 创建WebApplication
                    app = new Glodon.Bimface.Application.WebApplication3D(webAppConfig);
                    // 添加待显示的模型
                    // app.addView(this.viewToken);
                    // 从WebApplication获取viewer3D对象
                    viewer3D = app.getViewer();
                    // 添加待显示的模型
                    viewer3D.addModel(viewMetaData);
                    // 监听添加view完成的事件
                    viewer3D.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, () => {
                        this.isLoaded = true;
                        //自适应屏幕大小
                        window.onresize = function () {
                            viewer3D.resize(document.documentElement.clientWidth, document.documentElement.clientHeight - 40)
                        }
                        // 调用viewer3D对象的Method，可以继续扩展功能
                        this.modelViewer.toolbar = document.querySelector('.bf-toolbar-bottom');
                        let annotationButton = document.createElement('div');
                        annotationButton.title = "爆炸";
                        // annotationButton.title = "视点分享";
                        annotationButton.className = "bf-button gld-bf-eye";
                        annotationButton.innerHTML = "<div onclick='explosion()'>爆炸</div>";
                        // annotationButton.innerHTML = "<div onclick='generateViewCode()'>视点</div>";
                        document.querySelector('.bf-toolbar-bottom').appendChild(annotationButton);
                        //设置摄像机视角
                        viewer3D.setCameraStatus(this.cameraState);
                        viewer3D.setRotationCenter(Glodon.Web.Geometry.Point3d(
                            35815.79281860314,
                            -6051.581983132255,
                            32699.999007023587))
                        viewer3D.render();
                    });
                    // 增加鼠标右键监听事件
                    viewer3D.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ContextMenu, (() => {
                        if (this.componentId) {
                            setTimeout(() => {
                                this.addContextMenu(app);
                            }, 100);
                        }
                    }));
                    viewer3D.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ComponentsSelectionChanged, ((componentData) => {
                        console.log('component', componentData);
                        if (componentData.objectId == this.componentId) {
                            this.componentId = ''
                        } else {
                            this.componentId = componentData.objectId;
                        }
                    }));
                    viewer3D.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked, this.getData);
                }
            },
            getData(data) {
                //获取构件属性
                console.log(data);
            },
            // 在右键菜单中添加施工状态选项
            addContextMenu(app) {
                let tmp = document.createElement('div');
                tmp.innerHTML = "<div class='bf-menu-item user-item' onclick='generateComponentCode()'>生成构件二维码</div>"
                if (document.querySelector('.bf-menu.bf-menu-right')) {
                    document.querySelector('.bf-menu.bf-menu-right').appendChild(tmp);
                } else {
                    document.querySelector('.bf-menu.bf-menu-left').appendChild(tmp);
                }
                let viewer3D = app.getViewer();
                arr = viewer3D.getSelectedComponents();
            },
            generateComponentCode() {
                this.getComponentData(this.componentId);
                document.querySelector('.bf-menu.bf-menu-right').style.visibility = 'hidden';
                this.viewCode = false;
                this.componentCodeUrl = this.baseUrl + '?componentId=' + arr[0];
                setTimeout(() => {
                    this.showCode = true;
                }, 100);
            },
            hideCode() {
                this.showCode = false;
            },
            hideViewCode() {
                this.viewCode = false;
            },
            failureCallback(error) {
                console.log(error);
            },
            loadScript(url, callback) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.onload = () => {
                    callback && callback();
                }
                script.src = url;
                document.head.appendChild(script);
            },
            getComponentData(id) {
                viewer3D.getComponentProperty(id, (objectdata) => {
                    console.log(objectdata);
                    this.name = objectdata.name;
                    this.elementId = objectdata.elementId;
                    this.categoryName = objectdata.properties[0].items[3].value;
                })
            }
        }
    }
</script>

<style lang="less" scoped>
  .code {
    top: 15vh;
    left: 10px;
    z-index: 1000;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 10px;
  }
  
  .qrcode {
    display: inline-block;
    
    img {
      width: 132px;
      height: 132px;
      background-color: #fff; //设置白色背景色
      padding: 6px; // 利用padding的特性，挤出白边
      box-sizing: border-box;
    }
  }
  
  .source {
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  .buttons {
    position: absolute;
    bottom: 8px;
    left: 8px;
    z-index: 1000;
  }
  
  .button {
    min-width: 66px;
    border-radius: 3px;
    /*border: none;*/
    /*background: #11dab7;*/
    /*color: #ffffff;*/
  }
  
  .container {
    line-height: 4vh;
    height: 4vh;
  }
  
  .font {
    font-size: 13px;
    color: navajowhite;
    float: left
  }
  
  .title {
    width: 7vw;
    margin-right: 0;
    margin-left: 1vw;
  }
  
  /deep/ .bf-panel.bf-has-title.bf-sizable.property-panel.bf-property-panel {
    top: 10vh !important;
  }
</style>
