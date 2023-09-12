

<template>
  <div>
    <el-card class="container-card" shadow="always">
      <el-form size="mini" :inline="true" :model="params" class="demo-form-inline">

        <el-form-item label="字典标签"><el-input v-model.trim="params.dict_label" type="input" clearable placeholder="字典标签" @keyup.enter.native="search" @clear="search" />
        </el-form-item>
        <el-form-item label="字典键值"><el-input v-model.trim="params.dict_value" type="input" clearable placeholder="字典键值" @keyup.enter.native="search" @clear="search" />
        </el-form-item>
        <el-form-item label="字典类型"><common-select value-key="id" label-key="dict_name" :selected-value="params.dict_type_id"  @change="changeSearchDictType"  :options="dictTypeOptions" />
        </el-form-item>
        <!--
        <el-form-item label="备注"><el-input v-model.trim="params.remark" type="input" clearable placeholder="备注" @keyup.enter.native="search" @clear="search" />
        </el-form-item>
        <el-form-item label="排序"><el-input v-model.trim="params.sort" type="input" clearable placeholder="排序" @keyup.enter.native="search" @clear="search" />
        </el-form-item>
        <el-form-item label="状态"><el-input v-model.trim="params.status" type="input" clearable placeholder="状态" @keyup.enter.native="search" @clear="search" />
        </el-form-item>
        -->
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-search" type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-plus" type="warning" @click="create">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="multipleSelection.length === 0" :loading="loading" icon="el-icon-delete" type="danger" @click="batchDelete">批量删除</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column show-overflow-tooltip sortable prop="dict_label" label="字典标签" />
        <el-table-column show-overflow-tooltip sortable prop="dict_value" label="字典键值" />
        <el-table-column show-overflow-tooltip sortable prop="dict_type_id" :formatter="formatType" label="字典类型" />
        <el-table-column show-overflow-tooltip sortable prop="remark" label="备注" />
        <el-table-column show-overflow-tooltip sortable prop="sort" label="排序" />
        <!--
        <el-table-column show-overflow-tooltip sortable prop="status" label="状态" />
        -->
        <el-table-column fixed="right" label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-tooltip content="复制" effect="dark" placement="top">
              <el-button size="mini" icon="el-icon-copy-document" circle type="primary" @click="copy(scope.row)" />
            </el-tooltip>

            <el-tooltip content="编辑" effect="dark" placement="top">
              <el-button size="mini" icon="el-icon-edit" circle type="primary" @click="update(scope.row)" />
            </el-tooltip>
            <el-tooltip class="delete-popover" content="删除" effect="dark" placement="top">
              <el-popconfirm title="确定删除吗？" @onConfirm="singleDelete(scope.row.id)">
                <el-button slot="reference" size="mini" icon="el-icon-delete" circle type="danger" />
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="params.pageNum"
        :page-size="params.pageSize"
        :total="total"
        :page-sizes="[1, 5, 10, 30]"
        layout="total, prev, pager, next, sizes"
        background
        style="margin-top: 10px;float:right;margin-bottom: 10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>

      <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible">
        <el-form ref="dialogForm" size="small" :model="dialogFormData" :rules="dialogFormRules" label-width="120px">
          <el-form-item label="字典名称" prop="dict_label">
        <el-input v-model.trim="dialogFormData.dict_label"  :placeholder="字典名称"></el-input>
          </el-form-item><el-form-item label="字典键值" prop="dict_value">
        <el-input type="textarea" v-model="dialogFormData.dict_value" :placeholder="字典键值"></el-input>
          </el-form-item><el-form-item label="字典类型" prop="dict_type_id">
          <common-select value-key="id" label-key="dict_name" :selected-value="dialogFormData.dict_type_id"    @change="changeType"  :options="dictTypeOptions" />
          </el-form-item><el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dialogFormData.remark" :placeholder="备注"></el-input>
          </el-form-item><el-form-item label="排序" prop="sort">
        <el-input type="number" oninput="value=value.replace(/[^0-9]/g,'')" v-model="dialogFormData.sort" :placeholder="排序"></el-input>
          </el-form-item><el-form-item label="状态" prop="status">
        <el-switch v-model="dialogFormData.status" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelForm()">取 消</el-button>
          <el-button size="mini" :loading="submitLoading" type="primary" @click="submitForm()">确 定</el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import { getDictionary, getDictionaryPager, createDictionary, updateDictionary, deleteDictionary } from '@/api/system/dictionary'
import CommonSelect from '@/components/CommonSelect/CommonSelect'
import { getDictionaryType } from '@/api/system/dictionary_type'

