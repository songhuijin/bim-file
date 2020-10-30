<template>
  <div class="wrapper">
    <div class="project">项目概况</div>
    <div class="flex-between" style="align-items:start">
      <div>
        <div class="flex-box">
          <div class="content-title">项目简介</div>
          <div class="project-desc">
            <div>项目名称：长江新济洲生物多样性展览馆</div>
            <div>工程类别：房建</div>
            <div>建筑用途：公共建筑/展厅</div>
            <div>结构形式：钢筋混凝土</div>
            <div>建筑面积额：3200平方米</div>
            <div>工程造价：1000万</div>
            <div>合同工期：459天</div>
            <div>开工日期：2017年8月30号</div>
            <div>总承包单位：新济州施工队</div>
          </div>
        </div>
        <div class="flex-box">
          <div class="content-title">实时监测</div>
          <div class="project-desc">
            <div class="flex-start">
              <i class="iconfont iconyonghu" style="color:#2f69ea"></i>
               <div class="monitor">
                 <div class="monitor-desc">现场人数</div>
                 <div><span class="monitor-number">16</span>人</div>
               </div>
               <div class="monitor">
                 <div class="monitor-desc">管理员</div>
                 <div><span class="monitor-number">3</span>人</div>
               </div>
            </div>
            <div class="flex-start">
               <i class="iconfont iconcrane__easyic" style="color:#45ad88"></i>
               <div class="monitor">
                 <div class="monitor-desc">现场大型设备</div>
                 <div><span class="monitor-number">1</span>台</div>
               </div>
            </div>
            <div class="flex-start">
               <i class="iconfont iconluowengang5" style="color:#f4ea2a"></i>
               <div class="monitor">
                 <div class="monitor-desc">钢筋</div>
                 <div><span class="monitor-number">1.14</span>吨</div>
               </div>
               <div class="monitor">
                 <div class="monitor-desc">混凝土</div>
                 <div><span class="monitor-number">1203</span>m³</div>
               </div>
            </div>
            <div class="flex-start">
               <i class="iconfont iconhuichen" style="color:#b91f0d"></i>
               <div class="monitor">
                 <div class="monitor-desc">扬尘监测</div>
                 <div><span class="monitor-number">53</span>pm</div>
               </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="flex-box">
          <div class="content-title">环境监测</div>
          <div class="project-desc">
            <div>项目名称：长江新济洲生物多样性展览馆</div>
            <div>工程类别：房建</div>
            <div>建筑用途：公共建筑/展厅</div>
            <div>结构形式：钢筋混凝土</div>
            <div>建筑面积额：3200平方米</div>
            <div>工程造价：1000万</div>
            <div>合同工期：459天</div>
            <div>开工日期：2017年8月30号</div>
            <div>总承包单位：新济州施工队</div>
          </div>
        </div>
        <div class="flex-box">
          <div class="content-title">项目简介</div>
          <div class="project-desc">
            <div id="environmentChart"></div>
          </div>
        </div>
      </div>
      <!-- <div class="flex-right"></div> -->
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      myChartId:[],
    }
  },
  mounted(){
    this.getEnvironmentChart()
  },
  methods:{
    getMyChart(id,option){
      let myChart = this.$echarts.init(document.getElementById(id));
      if(this.myChartId.indexOf(id) == -1){
        this.myChartId.push(myChart)
      }
      myChart.setOption(option)
      let that = this
      setTimeout(function (){
        window.onresize = function () {
          that.myChartId.forEach(item=>{
            // console.log(item)
            item.resize();
          })
        }
      },200)
    },
    getEnvironmentChart(){

    }
  }
};
</script>
<style lang="less">
.wrapper {
  background: #001529;
  width: 100%;
  padding: 10px;
  // height: 100px;
  color: #ffffff;
  text-align: left;
  .project {
    height: 46px;
    line-height: 46px;
    background: #142135;
    padding: 0 20px;
  }
  .content-title {
    position: relative;
    &:before {
      content: "";
      display: inline-block;
      position: absolute;
      bottom: -2px;
      width: 55px;
      height: 2px;
      background: #4e7ea3;
    }
  }
  .flex-box {
    // width: 25%;
    margin: 20px 20px 0 0;
    padding: 20px;
    background: #142135;
    box-shadow: 10px 10px #142235;
    border: 1px solid #1c242f;
    border-radius: 5px;
    .project-desc {
      margin-top: 10px;
    }
    .iconfont{
      font-size:30px;
    }
    .monitor{
      padding:10px 20px;
      &:last-child{
        padding-bottom: 0;
      }
      .monitor-desc{
        font-size: 12px;
        color:#dcdee2;
      }
      .monitor-number{
        font-size:16px;
      }
    }
  }
}
</style>