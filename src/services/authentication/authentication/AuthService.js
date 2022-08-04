import axios from 'axios';
import base_uri from '../../api/base_url'
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const login = user => {
  return {
    type: LOGIN,
    payload: user
  };
};

export const logout = () => {
  return {
    type: LOGOUT
  };
};


export function loginService(loginObject){
    return axios.post( base_uri.base_uri_admin +"/", loginObject);
}