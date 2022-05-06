<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单数据 -->
    <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
      <!-- 表单数据 label-width设置所有标题的宽度-->
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 遍历选项 -->
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门价绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- 确定和消息 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-row :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
      </el-row>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      // valie 是部门名称，要去和同级部门下的部门去比较，有相同的不能过
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 有id就是编辑模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
      // 同级部门下有没有名称相同的
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // 如果为true表示找到了一样的名字
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }

    // 检查部门编码是否重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // valie 是部门名称，要去和同级部门下的部门去比较，有相同的不能过
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式
        isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
      } else {
        // 编码是唯一的，查找有没有编码相同的
        // 历史数据有可能为null 所以加一个value值不为空
        isRepeat = depts.some(item => item.code === value && value)
      }
      // 如果为true表示找到了一样的名字
      isRepeat ? callback(new Error(`组织架构下已经存在这个编码`)) : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门介绍长度为1-300个字符', trigger: 'blur' }]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      const result = await getEmployeeSimple()
      this.peoples = result
    },
    btnOk() {
      // 手动校验表单
      this.$refs.deptForm.validate(async isOk => {
        if (isOk) {
          if (this.formData.id) {
            // 编辑
            await updateDepartments(this.formData)
          } else {
            // 调用新增接口
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          this.$emit('addDepts')
          this.$emit('update:showDialog', false)
          // 关闭dialog的时候会触发el-dialog的close事件
        }
      })
    },
    btnCancel() {
      // 重置数据 因为resetFields只能重置表单上面的数据  非表单上面的比如编译中id不能重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false)
      // 清除之前的校验数据
      this.$refs.deptForm.resetFields()
    },
    // 获取详情方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style>

</style>
