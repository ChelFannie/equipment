import request from '../index'
const config = {
  // 获取订单列表数据
  getOrderList: {
    url: '/order/orderListByPage.json',
    method: 'post'
  },
  // 得到订单详情数据
  queryTicketList: {
    url: '/ticket/queryTicketListPage.json',
    method: 'post'
  },
  // 抢票（获取订单）
  takeOrderToPrint: {
    url: '/order/takeOrderToPrint.json',
    method: 'get'
  },
  // 获取票号信息
  getTicketInfo: {
    url: '/ticket/ticketDetail.json',
    method: 'post'
  },
  // 校验是否修改了赛事的赔率
  validateTicketOdds: {
    url: '/ticket/validateTicketOdds.json',
    method: 'post'
  },
  // 提交落地票号信息
  editTicket: {
    url: '/ticket/editTicket.json',
    method: 'post'
  },
  // 获取结算数据
  getSettleList: {
    url: '/settle/settleListByPage.json',
    method: 'post'
  },
  // 提交结算数据
  submitToSettle: {
    url: '/settle/submitToSettle.json',
    method: 'post'
  },
  // 限售
  limitSale: {
    url: '/ticket/limitSaleByStoreUser.json',
    method: 'post'
  },
  // 得到审核数据
  getAuditingList: {
    url: '/settle/auditingListByPage.json',
    method: 'get'
  },
  // 提交审核数据
  submitToAudit: {
    url: '/settle/submitToAudit.json',
    method: 'post'
  },
  // 获取兑奖图片数据
  getOrderByAwardFlag: {
    url: '/order/getOrderByAwardFlag.json',
    method: 'post'
  },
  // 更新兑奖图片数据
  updateAwardAmount: {
    url: '/order/updateAwardAmount.json',
    method: 'post'
  }
}

export default function req (funcName, data) {
  return request(config, funcName, data)
}
