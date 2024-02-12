export default {
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
      refresh: true,
    }
  }
}
