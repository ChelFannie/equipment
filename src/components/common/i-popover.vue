<template>
 <div class="i-popover">
    <el-popover v-model="showOutPopover" id="outPopover" ref="outPopover" placement="right" popper-class="orderNum-popover">
      <div class="hoverContent">
        <p class="hoverItem">系统票号: <span class="substance">{{orderInfo.ticketInfoNumber}}</span></p>
        <p class="hoverItem">彩种: <span class="substance">{{orderInfo.lotterykinds}}</span></p>
        <p class="hoverItem">倍数: <span class="substance">{{orderInfo.multiple}}倍</span></p>
        <p class="hoverItem">金额: <span class="substance">{{orderInfo.amount}}元</span></p>
        <p class="hoverItem">预计奖金: <span class="substance">25.43元</span></p>
        <p class="hoverItem">出票店铺: <span class="substance">{{orderInfo.storeName}}</span></p>
        <p class="hoverItem">最迟出票时间: <span class="substance">{{orderInfo.lastPrintDate}}</span></p>
        <p class="hoverItem">出票时间: <span class="substance">{{orderInfo.uploadTime}}</span></p>
      </div>
      <el-table :data="hoverData" border class="noright">
        <el-table-column
          prop="orderNum"
          label="编号"
          width="110"
          align="center">
        </el-table-column>
        <el-table-column
          prop="host"
          label="主队"
          width="140"
          align="center">
        </el-table-column>
        <el-table-column
          prop="guest"
          label="客队"
          width="140"
          align="center">
        </el-table-column>
        <el-table-column
          prop="assumption"
          label="预设"
          width="69"
          align="center">
        </el-table-column>
        <el-table-column prop="assumption" label="投注项" width="240" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.lotteryTypeWord}}{{scope.row.subPlayTypeWord}}</span>
            <span v-for="(item1, index1) in scope.row.betItemsObj" :key="index1">[{{item1.key}}][{{item1.odds}}]</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="uploadImg">
        <img class="img" :src="orderInfo.printResult" alt="">
      </div>
    </el-popover>
 </div>
</template>

<script>
export default {
  props: {
    orderInfo: {
      type: Object,
      default: function () {
        return {}
      }
    },
    hoverData: {
      type: Array,
      default: function () {
        return []
      }
    },
    showOutPopover: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style>

</style>
