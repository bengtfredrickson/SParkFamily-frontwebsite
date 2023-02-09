import axios from "axios";
import base_uri from "../../api/base_url";

export const login = (data) => {
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/login/adminLogin`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data
  })
}

export const get_all_curriculums = () => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'get',
    url: `${base_uri.base_uri_admin}/admin/getAllCurriculumsList`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },

  })
}
export const add_curriculum = (data) => {
  const token = localStorage.getItem("auth_token");

  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/admin/postCurriculum`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },
    data

  })
}
export const update_curriculum = (data) => {
  const token = localStorage.getItem("auth_token");

  return axios({
    method: 'patch',
    url: `${base_uri.base_uri_admin}/admin/updateCurriculum`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },
    data

  })
}
export const delete_curriculum = (data) => {
  const token = localStorage.getItem("auth_token");

  return axios({
    method: 'patch',
    url: `${base_uri.base_uri_admin}/admin/deleteCurriculum`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },
    data

  })
}
export const get_modules = (id) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'get',
    url: `${base_uri.base_uri_admin}/admin/getAllModule/${id}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },

  })
}
export const get_module_files = (id) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'get',
    url: `${base_uri.base_uri_admin}/admin/getModuleData/${id}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },

  })
}
export const get_all_modules = () => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'get',
    url: `${base_uri.base_uri_admin}/admin/getAllModuleList`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },

  })
}
export const get_all_units = () => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'get',
    url: `${base_uri.base_uri_admin}/admin/getAllUnits`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },

  })
}
export const get_all_subunits = () => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'get',
    url: `${base_uri.base_uri_admin}/admin/getAllSubunit`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },

  })
}