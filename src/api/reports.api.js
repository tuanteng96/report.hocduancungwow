import http from './configs/http'

const reportsApi = {
  getListContact: data => {
    return http.post(`/ContactApi/v4/?cmd=list`, JSON.stringify(data))
  },
  updateStatus: data => {
    return http.post(`/ContactApi/v4/?cmd=update`, JSON.stringify(data))
  }
}
export default reportsApi
