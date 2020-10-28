<template>
  <div class="menuList">
    <a-menu style="height:100%"
            :default-selected-keys="['0']"
            mode="inline"
            @click="handleClick"
            :inline-collapsed="collapsed">
      <a-menu-item v-for="(item,index) in menuList" :key="index" :class="{'ant-menu-item-selected':item.meta.isActive}">
        <router-link :to="item.path" style="display:flex;align-items:center">
          <a-icon style="font-size:20px" :type="item.meta.icon" />
          <span>{{item.name}}</span>
        </router-link>
      </a-menu-item>
    </a-menu>
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
        menuList: [...modelRoute],
        collapsed: false
      }
    },
    mounted () {
      let that = this;
      this.menuList.map(item => {
        if (that.$route.path.indexOf(item.path) > -1) {
          item.meta.isActive = true
        }
      });
    },
    methods: {
      handleClick(e) {
        console.log('click', e.key);
        this.menuList.map((item, index) => {
          if (index === e.key) {
            item.meta.isActive = true;
          } else {
            item.meta.isActive = false;
          }
        })
      },
      toggleCollapsed() {
        this.collapsed = !this.collapsed;
      }
    }
  }
</script>

<style scoped>
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