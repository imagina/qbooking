import pages from 'src/setup/pages' // Get Pages from config

//Blog
export default [
  {
    title: 'ibooking.cms.sidebar.adminGroup',
    icon: 'fa-light fa-check-to-slot',
    children: [
      pages.qbooking.productAgenda,
      pages.qbooking.productDashboard,
      pages.mainqbooking.categories,
      pages.mainqbooking.services,
      pages.qbooking.resources,
      //pages.mainqbooking.reservations
    ]
  },
]
