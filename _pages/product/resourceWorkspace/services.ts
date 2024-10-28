import baseService from 'modules/qcrud/_services/baseService';

export default {
  getReservations (refresh = false, params = {}): Promise<any>
  {
    return new Promise((resolve, reject) =>
    {
      const requestParams = { refresh, params };
      //Request
      baseService.index('apiRoutes.qbooking.reservations', requestParams).then(response =>
      {
        resolve(response);
      }).catch(error => reject(error));
    });
  },
  updateReservation (reservation): Promise<any>
  {
    return new Promise((resolve, reject) =>
    {
      //Request
      baseService.update('apiRoutes.qbooking.reservations', reservation.id, reservation).then(response =>
      {
        resolve(response);
      }).catch(error => reject(error));
    });
  },
  getDashboard (refresh = false, params = {}): Promise<any>
  {
    return new Promise((resolve, reject) =>
    {
      const requestParams = { refresh, params };
      //Request
      baseService.index('apiRoutes.qbooking.resourcesDashboard', requestParams).then(response =>
      {
        resolve(response);
      }).catch(error => reject(error));
    });
  }
};
