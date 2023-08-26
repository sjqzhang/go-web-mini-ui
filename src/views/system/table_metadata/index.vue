<template>
  <div>
    <el-card class="container-card" shadow="always">
      <el-form size="mini" :inline="true" :model="params" class="demo-form-inline">

        <el-form-item label="table_alias">
          <el-input v-model.trim="params.table_alias" type="input" clearable placeholder="table_alias"
                    @keyup.enter.native="search" @clear="search"
          />
        </el-form-item>
        <el-form-item label="column_name">
          <el-input v-model.trim="params.column_name" type="input" clearable placeholder="column_name"
                    @keyup.enter.native="search" @clear="search"
          />
        </el-form-item>
        <el-form-item label="column_comment">
          <el-input v-model.trim="params.column_comment" type="input" clearable placeholder="column_comment"
                    @keyup.enter.native="search" @clear="search"
          />
        </el-form-item>
        <el-form-item label="is_nullable">
          <el-input v-model.trim="params.is_nullable" type="input" clearable placeholder="is_nullable"
                    @keyup.enter.native="search" @clear="search"
          />
        </el-form-item>
        <el-form-item label="data_type">
          <el-input v-model.trim="params.data_type" type="input" clearable placeholder="data_type"
                    @keyup.enter.native="search" @clear="search"
          />
        </el-form-item>
        <el-form-item label="character_max_length">
          <el-input v-model.trim="params.character_max_length" type="input" clearable placeholder="character_max_length"
                    @keyup.enter.native="search" @clear="search"
          />
        </el-form-item>

        <el-form-item>
          <el-button :loading="loading" icon="el-icon-search" type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-plus" type="warning" @click="create">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="multipleSelection.length === 0" :loading="loading" icon="el-icon-delete" type="danger"
                     @click="batchDelete"
          >批量删除
          </el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%"
                @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"/>

        <el-table-column show-overflow-tooltip sortable prop="table_alias" label="table_alias"/>
        <el-table-column show-overflow-tooltip sortable prop="column_name" label="column_name"/>
        <el-table-column show-overflow-tooltip sortable prop="column_comment" label="column_comment"/>
        <el-table-column show-overflow-tooltip sortable prop="is_nullable" label="is_nullable"/>
        <el-table-column show-overflow-tooltip sortable prop="data_type" label="data_type"/>
        <el-table-column show-overflow-tooltip sortable prop="character_max_length" label="character_max_length"/>
        <el-table-column fixed="right" label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-tooltip content="编辑" effect="dark" placement="top">
              <el-button size="mini" icon="el-icon-edit" circle type="primary" @click="update(scope.row)"/>
            </el-tooltip>
            <el-tooltip class="delete-popover" content="删除" effect="dark" placement="top">
              <el-popconfirm title="确定删除吗？" @onConfirm="singleDelete(scope.row.id)">
                <el-button slot="reference" size="mini" icon="el-icon-delete" circle type="danger"/>
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
        @current-change="handleCurrentChange"
      />

      <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible">
        <el-form ref="dialogForm" size="small" :model="dialogFormData" :rules="dialogFormRules" label-width="120px">
          <el-form-item label="table_alias" prop="table_alias">
            <el-input v-model.trim="dialogFormData.table_alias" type="text" placeholder="table_alias"/>
          </el-form-item>
          <el-form-item label="column_name" prop="column_name">
            <el-input v-model.trim="dialogFormData.column_name" type="text" placeholder="column_name"/>
          </el-form-item>
          <el-form-item label="column_comment" prop="column_comment">
            <el-input v-model.trim="dialogFormData.column_comment" type="textarea" placeholder="column_comment"/>
          </el-form-item>
          <el-form-item label="is_nullable" prop="is_nullable">
            <el-input v-model.trim="dialogFormData.is_nullable" type="text" placeholder="is_nullable"/>
          </el-form-item>
          <el-form-item label="data_type" prop="data_type">
            <el-input v-model.trim="dialogFormData.data_type" type="text" placeholder="data_type"/>
          </el-form-item>
          <el-form-item label="character_max_length" prop="character_max_length">
            <el-input v-model.trim="dialogFormData.character_max_length" type="textarea"
                      placeholder="character_max_length"
            />
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
import {
  createTableMetadata,
  deleteTableMetadata,
  getTableMetadata,
  updateTableMetadata
} from '@/api/system/table_metadata'

