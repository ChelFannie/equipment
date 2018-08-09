const Blank = () => import('../components/blank')
const OrderList = () => import('../page/order-query/order-List')
const AccountOrder = () => import('../page/order-query/account-order')
const ExamineOrder = () => import('../page/order-query/examine-order')

export default [{
  path: '/order-query',
  component: Blank,
  children: [{
    path: 'order-List',
    name: '订单列表',
    component: OrderList
  }, {
    path: 'account-order',
    name: '结算订单',
    component: AccountOrder
  }, {
    path: 'examine-order',
    name: '审核订单',
    component: ExamineOrder
  }]
}]
