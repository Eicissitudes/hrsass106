<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置内容 -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height:60%">
              <el-button
                type="primary"
                icon="el-icon-lus"
                size="small"
                @click="showDialog=true"
              >
                新增角色
              </el-button>
            </el-row>
            <el-table border="" :data="list">
              <el-table-column header-align="left" align="center" type="index" label="序号" width="150" />
              <el-table-column header-align="left" align="center" prop="name" label="角色名称" width="150" />
              <el-table-column header-align="left" align="center" prop="description" label="描述" />
              <el-table-column header-align="left" align="center" label="操作" width="300">
                <template slot-scope="{row}">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center" style="height:60px" align="middle">
              <el-pagination
                layout="prev, pager, next"
                :total="page.total"
                :page-size="page.pageSize"
                :current-page="page.page"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <!-- 右边内容 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form ref="roleForm" :model="formData" label-width="120px" style="margin-top=50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司电话">
                <el-input v-model="formData.companyPhone" disabled style="width:400px" />
              </el-form-item><el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!--  放置一个弹层组件 -->
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCancel">
      <el-form label-width="120px" :model="roleForm" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pageSize: 10,
        total: 0 // 记录总数
      },
      formData: {},
      showDialog: false, // 控制弹层的显示
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo()
  },

  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    async getCompanyInfo(id) {
      this.formData = await getCompanyInfo(this.companyId)
    },
    changePage(newPage) {
      this.page.page = newPage // 将当前页码赋值给当前的页码 重新获取数据
      this.getRoleList()
    },
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗')
        // 只有点击了确定才能到下方
        // alert('点击了确定')
        await deleteRole(id)
        this.getRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true // 显示弹层
    },
    btnOk() {
      this.$refs.roleForm.validate(async isOk => {
        if (isOk) {
          // 只有校验通过才会进入这里
          // roleForm这个对象有id就是编辑 没有id就i是新增
          if (this.roleForm.id) {
            await updateRole(this.roleForm)
          } else {
            // 新增业务
            await addRole(this.roleForm)
          }
          // 重新获取数据
          this.getRoleList()
          this.$message.success('操作成功')
          this.showDialog = false
        }
      })
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style>

</style>
