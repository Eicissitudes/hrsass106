<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- 多选框组 -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        <!-- 要循环的选项 -->
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 定义footer插槽 -->
    <el-row type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      // 用户的id 需要知道当前要处理的哪个用户
      type: String,
      default: null,
      required: true
    }
  },
  data() {
    return {
      list: [],
      roleIds: [] // 负责存储当前用户所拥有的id
    }
  },
  created() {
    //   获取所有角色
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({
        page: 1,
        pageSize: 20
      })
      this.list = rows
    },
    // 这个方法是给父组件调用的 props传值是异步的 这里拿不到this.userId
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    async btnOk() {
      await assignRoles({
        id: this.userId,
        roleIds: this.roleIds
      })
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel() {
      this.roleIds = []
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style>

</style>
