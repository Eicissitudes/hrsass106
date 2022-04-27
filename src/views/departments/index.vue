<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容，头部 -->
      <el-card class="tree-card">
        <tree-tool :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <el-tree :data="departs" :props="defaultProps">
          <tree-tool slot-scope="{ data }" :tree-node="data" @editDepts="editDepts" @addDepts="addDepts" @delDepts="getDepartments" />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹窗组件 -->
    <add-dept ref="addDepts" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" @closeDialog="showDialog=false" />
  </div>
</template>

<script>
import TreeTool from './compoments/tree-tool.vue'
import AddDept from './compoments/add-dept.vue'
import { tranListToTreeDate } from '@/utils/index.js'
import { getDepartments } from '@/api/departments'

export default {
  components: {
    TreeTool,
    AddDept
  },
  data() {
    return {
      company: { },
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      showDialog: false,
      node: null // 记录当前点击的node节点
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      // console.log(result)
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeDate(result.depts, '') // 要转化成树形结构
    },
    // 监听tree-tools中触发的点击添加子部门的事件
    addDepts(node) {
      this.showDialog = true // 显示弹层
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true // 弹出层
      this.node = node
      this.$refs.addDepts.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card{
  padding: 30px 140px;
  font-size: 14px;
}
</style>
