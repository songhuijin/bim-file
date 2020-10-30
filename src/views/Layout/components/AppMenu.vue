<template>
  <div class="menuList">
    <a-menu style="height:100%"
            :default-selected-keys="['0']"
            :default-open-keys="['/file-management']"
            theme="dark"
            mode="inline"
            @click="handleClick"
            :inline-collapsed="collapsed">
      <template v-for="item in menuList" >
        <a-menu-item v-if="!item.children" :key="item.path" :class="{'ant-menu-item-selected':isActive==item.path}">
          <router-link :to="item.path" style="display:flex;align-items:center">
            <a-icon style="font-size:20px" :type="item.meta.icon" />
            <span>{{item.name}}</span>
          </router-link>
        </a-menu-item>
        <a-sub-menu v-else :key="item.path">
          <span slot="title" style="text-align: left;display:block">
            <a-icon type="mail" /><span>{{ item.name }}</span>
          </span>
          <template v-for="i in item.children">
            <a-menu-item v-if="!i.children" :key="i.path" :class="{'ant-menu-item-selected':isActive==i.path}">
              <router-link :to="i.path" style="display:flex;align-items:center">
                <a-icon style="font-size:20px" :type="i.meta.icon" />
                <span>{{i.name}}</span>
              </router-link>
            </a-menu-item>
          </template>
        </a-sub-menu>
      </template>
    </a-menu>


      <!-- <a-menu-item v-for="(item,index) in menuList" :key="index" :class="{'ant-menu-item-selected':item.meta.isActive}">
        <router-link :to="item.path" style="display:flex;align-items:center">
          <a-icon style="font-size:20px" :type="item.meta.icon" />
          <span>{{item.name}}</span>
        </router-link>
      </a-menu-item>
    </a-menu> -->
<!--    <div class="collapsed">-->
<!--      <a-icon style="font-size:15px" type="left" />-->
<!--    </div>-->
  </div>
</template>

<script>
  import { modelRoute } from '../../../config/router.config.js'

  export default {
    data () {
      return {
        isActive:'/page',
        openKeys:'',
        menuList: [...modelRoute],
        collapsed: false
      }
    },
    mounted () {
      let that = this;
      this.isActive = this.$route.path
    },
    methods: {
      handleClick(e) {
        this.isActive = this.$route.path
        // console.log(this.$route.path)
        let adda = this.getOpenKeys(this.menuList,this.isActive)
        console.log(adda)
      },
      toggleCollapsed() {
        this.collapsed = !this.collapsed;
      },
      getOpenKeys(data,path){
        let that = this;
        data.forEach(item=>{
          if(item.children){
            item.children.forEach(i=>{
              if(i.path == path){
                that.openKeys = item.path
                console.log(item.path)
                // return i.path;
              }else{
                that.getOpenKeys(item.children,path)
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
/deep/.ant-menu.ant-menu-dark .ant-menu-item-selected, .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
    background-color: #515a6e;
}
  .menuList {
    width: 200px;
    height: calc(100% - 66px);
    position: absolute;
    margin-top: 66px;
    z-index: 999;
    display: flex;
    flex-direction: column;
  }
  .collapsed {
    width: 200px;
    position: absolute;
    bottom: 10px;
    z-index: 999;
    display: flex;
    flex-direction: column;
    cursor: pointer;
  }
</style>