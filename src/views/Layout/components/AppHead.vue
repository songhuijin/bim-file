<template>
  <div>
    <div class="head">
      <div class="headLeft">
        BIM文件管理
      </div>
      <div class="headRight">
        <a-popover trigger="hover">
          <template slot="content">
            <div class="conItem"><a-icon class="icon" style="color:rgb(255,119,207)" type="global" />语言</div>
            <div class="conItem"><a-icon class="icon" style="color:rgb(99,192,242)" type="folder-open" />项目信息</div>
            <div class="conItem"><a-icon class="icon" style="color:rgb(71,103,234)" type="setting" />系统设置</div>
            <div class="conItem" style="border-bottom:none"><a-icon class="icon" style="color:rgb(255,156,1)" type="unordered-list" />更多</div>
          </template>
          <a-icon style="font-size:18px" type="setting" />
        </a-popover>
<!--        <a-icon style="font-size:20px" type="setting" />-->
        <a-popover trigger="hover">
          <template slot="content">
            <div class="conItem"><a-icon class="icon" style="color:rgb(99,192,242)" type="user" />新手入门</div>
            <div class="conItem" style="border-bottom:none"><a-icon class="icon" style="color:rgb(99,192,242)" type="read" />帮助手册</div>
          </template>
          <a-icon style="font-size:18px;margin-left:24px" type="question-circle" />
        </a-popover>
        <img src="~@/assets/touxiang.jpg" />
        欢迎您，张慧
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    methods: {

    }
  }
</script>

<style lang="less" scoped>
  .head {
    width: 100%;
    height: 66px;
    position: absolute;
    z-index: 999;
    background-color: rgb(0,109,240);
    img {
      height: 32px;
      width: 32px;
      margin-left: 24px;
      margin-right: 8px;
      border-radius: 16px;
    }
  }
  .headLeft{
    left: 22px;
    display: flex;
    align-items: center;
    height: 100%;
    font-size:24px;
    color: white;
    font-weight: 600;
    position: absolute;
  }
  .headRight{
    right: 22px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    position: absolute;
    color:white
  }
  .conItem {
    cursor: pointer;
    display: flex;
    align-items: center;
    border-bottom: 0.5px solid #c8c8c8;
    padding: 10px 15px;
    .icon {
      margin-right:8px;
      font-size: 18px;
    }
  }
</style>
