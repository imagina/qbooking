export default {
  productAgenda: {
    permission: 'ibooking.reservations.manage',
    activated: true,
    authenticated: true,
    path: '/booking/agenda',
    name: 'qbooking.admin.agenda',
    page: () => import('modules/qbooking/_pages/product/agenda'),
    layout: () => import('layouts/master.vue'),
    title: 'ibooking.cms.sidebar.panelReservations',
    icon: 'fa-light fa-check-to-slot'
  },
  productDashboard: {
    permission: 'ibooking.reservations.manage',
    activated: true,
    authenticated: true,
    path: '/booking/dashboard',
    name: 'qbooking.admin.dashbaord',
    page: () => import('modules/qbooking/_pages/product/dashboard'),
    layout: () => import('layouts/master.vue'),
    title: 'ibooking.cms.sidebar.dashboard',
    icon: 'fa-light fa-chart-tree-map'
  },
  resources: {
    permission: 'ibooking.resources.manage',
    activated: true,
    authenticated: true,
    path: '/booking/resources/index',
    name: 'qbooking.admin.resources',
    crud: import('modules/qbooking/_crud/resources'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'ibooking.cms.sidebar.adminResources',
    icon: 'fa-light fa-chess-knight',
    subHeader: {
      refresh: true
    }
  }
};
