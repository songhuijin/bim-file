<template>
  <div style="height:100%;width:100%;background-color:white">
    <div style="padding:20px 15px;text-align:left">最近打开</div>
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
        <span style='color:rgb(0,109,240);cursor:pointer'>{{text}}</span>
      </span>
    </a-table>
  </div>
</template>

<script>
    export default {
        name: "LastOpen",
        data() {
            return {
                columns: [{
                    title: '文件名',
                    align: "center",
                    dataIndex: 'fileName',
                    scopedSlots: {customRender: 'fileName'}
                }, {
                    title: '打开时间',
                    align: "center",
                    dataIndex: 'openTime'
                }],
                dataSource: [{
                    id: 1,
                    fileName: '公司大楼',
                    openTime: '2020-09-05 13:30:00',
                    url: 'http://172.16.12.51/cad.html'
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

</style>