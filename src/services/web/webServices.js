import axios from "axios";
import base_uri from "../../api/base_url";

// Build By Mayank Dhyani
export const login = (data) => {
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/login`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data
  })
}

export const get_All_Users = () => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'get',
    url: `${base_uri.base_uri_admin}/get-users`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    
  })
}
export const delete_user = (id) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'delete',
    url: `${base_uri.base_uri_admin}/delete-users/${id}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    
  })
}
export const add_user = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/add-user`,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    },
    data
    
  })
}
export const get_coach = () => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'get',
    url: `${base_uri.base_uri_admin}/get-coach`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    
  })
}

export const delete_coach = (id) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'delete',
    url: `${base_uri.base_uri_admin}/delete-single-coach/${id}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    
  })
}

export const update_coach = (id,data) => {
  // console.log("Va;luee==========>",formData)
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'put',
    url: `${base_uri.base_uri_admin}/update-single-coach/${id}`,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    data,
    
  })
}

export const add_coach = (data) => {
  // console.log("Va;luee==========>",formData)
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/add-coach`,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    data,
    
  })
}
export const update_user = (id,data) => {
  // console.log("Va;luee==========>",formData)
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'put',
    url: `${base_uri.base_uri_admin}/update-user-by-id/${id}`,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    data,
  })
}



export const get_category = () => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'get',
    url: `${base_uri.base_uri_admin}/get-all-category`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    
  })
}
export const delete_category = (id) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'delete',
    url: `${base_uri.base_uri_admin}/delete-category-by-id/${id}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    
  })
}
export const edit_category = (id,data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'put',
    url: `${base_uri.base_uri_admin}/update-category-by-id/${id}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data,
    
  })
}
export const add_category = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/create-category`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data,
    
  })
}


// get Course

export const get_course = () => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'get',
    url: `${base_uri.base_uri_admin}/get-course`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    
  })
}

export const delete_course = (id) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'delete',
    url: `${base_uri.base_uri_admin}/delete-single-course/${id}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    
  })
}
export const upload_vedio = (data) => {
  const token = localStorage.getItem("auth_token");
  console.log("Data coming===>",data)
  
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/upload-video`,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    },
     data,
    
  })
}
export const add_course = (data) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/addcourse`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data,
  })
}
export const deleteVideo = (course_id,video_id) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'delete',
    // url: `${base_uri.base_uri}/delete-video/${course_id}/${video_id}`,
    url: `${base_uri.base_uri_admin}/delete-video/${course_id}/${video_id}`,
    headers: { 
      Authorization: `Bearer ${token}`
    }
    
  })
}
export const add_video = (data,id) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'post',
    url: `${base_uri.base_uri_admin}/add-video/${id}`,
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data,
    
  })
}
export const update_course= (data,id) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'put',
    url: `${base_uri.base_uri_admin}/update-single-course/${id}`,
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data,
    
  })
}
export const getNeedHelp= () => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'get',
    url: `${base_uri.base_uri_admin}/get-all-need-help`,
    headers: { 
      Authorization: `Bearer ${token}`
    },
    
  })
}
export const deleteNeedHelp= (id) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'delete',
    url: `${base_uri.base_uri_admin}/delete-single-need-help/${id}`,
    headers: { 
      Authorization: `Bearer ${token}`
    },
    
  })
}
export const get_all_admin__need_help= () => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'get',
    url: `${base_uri.base_uri_admin}/get-all-contact-us`,
    headers: { 
      Authorization: `Bearer ${token}`
    },
    
  })
}
export const delete_admin__need_help= (id) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'delete',
    url: `${base_uri.base_uri_admin}/delete-single-contact-us/${id}`,
    headers: { 
      Authorization: `Bearer ${token}`
    },
    
  })
}
export const get_all_contact_us= () => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'get',
    url: `${base_uri.base_uri_admin}/get-all-contact-us`,
    headers: { 
      Authorization: `Bearer ${token}`
    },
    
  })
}
export const delete_contact_us= (id) => {
  const token = localStorage.getItem("auth_token");
  return axios({
    method: 'delete',
    url: `${base_uri.base_uri_admin}/delete-single-contact-us/${id}`,
    headers: { 
      Authorization: `Bearer ${token}`
    },
    
  })
}
