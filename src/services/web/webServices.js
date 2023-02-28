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
export const get_units = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/admin/getUnitsList`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },
    data

  })
}
export const add_units = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/admin/postUnit`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },
    data

  })
}
export const update_units = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'patch',
    url: `${base_uri.base_uri_admin}/admin/updateUnit`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },
    data

  })
}
export const delete_units = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'patch',
    url: `${base_uri.base_uri_admin}/admin/deleteUnit`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },
    data

  })
}
export const get_subunits = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/admin/getSubunitsList`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },
    data

  })
}
export const add_subunits = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/admin/postSubunit`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },
    data

  })
}
export const update_subunits = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'patch',
    url: `${base_uri.base_uri_admin}/admin/updateSubunit`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },
    data

  })
}
export const delete_subunits = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'patch',
    url: `${base_uri.base_uri_admin}/admin/deleteSubunit`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },
    data

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
export const get_options = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/admin/getOptionsList`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },
    data
  })
}
export const get_suboptions = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/admin/getSuboptionsList`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`

    },
    data
  })
}
export const get_lessons = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/admin/getLessonPlans`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data
  })
}
export const add_option = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/admin/addOptions`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data
  })
}
export const delete_option = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'patch',
    url: `${base_uri.base_uri_admin}/admin/deleteOptions`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data
  })
}
export const edit_option = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'patch',
    url: `${base_uri.base_uri_admin}/admin/updateOptions`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data
  })
}
export const add_suboption = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/admin/addSubOptions`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data
  })
}
export const delete_suboption = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'patch',
    url: `${base_uri.base_uri_admin}/admin/deleteSubOptions`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data
  })
}
export const edit_suboption = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'patch',
    url: `${base_uri.base_uri_admin}/admin/updateSubOptions`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data
  })
}
export const add_lesson = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/admin/addLessons`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data
  })
}
export const delete_lesson = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'patch',
    url: `${base_uri.base_uri_admin}/admin/deleteLessons`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data
  })
}
export const edit_lesson = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'patch',
    url: `${base_uri.base_uri_admin}/admin/updateLessons`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data
  })
}
export const get_module = (id) => {
  console.log()
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
export const add_module = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/admin/addModule`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data
  })
}
export const delete_module = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'patch',
    url: `${base_uri.base_uri_admin}/admin/deleteModule`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data
  })
}
export const edit_module = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'patch',
    url: `${base_uri.base_uri_admin}/admin/updateModule`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data
  })
}