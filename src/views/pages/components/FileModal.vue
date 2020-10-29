<template>
  <a-modal
    :width="500"
    :visible="visible"
    :title="title"
    ok-text="确认"
    cancel-text="取消"
    @ok="handleSubmit"
    @cancel="close"
  >
    <div class="flex-between">
      <a-input v-model="newFolderName" placeholder="请输入文件夹名称..."></a-input>
      <a-select v-model="type" style="width: 200px;margin-left:20px"
        placeholder="请选择文件夹类型..."
        v-if="this.addTyle=='all'">
        <a-select-option v-for="(item,index) in fileType" :key="index">
          {{ item }}
        </a-select-option>
      </a-select>
    </div>
  </a-modal>
</template>

<script>
import { httpAction } from "@/api/manage";
export default {
  name: "NewFolder",
  data() {
    return {
      visible: false,
      title: "",
      newFolderName: "",
      type:0,//文件类型
      fileType:['Revit','Navisworks','CAD','PDF'],
      editObj: {},
      pid: null,
      addTyle:'',
      url: {
        add: "/sys-file/add",
        edit: "/sys-file/edit"
      }
    };
  },
  methods: {
    add(arg) {
      this.pid = arg;
      this.visible = true;
    },
    edit(record) {
      this.editObj = record;
      this.newFolderName = this.editObj.name
      console.log(record)
      this.visible = true;
    },
    handleSubmit() {
      if (!this.newFolderName) {
        this.$message.warning("名称不能为空！");
        return;
      }
      let formData = {};
      let httpurl = "";
      let method = "";
      if (this.title == "新建文件夹") {
        httpurl += this.url.add;
        method = "post";
        formData.pid = this.pid;
        formData.name = this.newFolderName;
        formData.userId = 12345;
        formData.type = this.type;
      } else if (this.title == "文件重命名") {
        httpurl += this.url.edit;
        method = "put";
        formData = this.editObj;
        formData.name = this.newFolderName;
      }

      httpAction(httpurl, formData, method)
        .then(res => {
          if (res.success) {
            this.$message.success(res.message);
            this.$emit("ok");
          } else {
            this.$message.warning(res.message);
          }
        })
        .finally(() => {
          // that.confirmLoading = false;
          this.close();
        });
    },
    close() {
      this.visible = false;
      this.newFolderName = "";
      this.type = 'Revit'
      this.dataIndex = null;
    }
  }
};
</script>

<style scoped>
</style>