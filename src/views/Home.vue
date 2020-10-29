<template>
  <div style="height:100%;width:100%;background-color:white">
    <div style="display:flex;padding:10px 15px;justify-content:space-between">
      <div style="display:flex">
        <div class="upload-btn-box">
          <a-button icon="upload" class="primary-btn" @click="choiceImg">模型上传</a-button>
          <input ref="inputer" type="file" class="upload-file" @change="handleFileChange">
        </div>
        <a-button icon="folder-add" @click="handleAdd" class="border-btn" style="margin-left:8px">
          新建文件夹
        </a-button>
      </div>
      <a-input style="width:236px" v-model="fileName" placeholder="请输入您所需要查找的内容">
        <a-icon slot="suffix" type="search" style="color:rgba(0,0,0,0.45)"/>
      </a-input>
    </div>
    <!-- 面包屑 -->
    <div class="breadcrumbs">
      <a-breadcrumb>
        <span v-for="(item,index) in breadcrumbName" :key="index" @click="itemParent(index)">
          <a-breadcrumb-item href="#">{{item}}</a-breadcrumb-item>
        </span>
      </a-breadcrumb>
    </div>
    <div>
      <a-table
        :columns="columns"
        :loading="loading"
        ref="table"
        size="middle"
        rowKey="id"
        :pagination="false"
        @change="handleTableChange"
        :data-source="dataSource">
          <span slot="fileName" slot-scope="text,record">
            <a @click="fileItems(record)" class="btn">
              <a-icon type="folder" v-if="record.isFile == '0'"/>
              <a-icon type="file" v-if="record.isFile == '1'"/>
              {{text}}
            </a>
          </span>
        <span slot="action" slot-scope="text,record,index">
          <a-popover trigger="hover" placement="bottomRight">
            <template slot="content">
              <div class="conItem" style="padding:15px 20px" @click="handleRename(record)">重命名</div>
              <div class="conItem" style="padding:0 20px 15px" @click="handleDelete(record.id)">删除</div>
              <div class="conItem" style="padding:0 20px 15px" @click="handleMove(record,index)">移动</div>
            </template>
            <span style='color:rgb(0,109,240);cursor:pointer;font-weight:600'>…</span>
          </a-popover>
        </span>
      </a-table>
    </div>
    <!-- <NewFolder ref="modalForm" @ok="modalFormOk"></NewFolder> -->
    <FileModal ref="modalForm" @ok="modalFormOk"></FileModal>
    <a-modal
      title="PDF文件预览"
      :visible="show"
      :maskClosable="false"
      :width="1100"
      :footer="null"
      @cancel="handleCancel">
      <vue-pdf :src="path" :page="currentPage"></vue-pdf>
    </a-modal>
  
  </div>
</template>

