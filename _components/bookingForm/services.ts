import baseService from 'modules/qcrud/_services/baseService';
import { uid } from 'src/plugins/utils';

export default {
  getCategories (refresh = false, params = {}): Promise<any>
  {
    return new Promise((resolve, reject) =>
    {
      const requestParams = {
        refresh, params: { ...params, hasServices: true }
      };
      //Request
      baseService.index('apiRoutes.qbooking.categories', requestParams)
        .then(response => resolve(response)).catch(error => reject(error));
    });
  },
  getServices (refresh = false, categoryId): Promise<any>
  {
    return new Promise((resolve, reject) =>
    {
      const requestParams = {
        refresh,
        params: {
          filter: { categoryId: categoryId },
          order: { field: 'id', way: 'asc' },
          include: 'category'
        }
      };
      //Request
      baseService.index('apiRoutes.qbooking.services', requestParams)
        .then(response => resolve(response)).catch(error => reject(error));
    });
  },
  getResources (refresh = false, services): Promise<any>
  {
    return new Promise((resolve, reject) =>
    {
      const requestParams = {
        refresh, params: {
          filter: { services: services },
          include: 'schedule.workTimes'
        }
      };
      //Request
      baseService.index('apiRoutes.qbooking.resources', requestParams)
        .then(response => resolve(response)).catch(error => reject(error));
    });
  },
  getReservations (refresh = false, params = {}): Promise<any>
  {
    return new Promise((resolve, reject) =>
    {
      const requestParams = { refresh, params };
      //Request
      baseService.index('apiRoutes.qbooking.reservations', requestParams)
        .then(response => resolve(response)).catch(error => reject(error));
    });
  },
  createReservation (data): Promise<any>
  {
    return new Promise((resolve, reject) =>
    {
      //Request
      baseService.create('apiRoutes.qbooking.reservations', data)
        .then(response => resolve(response)).catch(error => reject(error));
    });
  }
};