export default {
  name: 'TableMetadata',
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
      params: {
        table_alias: '',
        column_name: '',
        column_comment: '',
        is_nullable: '',
        data_type: '',
        character_max_length: '',

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
        id: '',
        table_alias: '',
        column_name: '',
        column_comment: '',
        is_nullable: '',
        data_type: '',
        character_max_length: ''

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
          table_alias: 'like %' + this.params.table_alias + '%',
          column_name: 'like %' + this.params.column_name + '%',
          column_comment: 'like %' + this.params.column_comment + '%',
          is_nullable: 'like %' + this.params.is_nullable + '%',
          data_type: 'like %' + this.params.data_type + '%',
          character_max_length: 'like %' + this.params.character_max_length + '%'

        }
        const { data } = await getTableMetadata(searchParams)
        this.tableData = data.list
        this.total = data.total
      } finally {
        this.loading = false
      }
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
      this.dialogFormData.table_alias = row.table_alias
      this.dialogFormData.column_name = row.column_name
      // 自动生成如下格式：title:"标题";type:"input";validate:"required,min=2,max=35"
      if (row.column_comment == null || row.column_comment === '') {
        debugger
        var title = 'title:"' + row.column_name + '"'
        var type = 'type:"input"'
        var validate = 'validate:"'
        //define validate array
        var validateArray = []
        if (row.is_nullable === 'NO') {
          validateArray.push('required')
        }
        if (row.data_type === 'varchar' || row.data_type === 'char' || row.data_type === 'text'
          || row.data_type === 'longtext' || row.data_type === 'mediumtext' || row.data_type === 'tinytext') {
          validateArray.push('min=1,max=' + row.character_max_length)
        }
        row.column_comment = title + ';' + type + ';' + validate + validateArray.join(',') + '"'
      }
      if (row.column_comment.indexOf('title') === -1) {
        var title = 'title:"' + row.column_comment + '"'
        //row.column_comment = title + ';' + row.column_comment
        var validate = 'validate:"'
        //define validate array
        var validateArray = []
        if (row.is_nullable === 'NO') {
          validateArray.push('required')
        }
        if (row.data_type === 'varchar' || row.data_type === 'char' || row.data_type === 'text'
          || row.data_type === 'longtext' || row.data_type === 'mediumtext' || row.data_type === 'tinytext') {
          validateArray.push('min=1,max=' + row.character_max_length)
        }
        row.column_comment = title + ';' + validate + validate + validateArray.join(',') + '"'
      }

      row.column_comment = row.column_comment.replace(/'/g, '')

      this.dialogFormData.column_comment = row.column_comment
      this.dialogFormData.is_nullable = row.is_nullable
      this.dialogFormData.data_type = row.data_type
      this.dialogFormData.character_max_length = row.character_max_length

      this.dialogFormTitle = '修改'
      this.dialogType = 'update'
      this.dialogFormVisible = true

    },

    // 提交表单
    submitForm() {
      this.$refs['dialogForm'].validate(async valid => {
        if (valid) {
          let msg = ''
          this.submitLoading = true
          try {
            this.dialogFormData.table_alias = String(this.dialogFormData.table_alias)
            this.dialogFormData.column_name = String(this.dialogFormData.column_name)
            this.dialogFormData.column_comment = String(this.dialogFormData.column_comment)
            this.dialogFormData.is_nullable = String(this.dialogFormData.is_nullable)
            this.dialogFormData.data_type = String(this.dialogFormData.data_type)
            this.dialogFormData.character_max_length = String(this.dialogFormData.character_max_length)

            if (this.dialogType === 'create') {
              const { message } = await createTableMetadata(this.dialogFormData)
              msg = message
            } else {
              const { message } = await updateTableMetadata(this.dialogFormData.id, this.dialogFormData)
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
    }
    ,

    // 提交表单
    cancelForm() {
      this.resetForm()
    }
    ,

    resetForm() {
      this.dialogFormVisible = false
      this.$refs['dialogForm'].resetFields()
      this.dialogFormData = {
        // content: '',
        table_alias: '',
        column_name: '',
        column_comment: '',
        is_nullable: '',
        data_type: '',
        character_max_length: ''

      }
    }
    ,

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
          const { message } = await deleteTableMetadata({ ids: apiIds })
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
    }
    ,

    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
    ,

    // 单个删除
    async singleDelete(Id) {
      this.loading = true
      let msg = ''
      try {
        const { message } = await deleteTableMetadata({ ids: [Id] })
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
    }
    ,

    // 分页
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getTableData()
    }
    ,
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.getTableData()
    }
  }
}
</script>

<style scoped>
.container-card {
  margin: 10px;
}

.delete-popover {
  margin-left: 10px;
}
</style>

