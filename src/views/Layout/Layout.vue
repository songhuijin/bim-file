<template>
  <div class="layout" v-if="isInDingding">
    <app-head></app-head>
    <app-main></app-main>
    <app-menu></app-menu>
  </div>
</template>

<script>
    import Util from '@/api/utils'
    import { getAction } from '@/api/manage'
    import AppHead from './components/AppHead.vue'
    import AppMain from './components/AppMain.vue'
    import AppMenu from './components/AppMenu.vue'
    import {modelRoute} from '../../config/router.config.js'

    export default {
        name: 'Layout',
        components: {
            AppHead,
            AppMain,
            AppMenu
        },
        data() {
            return {
                code: '',
                isInDingding: false,
                menuList: [...modelRoute]
            }
        },
        created() {
            if (dd && dd.env.platform !== 'notInDingTalk') {
                this.isInDingding = true;
                dd.ready((() => {
                    dd.runtime.permission.requestAuthCode({
                        corpId: "ding935059a86a5cddfaa39a90f97fcb1e09", // 企业id
                        onSuccess: ((info) => {
                            let code = info.code; // 通过该免登授权码可以获取用户身份'
                            this.code = code;
                            getAction('/ding/login?code='+this.code+'&corpId=ding935059a86a5cddfaa39a90f97fcb1e09').then((res) => {
                                // alert(JSON.stringify(res));
                                this.$notification['success']({
                                    message: '成功',
                                    description: res.result.user.realname + '登录成功！'
                                })
                            })
                        }),
                        onFail: ((err) => {
                            console.log(err);
                            alert('error!');
                        })
                    })
                }))
            } else {
                this.isInDingding = true;
                // this.isInDingding = false;
            }
        },
        watch: {
            $route(to, from){
                this.menuList.map(item => {
                    item.meta.isActive = false
                    if (to.path.indexOf(item.path) > -1) {
                        item.meta.isActive = true
                    }
                })
                if(from.path == '/revit') {
                    console.log(from.path);
                    Util.$emit('hideModel');
                }
            }
            // '$route'(to) { // 监听路由
            //     this.menuList.map(item => {
            //         item.meta.isActive = false
            //         if (to.path.indexOf(item.path) > -1) {
            //             item.meta.isActive = true
            //         }
            //     })
            // }
        }
    }
</script>

<style scoped>
  .layout {
    position: relative;
    height: 100vh;
  }
</style>
