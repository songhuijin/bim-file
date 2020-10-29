<template>
  <div>
    <div class="head">
      <div class="headLeft">
        BIM文件管理
      </div>
      <div class="headCenter">
        CICDI智慧施工管理平台
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
    background:#001529;
    border-bottom: 4px solid #c5c8ce;
    // background-color: rgb(0,109,240);
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
  .headCenter{
    display: flex;
    align-items: center;
    height: 100%;
    font-size:24px;
    color: white;
    font-weight: 600;
    position: absolute;
    left:50%;
    transform: translate(-50%,0);
    background: #142135;
    padding:0 70px;
  }
  .headCenter:before{
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    position: absolute;
    left:0;
    border-top: 60px solid transparent;
    border-left: 50px solid #001529; 
  }
  .headCenter:after{
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    position: absolute;
    right:0;
    border-top: 60px solid transparent;
    border-right: 50px solid #001529; 
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
