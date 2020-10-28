import { axios } from './request'

export function getAction(url, parameter) {
    return axios({
        url: url,
        method: 'get',
        data: parameter
    })
}

export function postAction(url, parameter) {
    return axios({
        url: url,
        method: 'post',
        data: parameter
    })
}

export function deleteAction(url, parameter) {
    return axios({
        url: url,
        method: 'delete',
        data: parameter
    })
}

//post method= {post | put}
export function httpAction(url, parameter, method) {
    return axios({
        url: url,
        method: method,
        data: parameter
    })
}

export function getFormData(params){
    const formData = new FormData();
    Object.keys(params).forEach((key) => {
        formData.append(key, params[key]);
    });
    return formData
}