<script>
    import VuePdf from 'vue-pdf'
    // import NewFolder from '@/views/Layout/components/NewFolder'
    import FileModal from '@/views/pages/components/FileModal'
    import { getAction, postAction,deleteAction,getFormData} from '@/api/manage'
    export default {
        name: "Home",
        components: {
            VuePdf,
            // NewFolder,
            FileModal
        },
        data() {
            return {
                path: '',
                currentPage: 1,
                show: false,
                fileList: [],
                fileSize: 0,
                breadcrumbName: ['全部文件'],
                breadcrumbId: [0],
                renameFile: '',
                fileName: '',
                fileList: [],
                columns: [
                    {
                        title: '文件名',
                        dataIndex: 'name',
                        key: 'name',
                        align: 'center',
                        scopedSlots: {customRender: 'fileName'}
                    },
                    {
                        title: '创建者',
                        dataIndex: 'createBy',
                        key: 'createBy',
                        align: 'center',
                        customRender: (text, record, index) => {
                            return "张慧";
                        }
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'createTime',
                        key: 'createTime',
                        sorter: true,
                        align: 'center'
                    },
                    {
                        title: '',
                        dataIndex: 'action',
                        key: 'action',
                        align: 'right',
                        scopedSlots: {customRender: 'action'}
                    }
                ],
                list: [],
                dataSource: [],
                queryParam: {},
                clickObj: {},
                clickId: '',
                loading: false,
                url: {
                    list: '/sys-file/list',
                    delete:'/sys-file/delete'
                }
            }
        },
        mounted() {
          this.queryParam.pid = 0
          this.loadData()
        },
        watch: {
            clickId() {
                this.breadcrumbName.push(this.clickObj.name)
                this.breadcrumbId.push(this.clickObj.id)
            }
        },
        methods: {
            choiceImg(){
                this.$refs.inputer.dispatchEvent(new MouseEvent('click'));
            },
            handleFileChange () {
                let inputDOM = this.$refs.inputer;
                let file = inputDOM.files[0];// 通过DOM取文件数据
                console.log(file);
                let size = file.size;//计算文件的大小　
                let totalSize = this.fileSize + size;
                const isLt25M = totalSize < 25 * 1024 * 1024;
                const isLt10M = size < 10 * 1024 * 1024
                if (!isLt10M) {
                    this.$message.error('单个文件大小必须小于10M！');
                } else if(!isLt25M) {
                    this.$message.error('文件大小之和必须小于25M！');
                } else {
                    let formData = new FormData(); //new一个formData事件
                    formData.append("file", file); //将file属性添加到formData里
                    postAction("/sys/common/upload", formData).then((res) => {
                        if (res.success) {
                            this.$message.success("上传成功！");
                            this.fileSize += size;
                            this.fileList.push({name: file.name, size:size, url:res.message});
                            inputDOM.value = '';
                            let fileData = {};
                            fileData.pid = this.queryParam.pid;
                            fileData.name = res.result.name;
                            fileData.path = res.result.path;
                            fileData.userId = 0;
                            fileData.isFile = 1;
                            fileData.type = 3;
                            postAction("/sys-file/add", fileData).then((response) => {
                                if(response.success){
                                    this.$message.success(response.message);
                                    this.loadData();
                                }else{
                                    this.$message.warning(response.message);
                                }
                            })
                        } else {
                            this.$message.warning(res.message);
                        }
                    })
                }
            },
            loadData() {
                this.loading=true
                // console.log(getFormData(this.queryParam))
                getAction(this.url.list+'?pid='+this.queryParam.pid).then((res) => {
                  if (res.success) {
                    this.dataSource = res.result.records
                  }
                }).finally(() => {
                  this.loading=false
                })
            },
            handleCancel() {
                this.show = false;
            },
            fileItems(record) {
                if (record.isFile == 1) {
                    if(record.type == 3) {
                      this.path = "/jeecg-boot/" + record.path;
                      this.show = true;
                    }
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
            handleRename(record) {
              // console.log(record)
                this.$refs.modalForm.title = "文件重命名";
                this.$refs.modalForm.edit(record);
            },
            handleDelete(id) {
              deleteAction(this.url.delete,getFormData({id:id})).then((res) => {
                if (res.success) {
                  this.$message.success(res.message);
                  this.loadData();
                } else {
                  this.$message.warning(res.message);
                }
              });
            },
            handleMove(record, index) {

            },
            modalFormOk() {
              this.loadData();
            },
            handleAdd() {
                this.$refs.modalForm.addTyle = "all";
                this.$refs.modalForm.title = "新建文件夹";
                this.$refs.modalForm.add(this.queryParam.pid);
            },
            handleTableChange(pagination, filters, sorter) {
                //分页、排序、筛选变化时触发
                if (Object.keys(sorter).length > 0) {
                    this.queryParam.column = sorter.field;
                    this.queryParam.order = "ascend" == sorter.order ? "asc" : "desc"
                }
                // console.log(pagination, filters, sorter)
                this.loadData();
            },
        }
    }
</script>

<style lang="less" scoped>
  // /deep/ .ant-input {
  //   color: rgba(0, 0, 0, 0.65);
  //   background-color: #fff;
  //   background-image: none;
  //   border: 1px solid #d9d9d9;
  //   border-radius: 16px;
  // }
  
  .breadcrumbs {
    background: #fff;
    padding: 15px;
    text-align: left;
  }
  
  .conItem {
    cursor: pointer;
    display: flex;
    align-items: center;
    color: rgb(26, 72, 141);
  }

  .upload-btn-box {
    input[type=file] {
      display: none;
    }
  }
</style>
