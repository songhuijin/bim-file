<template>
  <div style="height:100%;width:100%">
    <div style="height:100%;width:100%;background-color:white">
      <div style="display:flex;padding:10px 15px;justify-content:space-between">
        <a-button icon="upload" type="primary">模型上传</a-button>
        <a-input style="width:236px" v-model="fileName" placeholder="请输入您所需要查找的内容">
          <a-icon slot="suffix" type="search" style="color:rgba(0,0,0,0.45)"/>
        </a-input>
      </div>
      <div style="display:flex;padding:10px 15px">全部文件</div>
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        @change="handleTableChange">
      <span slot="fileName" slot-scope="text, record">
        <span style='color:rgb(0,109,240);cursor:pointer' @click="showFile">{{text}}</span>
      </span>
        <span slot="action" slot-scope="text, record">
<!--        leftTop-->
        <a-popover trigger="hover" placement="bottomRight">
          <template slot="content">
            <div class="conItem" style="padding:15px 20px">重命名</div>
            <div class="conItem" style="padding:0 20px 15px">分享</div>
<!--            @click="handleEnjoy"-->
            <div class="conItem" style="padding:0 20px 15px">删除</div>
          </template>
          <span style='color:rgb(0,109,240);cursor:pointer;font-weight:600'>…</span>
        </a-popover>
      </span>
      </a-table>
    </div>
    <iframe class="pdf" v-if="visible" src="http://172.16.12.51/2020_PDF.pdf" width="1100" height="300"></iframe>
    <a-button @click="handleCancel" class="button" type="primary" v-if="visible">取消预览</a-button>
    <!--    <a-modal-->
    <!--      title="PDF文件预览"-->
    <!--      :visible="visible"-->
    <!--      :maskClosable="false"-->
    <!--      :width="1100"-->
    <!--      :footer="null"-->
    <!--      @cancel="handleCancel">-->
    <!--      <pdf src="/qr-code/2020_PDF.pdf" :page="currentPage"></pdf>-->
    <!--    </a-modal>-->
    <a-modal
      title="文件分享"
      :visible="enjoy"
      :maskClosable="false"
      :width="400"
      :footer="null"
      @cancel="cancelEnjoy">
      <div style="display:flex;flex-direction:column;align-items:center;width:100%">
        <vue-qr :logoSrc="imageSrc"
                text="http://172.16.12.51/2020_PDF.pdf"
                :size="236"
                :margin="0"
                :logoScale="60"
        ></vue-qr>
        <div style="display:flex;flex-direction:column;margin-top:20px">
          <span>我分享了文件，点击查看：</span>
          <a target="_blank" href="http://172.16.12.51/2020_PDF.pdf">http://172.16.12.51/2020_PDF.pdf</a>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
    import pdf from 'vue-pdf'
    import VueQr from 'vue-qr'
    import {getAction} from '@/api/manage'

    export default {
        name: "Navisworks",
        components: {
            pdf,
            VueQr
        },
        data() {
            return {
                currentPage: 2,
                enjoy: false,
                visible: false,
                fileName: '',
                imageSrc: require("../assets/cicdi.png"),
                columns: [{
                    title: '文件名',
                    align: "center",
                    dataIndex: 'fileName',
                    scopedSlots: {customRender: 'fileName'}
                }, {
                    title: '创建人',
                    align: "center",
                    dataIndex: 'createBy'
                }, {
                    title: '创建时间',
                    align: "center",
                    sorter: true,
                    dataIndex: 'createTime'
                }, {
                    title: '',
                    align: "right",
                    dataIndex: 'action',
                    scopedSlots: {customRender: 'action'}
                }],
                dataSource: [{
                    id: 1,
                    fileName: 'Navisworks',
                    createBy: '张慧',
                    createTime: '2020-09-05 13:30:00',
                    url: 'http://172.16.12.51/model.pdf'
                }],
                /* table加载状态 */
                loading: false,
                /* 分页参数 */
                ipagination: {
                    current: 1,
                    pageSize: 100,
                    total: 0
                },
                // 查询参数
                queryParam: {},
                /* 排序参数 */
                isorter: {
                    column: 'createTime',
                    order: 'desc'
                }
            }
        },
        methods: {
            handleEnjoy() {
                this.enjoy = true;
            },
            cancelEnjoy() {
                this.enjoy = false;
            },
            handleCancel() {
                this.visible = false;
            },
            showFile() {
                this.visible = true;
                // this.$refs.model.visible = true;
            },
            loadData(arg) {
                if (!this.url.list) {
                    this.$message.error("请设置url.list属性!")
                    return
                }
                //加载数据 若传入参数1则加载第一页的内容
                if (arg === 1) {
                    this.ipagination.current = 1;
                }
                let params = this.getQueryParams();//查询条件
                this.loading = true;
                getAction(this.url.list, params).then((res) => {
                    if (res.success) {
                        this.dataSource = res.result.records;
                        this.ipagination.total = res.result.total;
                    }
                    if (res.code === 510) {
                        this.$message.warning(res.message)
                    }
                    this.loading = false;
                })
            },
            getQueryParams() {
                //获取查询条件
                let param = Object.assign(this.queryParam, this.isorter);
                param.field = this.getQueryField();
                param.pageNo = this.ipagination.current;
                param.pageSize = this.ipagination.pageSize;
                return this.filterObj(param);
            },
            filterObj(obj) {
                if (!(typeof obj == 'object')) {
                    return;
                }
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)
                        && (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
                        delete obj[key];
                    }
                }
                return obj;
            },
            getQueryField() {
                let str = "id,";
                this.columns.forEach(function (value) {
                    str += "," + value.dataIndex;
                });
                return str;
            },
            searchReset() {
                this.queryParam = {}
                this.loadData(1);
            },
            handleTableChange(pagination, filters, sorter) {
                //分页、排序、筛选变化时触发
                //TODO 筛选
                if (Object.keys(sorter).length > 0) {
                    this.isorter.column = sorter.field;
                    this.isorter.order = "ascend" == sorter.order ? "asc" : "desc";
                }
                this.ipagination = pagination;
                this.loadData();
            }
        }
    }
</script>

<style scoped>
  .pdf {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1000;
  }
  
  .button {
    position: fixed;
    bottom: 10px;
    left: 10px;
    z-index: 1001;
  }
  
  /deep/ .ant-input {
    color: rgba(0, 0, 0, 0.65);
    background-color: #fff;
    background-image: none;
    border: 1px solid #d9d9d9;
    border-radius: 16px;
  }
  
  /deep/ .ant-modal {
    top: 60px;
  }
  
  .conItem {
    cursor: pointer;
    display: flex;
    align-items: center;
    color: rgb(25, 135, 255);
  }
</style>