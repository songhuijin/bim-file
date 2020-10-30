<template>
  <div style="height:100%;width:100%">
    <div style="height:100%;width:100%;background-color:white" v-if="visible">
      <div style="display:flex;padding:10px 15px;justify-content:space-between">
        <div style="display:flex">
          <div class="upload-btn-box">
            <a-button icon="upload" class="primary-btn" @click="choiceImg"
              >模型上传</a-button
            >
            <input
              ref="inputer"
              type="file"
              class="upload-file"
              @change="handleFileChange"
            />
          </div>
          <a-button
            icon="folder-add"
            @click="handleAdd"
            class="border-btn"
            style="margin-left:8px"
          >
            新建文件夹
          </a-button>
        </div>
        <a-input
          style="width:236px"
          v-model="fileName"
          placeholder="请输入您所需要查找的内容"
        >
          <a-icon slot="suffix" type="search" style="color:rgba(0,0,0,0.45)" />
        </a-input>
      </div>
      <!-- 面包屑 -->
      <div class="breadcrumbs">
        <a-breadcrumb>
          <span
            v-for="(item, index) in breadcrumbName"
            :key="index"
            @click="itemParent(index)"
          >
            <a-breadcrumb-item href="#">{{ item }}</a-breadcrumb-item>
          </span>
        </a-breadcrumb>
      </div>
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="fileName" slot-scope="text, record">
          <a @click="fileItems(record)" class="btn">
            <a-icon type="folder" v-if="record.isFile == '0'" />
            <a-icon type="file" v-if="record.isFile == '1'" />
            {{ text }}
          </a>
        </span>
        <span slot="action" slot-scope="text, record">
          <!--        leftTop-->
          <a-popover trigger="hover" placement="bottomRight">
            <template slot="content">
              <div
                class="conItem"
                style="padding:15px 20px"
                @click="handleRename(record)"
              >
                重命名
              </div>
              <div
                v-if="record.isFile == '1'"
                class="conItem"
                style="padding:0 20px 15px"
                @click="downLoad(record)"
              >
                下载
              </div>
              <div
               v-if="record.isFile == '1'"
                class="conItem"
                style="padding:0 20px 15px"
                @click="handleEnjoy(record)"
              >
                分享
              </div>
              <div
                class="conItem"
                style="padding:0 20px 15px"
                @click="handleDelete(record.id)"
              >
                删除
              </div>
            </template>
            <span style="color:rgb(0,109,240);cursor:pointer;font-weight:600"
              >…</span
            >
          </a-popover>
        </span>
      </a-table>
    </div>
    <model ref="model"></model>
    <a-modal
      title="图纸分享"
      :visible="enjoy"
      :maskClosable="false"
      :width="400"
      :footer="null"
      @cancel="cancelEnjoy"
    >
      <div
        style="display:flex;flex-direction:column;align-items:center;width:100%"
      >
        <vue-qr
          :logoSrc="imageSrc"
          text="http://172.16.12.51/cad.html"
          :size="236"
          :margin="0"
          :logoScale="60"
        ></vue-qr>
        <div style="display:flex;flex-direction:column;margin-top:20px">
          <span>我分享了图纸，点击查看：</span>
          <a target="_blank" :href="text">{{text}}</a>
        </div>
      </div>
    </a-modal>
    <FileModal ref="modalForm" @ok="modalFormOk"></FileModal>
    <drawing ref="drawing"></drawing>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import Model from "./Layout/components/Model";
import FileModal from "@/views/pages/components/FileModal";
import Drawing from "./Drawing";

import { getAction, postAction, deleteAction, getFormData } from "@/api/manage";