export default {
  name: 'Dictionary',
  components: { CommonSelect },
  filters: {
    methodTagFilter(val) {
      if (val === 'GET') {
        return ''
      } else if (val === 'POST') {
        return 'success'
      } else if (val === 'PUT') {
        return 'info'
      } else if (val === 'PATCH') {
        return 'warning'
      } else if (val === 'DELETE') {
        return 'danger'
      } else {
        return 'info'
      }
    }
  },
  data() {
    return {
      // 查询参数
      dictTypeOptions: [],
      params: {
      dict_label: '',
        dict_value: '',
        dict_type_id: 1,
        remark: '',
        sort: 0,
        status: 0,

    // content: '',
        pageNum: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: [],
      total: 0,
      loading: false,

      // dialog对话框
      submitLoading: false,
      dialogFormTitle: '',
      dialogType: '',
      dialogFormVisible: false,
      dialogFormData: {
        id:'',
            dict_label: '',
          dict_value: '',
          dict_type_id: 0,
          remark: '',
          sort: 0,
          status: 0,

      },
      // dialogFormRules: {
      //   path: [
      //     { required: true, message: '请输入访问路径', trigger: 'blur' },
      //     { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
      //   ],
      //   category: [
      //     { required: true, message: '请输入所属类别', trigger: 'blur' },
      //     { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
      //   ],
      //   method: [
      //     { required: true, message: '请选择请求方式', trigger: 'change' }
      //   ],
      //   desc: [
      //     { required: false, message: '说明', trigger: 'blur' },
      //     { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
      //   ]
      // },

      // 删除按钮弹出框
      popoverVisible: false,
      // 表格多选
      multipleSelection: []
    }
  },
  created() {
    this.getTableData()

  },
  methods: {


    loadDictionaryType() {
      getDictionaryType().then(res => {
        this.dictTypeOptions = res.data?.list
      })
    },
    changeSearchDictType(val) {
      this.params.dict_type_id = val
    },
    changeType(val) {
      this.dialogFormData.dict_type_id = val
    },
    formatType(row, column) {
      return row.dict_type.dict_name
    },
    // 查询
    search() {
      this.params.pageNum = 1
      this.getTableData()
    },

    // 获取表格数据
    async getTableData() {
      this.loading = true
      try {
        var searchParams = {
          ...this.params,
        dict_label : 'like %'+ this.params.dict_label+'%',
          dict_value : 'like %'+ this.params.dict_value+'%',
          remark : 'like %'+ this.params.remark+'%',

        }
        const { data } = await getDictionaryPager(searchParams)
        this.tableData = data.list
        this.total = data.total
      } finally {
        this.loading = false
      }
      this.loadDictionaryType()
    },

    // 新增
    create() {
      this.dialogFormTitle = '新增'
      this.dialogType = 'create'
      this.dialogFormVisible = true
    },

    // 修改
    update(row) {
      this.dialogFormData.id = row.id
      this.dialogFormData.dict_label = row.dict_label
      this.dialogFormData.dict_value = row.dict_value
      this.dialogFormData.dict_type_id = row.dict_type_id
      this.dialogFormData.remark = row.remark
      this.dialogFormData.sort = row.sort
      this.dialogFormData.status = row.status

      this.dialogFormTitle = '修改'
      this.dialogType = 'update'
      this.dialogFormVisible = true
    },

    // 复制
    copy(row) {
      //this.dialogFormData.id = row.id
      this.dialogFormData.dict_label = row.dict_label
      this.dialogFormData.dict_value = row.dict_value
      this.dialogFormData.dict_type_id = row.dict_type_id
      this.dialogFormData.remark = row.remark
      this.dialogFormData.sort = row.sort
      this.dialogFormData.status = row.status

      this.dialogFormTitle = '复制'
      this.dialogType = 'create'
      this.dialogFormVisible = true
    },

    // 提交表单
    submitForm() {
      this.$refs['dialogForm'].validate(async valid => {
        if (valid) {
          let msg = ''
          this.submitLoading = true
          try {

            this.dialogFormData.dict_label =  String(this.dialogFormData.dict_label)
            this.dialogFormData.dict_value =  String(this.dialogFormData.dict_value)
            this.dialogFormData.dict_type_id =  Number(this.dialogFormData.dict_type_id)
            this.dialogFormData.remark =  String(this.dialogFormData.remark)
            this.dialogFormData.sort =  Number(this.dialogFormData.sort)
            this.dialogFormData.status =  Number(this.dialogFormData.status)


            if (this.dialogType === 'create') {
              const { message } = await createDictionary(this.dialogFormData)
              msg = message
            } else {
              const { message } = await updateDictionary(this.dialogFormData.id, this.dialogFormData)
              msg = message
            }
          } finally {
            this.submitLoading = false
          }

          this.resetForm()
          this.getTableData()
          this.$message({
            showClose: true,
            message: msg,
            type: 'success'
          })
        } else {
          debugger
          this.$message({
            showClose: true,
            message: '表单校验失败',
            type: 'error'
          })
          return false
        }
      })
    },

    // 提交表单
    cancelForm() {
      this.resetForm()
    },

    resetForm() {
      this.dialogFormVisible = false
      this.$refs['dialogForm'].resetFields()
      this.dialogFormData = {
      // content: '',
      dict_label:'',
      dict_value:'',
      dict_type_id:0,
      remark:'',
      sort:0,
      status:0,


      }
    },

    // 批量删除
    batchDelete() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async res => {
        this.loading = true
        const apiIds = []
        this.multipleSelection.forEach(x => {
          apiIds.push(x.id)
        })
        let msg = ''
        try {
          const { message } = await deleteDictionary({ ids: apiIds })
          msg = message
        } finally {
          this.loading = false
        }

        this.getTableData()
        this.$message({
          showClose: true,
          message: msg,
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          showClose: true,
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 单个删除
    async singleDelete(Id) {
      this.loading = true
      let msg = ''
      try {
        const { message } = await deleteDictionary({ ids: [Id] })
        msg = message
      } finally {
        this.loading = false
      }

      this.getTableData()
      this.$message({
        showClose: true,
        message: msg,
        type: 'success'
      })
    },

    // 分页
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.getTableData()
    }
  }
}
</script>

<style scoped>
  .container-card{
    margin: 10px;
  }

  .delete-popover{
    margin-left: 10px;
  }
</style>

