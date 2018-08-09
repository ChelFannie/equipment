import request from '../index'
const config = {
  // 得到订单列表数据
  getOrderList: {
    url: '/order/orderListByPage.json',
    method: 'post'
  },
  // 得到订单详情数据
  queryTicketList: {
    url: '/ticket/queryTicketListPage.json',
    method: 'post'
  },
  // 取票
  getImages: {
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
    url: '/order/submitToSettle.json',
    method: 'post'
  },
  // 限售
  limitSale: {
    url: '/ticket/limitSaleByStoreUser.json',
    method: 'post'
  }
}

export default function req (funcName, data) {
  return request(config, funcName, data)
}