export default {
  name: "CAD",
  components: {
    Model,
    VueQr,
    FileModal,
    Drawing
  },
  data() {
    return {
      queryParam: {},
      loading: false,
      url: {
        list: "/sys-file/list",
        delete: "/sys-file/delete",
        download: "/sys/common/download/",
        baseUrl:'http://182.92.125.56:8083/'
      },
      clickObj: {},
      clickId: "",
      breadcrumbName: ["全部文件"],
      breadcrumbId: [0],
      fileList: [],
      fileSize: 0,

      enjoy: false,
      visible: true,
      fileName: "",
      imageSrc: require("../assets/cicdi.png"),
      text:'',
      columns: [
        {
          title: "文件名",
          align: "center",
          dataIndex: "name",
          scopedSlots: { customRender: "fileName" }
        },
        {
          title: "创建者",
          dataIndex: "createBy",
          key: "createBy",
          align: "center",
          customRender: (text, record, index) => {
            return "张慧";
          }
        },
        {
          title: "创建时间",
          align: "center",
          sorter: true,
          dataIndex: "createTime"
        },
        {
          title: "",
          align: "right",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      dataSource: [
        {
          id: 1,
          fileName: "公司大楼",
          createBy: "张慧",
          createTime: "2020-09-05 10:30:00"
        }
      ],
      /* table加载状态 */
      loading: false,
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 100,
        pageSizeOptions: ["10", "20", "30"],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条";
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      // 查询参数
      queryParam: {},
      /* 排序参数 */
      isorter: {
        column: "createTime",
        order: "desc"
      }
    };
  },
  mounted() {
    this.queryParam.pid = 0;
    this.loadData();
  },
  watch: {
    clickId() {
      this.breadcrumbName.push(this.clickObj.name);
      this.breadcrumbId.push(this.clickObj.id);
    }
  },
  methods: {
    downLoad(record) {
      getAction(this.url.download + record.id).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", record.name);

        document.body.appendChild(link);
        console.log(res);

        link.click();
      });
    },
    modalFormOk() {
      this.loadData();
    },
    handleAdd() {
      this.$refs.modalForm.title = "新建文件夹";
      this.$refs.modalForm.type = 2;
      this.$refs.modalForm.add(this.queryParam.pid);
    },
    handleRename(record) {
      this.$refs.modalForm.title = "文件重命名";
      this.$refs.modalForm.edit(record);
    },
    handleDelete(id) {
      deleteAction(this.url.delete, getFormData({ id: id })).then(res => {
        if (res.success) {
          this.$message.success(res.message);
          this.loadData();
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    showFile() {
      this.visible = false;
      this.$refs.drawing.visible = true;
      this.$nextTick(() => {
        this.$refs.drawing.loadDrawing();
      });
    },
    choiceImg() {
      this.$refs.inputer.dispatchEvent(new MouseEvent("click"));
    },
    handleFileChange() {
      let inputDOM = this.$refs.inputer;
      let file = inputDOM.files[0]; // 通过DOM取文件数据
      console.log(file);
      //文件路径
      let index= file.name.lastIndexOf(".");
      //获取后缀
      let fileType = file.name.substr(index+1);
      //输出结果
      console.log(fileType);
      if(fileType.toLowerCase() != 'cad'){
        this.$message.error('请上传cad文件！');
        return
      }
      let size = file.size; //计算文件的大小
      let totalSize = this.fileSize + size;
      const isLt25M = totalSize < 25 * 1024 * 1024;
      const isLt10M = size < 10 * 1024 * 1024;
      if (!isLt10M) {
        this.$message.error("单个文件大小必须小于10M！");
      } else if (!isLt25M) {
        this.$message.error("文件大小之和必须小于25M！");
      } else {
        let formData = new FormData(); //new一个formData事件
        formData.append("file", file); //将file属性添加到formData里
        postAction("/sys/common/upload", formData).then(res => {
          if (res.success) {
            this.$message.success("上传成功！");
            this.fileSize += size;
            this.fileList.push({
              name: file.name,
              size: size,
              url: res.message
            });
            inputDOM.value = "";
            let fileData = {};
            fileData.pid = this.queryParam.pid;
            fileData.name = res.result.name;
            fileData.path = res.result.path;
            fileData.userId = 0;
            fileData.isFile = 1;
            fileData.type = 2;
            postAction("/sys-file/add", fileData).then(response => {
              if (response.success) {
                this.$message.success(response.message);
                this.loadData();
              } else {
                this.$message.warning(response.message);
              }
            });
          } else {
            this.$message.warning(res.message);
          }
        });
      }
    },
    loadData() {
      this.loading = true;
      getAction(this.url.list + "?pid=" + this.queryParam.pid + "&type=2&pageSize=10000")
        .then(res => {
          if (res.success) {
            this.dataSource = res.result.records;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    fileItems(record) {
      if (record.isFile == 1) {
        this.showFile();
      } else {
        this.clickObj = record;
        this.clickId = record.id;
        this.queryParam.pid = this.clickObj.id;
        this.loadData();
      }
    },
    itemParent(index) {
      this.breadcrumbName.splice(index + 1, this.breadcrumbName.length);
      this.breadcrumbId.splice(index + 1, this.breadcrumbId.length);
      this.queryParam.pid = this.breadcrumbId[index];
      this.loadData();
    },
    handleEnjoy(record) {
      this.text= this.url.baseUrl+record.path
      this.enjoy = true;
    },
    cancelEnjoy() {
      this.enjoy = false;
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
      if (!(typeof obj == "object")) {
        return;
      }
      for (var key in obj) {
        if (
          obj.hasOwnProperty(key) &&
          (obj[key] == null || obj[key] == undefined || obj[key] === "")
        ) {
          delete obj[key];
        }
      }
      return obj;
    },
    getQueryField() {
      let str = "id,";
      this.columns.forEach(function(value) {
        str += "," + value.dataIndex;
      });
      return str;
    },
    searchReset() {
      this.queryParam = {};
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
};
</script>

<style scoped lang="less">
.upload-btn-box {
  input[type="file"] {
    display: none;
  }
}
/deep/ .ant-input {
  color: rgba(0, 0, 0, 0.65);
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 16px;
}

.conItem {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: rgb(25, 135, 255);
}
</style>



