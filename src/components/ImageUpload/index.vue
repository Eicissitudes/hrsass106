<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="'#"
      :on-preview="preview"
      :file-list="fileList"
      :class="{disabled:fileComputed}"
      :on-change="changeFile"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress
      v-if="showPercent"
      :percentage="percent"
      style="width:180px"
    />
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width:100%">
    </el-dialog>
  </div>
</template>

<script>
// 引入腾讯云cos包
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKID0ymRDubDeuwpbAUccR1UvDKI5kFYp2CB',
  SecretKey: 'znUcZM1ZwAFJONPUVQGxXzJTaYP6b6Rb'
})
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: null, // 记录当前正在上传的图片的Uid
      percent: 0,
      showPercent: false
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      console.log(file.url)
      this.imgUrl = file.url
      this.showDialog = true
    },
    // file是要删除的文件，filelist是删除之后的
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    changeFile(file, fileList) {
    //   this.fileList = fileList
    //   console.log(this.fileList)
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
    //   console.log(file)
    // 先检查文件的类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      const maxSize = 5 * 1024 * 1024
      // 如果超过了图片的大小
      if (file.size > maxSize) {
        this.$message.error('上传的图片大小最多为5M')
      }
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
      // 最后一定要return true 这样才进行上传
    },
    upload(params) {
    //   console.log(params)
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          // 上传到腾讯云
          Bucket: 'gwj-1-1311671213', // 存储桶名称
          Region: 'ap-beijing', // 存储桶地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          console.log(err || data)
          if (!err && data.statusCode === 200) {
            // 此时说明文件上传成功，要返回文件上传的地址
            this.fileList = this.fileList.map(item => {
              // 找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址复制给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                // 表示这张图片已经上传完毕 upload属性要为后期应用做标记
              }
              return item
            })
            // 关闭进度条 重置百分比
            this.showPercent = false
            this.percent = 0
          }
        }
        )
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card{
    display: none;
}
</style>
