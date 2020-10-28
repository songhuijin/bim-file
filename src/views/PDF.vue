<template>
  <div style="height:100%;width:100%">
<!--    <div id="example1" style="height:600px;width: 80%;margin: 0 auto"></div>-->
    <div style="height:100%;width:100%;background-color:white">
      <div style="display:flex;padding:10px 15px;justify-content:space-between">
        <a-button icon="upload" type="primary">模型上传</a-button>
        <a-input @change="loadData" style="width:236px" v-model="queryParam.name" placeholder="请输入您所需要查找的内容">
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
        :loading="loading">
        <span slot="fileName" slot-scope="text, record">
          <span style='color:rgb(0,109,240);cursor:pointer' @click="showPDF">{{text}}</span>
        </span>
        <span slot="action" slot-scope="text, record">
<!--        leftTop-->
        <a-popover trigger="hover" placement="bottomRight">
          <template slot="content">
            <div class="conItem" style="padding:15px 20px">重命名</div>
            <div class="conItem" style="padding:0 20px 15px" @click="handleEnjoy(record)">分享</div>
            <div class="conItem" style="padding:0 20px 15px" @click="handleDelete(record.id)">删除</div>
          </template>
          <span style='color:rgb(0,109,240);cursor:pointer;font-weight:600'>…</span>
        </a-popover>
      </span>
      </a-table>
    </div>
<!--    <iframe class="pdf" v-if="show" src="/pdf/2020_PDF.pdf" width="1100" height="300"></iframe>-->
<!--    <a-button @click="handleCancel" class="button" type="primary" v-if="show">取消预览</a-button>-->
        <a-modal
          title="PDF文件预览"
          :visible="show"
          :maskClosable="false"
          :width="1100"
          :footer="null"
          @cancel="handleCancel">
          <vue-pdf style="z-index:9999" src="/pdf/2020_PDF.pdf" :page="currentPage"></vue-pdf>
        </a-modal>
    <a-modal
      title="文件分享"
      :visible="enjoy"
      :maskClosable="false"
      :width="400"
      :footer="null"
      @cancel="cancelEnjoy">
      <div style="display:flex;flex-direction:column;align-items:center;width:100%">
        <vue-qr :logoSrc="imageSrc"
                :text="path"
                :size="236"
                :margin="0"
                :logoScale="60"
        ></vue-qr>
        <div style="display:flex;flex-direction:column;margin-top:20px;width:300px">
          <span>我分享了文件，点击查看：</span>
          <a target="_blank" :href="path">{{path}}</a>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
    import VueQr from 'vue-qr'
    import VuePdf from 'vue-pdf'
    import { getAction, deleteAction, getFormData } from '@/api/manage'
    import PDFObject from 'pdfobject'

    export default {
        name: "PDF",
        components: {
            VueQr,
            VuePdf
        },
        data() {
            return {
                path: '',
                currentPage: 2,
                enjoy: false,
                show: false,
                fileName: '',
                imageSrc: require("../assets/cicdi.png"),
                columns: [{
                    title: '文件名',
                    align: "center",
                    dataIndex: 'name',
                    scopedSlots: {customRender: 'fileName'}
                }, {
                    title: '创建人',
                    align: "center",
                    dataIndex: 'createBy',
                    customRender: (text, record, index) => {
                        return "张慧";
                    }
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
                dataSource: [
                    {
                        name: 'model.pdf',
                        createBy: '张慧',
                        createTime: ''
                    }
                ],
                /* table加载状态 */
                loading: false,
                // 查询参数
                queryParam: {
                    type: 3
                },
                url: {
                    list: "/sys-file/list",
                    delete:'/sys-file/delete'
                },
                file: 'http://106.13.36.159:8083/'
            }
        },
        mounted() {
            this.loadData();
            // PDFObject.embed('http://172.16.12.51/2020_PDF.pdf', "#example1");
        },
        methods: {
            handleDelete(id) {
                deleteAction(this.url.delete, getFormData({id:id})).then((res) => {
                    if (res.success) {
                        this.$message.success(res.message);
                        this.loadData();
                    } else {
                        this.$message.warning(res.message);
                    }
                });
            },
            handleEnjoy(record) {
                this.path = this.file +  record.path;
                this.enjoy = true;
            },
            cancelEnjoy() {
                this.enjoy = false;
            },
            handleCancel() {
                this.show = false;
            },
            showPDF() {
                this.show = true;
            },
            loadData() {
                this.loading = true;
                getAction(this.url.list + `?type=${this.queryParam.type}`).then((res) => {
                    if (res.success) {
                        this.dataSource = res.result.records;
                    }
                }).finally(() => {
                    this.loading = false;
                })
            },
            searchReset() {
                this.queryParam = { type: 3 };
                this.loadData(1);
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