import baseService from 'modules/qcrud/_services/baseService'

export default {
  getDashboard(refresh = false, params = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestParams = {refresh, params}
      //Request
      baseService.index('apiRoutes.qbooking.reservationsDashboard', requestParams).then(response => {
        resolve(response)
      }).catch(error => reject(error))
    })
  }
}
