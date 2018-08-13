<template>
  <div class="exportFile">
    <!-- <div class="title">
      <span>文件: /</span>
      <el-button type="primary">复制</el-button>
    </div> -->
    <div class="folder" v-if="fileFlag">
      <div class="item" v-for="(item, index) in folderInfo" :key="index"
        @touchstart="gtouchstart(item)"
        @touchmove="gtouchmove"
        @touchend="gtouchend(item)">
        <i class="el-icon-success" v-show="folderData.includes(item)"></i>
        <img src="../../assets/image/folder.png" alt="">
        <span>{{item.name}}</span>
      </div>
    </div>
    <div class="imgFile" v-if="!fileFlag">
      <el-table
        ref="multipleTable"
        :data="imgData"
        tooltip-effect="dark"
        style="width: 100%"
        border
        height="350"
        @selection-change="rowSelect">
            <el-table-column type="selection" align="center" width="45">
            </el-table-column>
            <el-table-column prop="name" label="名称" align="center" width="280">
            </el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间" width="170">
            </el-table-column>
            <el-table-column prop="size" label="大小(MB)" align="center" >
            </el-table-column>
      </el-table>
    </div>
    <div class="bottom">
        <el-button type="primary" @click="returnLast" v-if="!fileFlag">返回上一级</el-button>
        <el-button type="primary" @click="deleteFile">删除</el-button>
        <el-button type="danger" @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>

export default {
  name: 'exportFile',
  props: {
    data: Array
  },
  data () {
    return {
      timeOutEvent: -1,
      folderInfo: [],
      folderData: [],
      fileFlag: true,
      imgData: [],
      fileName: ''
    }
  },
  watch: {

  },
  computed: {

  },
  created () {
    this.getFolderList()
  },
  mounted () {

  },
  methods: {
    gtouchstart (item) {
      this.timeOutEvent = setTimeout(() => {
        this.fileName = ''
        this.timeOutEvent = 0
        let idx = this.folderData.indexOf(item)
        if (idx !== -1) {
          this.folderData.splice(idx, 1)
        } else {
          this.folderData.push(item)
        }
      }, 500)
      return false
    },
    gtouchend (item) {
      clearTimeout(this.timeOutEvent) // 清除定时器
      if (this.timeOutEvent !== 0) {
        // 这里写要执行的内容（尤如onclick事件）
        this.fileFlag = false
        this.folderData = []
        this.$emit('getFileName', '文件: /' + item.name)
        this.fileName = item.name
        this.getFileList()
      }
      return false
    },
    gtouchmove () {
      clearTimeout(this.timeOutEvent) // 清除定时器
      this.timeOutEvent = 0
    },
    deleteFile () {
      // let flag = this.fileFlag ? '1' : '0'
      if (this.folderData.length) {
        let data = []
        if (this.fileFlag) {
          this.folderData.map(val => {
            data.push('/sdcard/HQBMP/' + val.name)
          })
        } else {
          this.folderData.map(val => {
            data.push('/sdcard/HQBMP/' + this.fileName + '/' + val.name)
          })
        }
        const _this = this
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          try {
            latech.deleteCommandFromJS(data) // eslint-disable-line
            _this.fileFlag ? _this.getFolderList() : _this.getFileList()
          } catch (error) {
            console.log('删除文件')
          }
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        if (this.fileFlag) {
          this.$message({
            type: 'success',
            message: '请长按选择需要删除的文件夹'
          })
        } else {
          this.$message({
            type: 'success',
            message: '请勾选择需要删除的文件'
          })
        }
      }
    },
    cancel () {
      this.$emit('fileCancel')
    },
    returnLast () {
      this.fileFlag = true
      this.folderData = []
      this.$emit('getFileName', '文件: /')
    },
    rowSelect (row) {
      this.folderData = []
      this.folderData = row
    },
    getFolderList () {
      try {
        let objData = JSON.parse(latech.getFileListInfoFromJS('/sdcard/HQBMP/')) // eslint-disable-line
        if (objData.FileInfoList) {
          this.folderInfo = objData.FileInfoList
        }
      } catch (error) {
        console.log('读取文件夹')
      }
    },
    getFileList () {
      try {
        let objData = JSON.parse(latech.getFileListInfoFromJS('/sdcard/HQBMP/' + this.fileName)) // eslint-disable-line
        if (objData.FileInfoList) {
          this.imgData = objData.FileInfoList
        }
      } catch (error) {
        console.log('读取文件夹')
      }
    }
  }
}
</script>
<style lang="less">
.exportFile {
    .folder{
        display: flex;
        flex-wrap: wrap;
        .item {
            width: 80px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-left: 15px;
            margin-top: 15px;
            position: relative;
            i{
                position: absolute;
                top: 2px;
                right: 2px;
            }
            img {
                width: 70px;
            }
            span{
                margin-top: 5px;
            }
        }
    }
    .bottom{
        margin-top: 20px;
        text-align: center;
    }
}
</style>
