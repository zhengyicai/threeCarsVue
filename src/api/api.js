import axios from 'axios';
import { Message } from 'element-ui';
import router from '../routes';




let base = '';
//访问接口服务器
//export const url  = "http://123.207.121.118:8080/cms";
export const url  = "http://127.0.0.1:8080/cms";
export const fileUrls = 'http://123.207.121.118/uploadImages/';
//export const url  = "http://129.204.214.141:8080/cms";
export const PageSize  = 10;

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

// export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

// export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

// export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

// export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

// export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

// export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const RequestPost = (url1,params) =>{
    return axios.post(url+url1, params,{
        headers: { 
          'token':sessionStorage.getItem("token")
        }}).then(res => res.data).catch(error =>{
            var message = "";
        switch (error.response.status) {
        case 400:
             message = '错误请求'
            break;
        case 401:
             message = '未授权，请重新登录'
            break;
        case 403:
            message = '拒绝访问'
            break;
        case 404:
            message = '请求错误,未找到该资源'
            break;
        case 405:
            message = '请求方法未允许'
            break;
        case 408:
            message = '请求超时'
            break;
        case 500:
            message = '服务器端出错'
            break;
        case 501:
            message = '网络未实现'
            break;
        case 502:
            message = '网络错误'
            break;
        case 503:
           message = '服务不可用'
            break;
        case 504:
            message = '网络超时'
            break;
        case 505:
            message = 'http版本不支持该请求'
            break;
        case 608:
            message = 'token生效，请重新登录'
            break;    
        default:
            message = `连接错误${err.response.status}`
        }
        Message({
            message:message,
            type: 'error'
        });
           
  });
};

export const RequestGet = (url1,params) =>{
    return axios.get(url+url1, {headers: {
        'token': sessionStorage.getItem("token")
    },params:params}).then(res => res.data).catch(error =>{
        
        var message = "";
        switch (error.response.status) {
        case 400:
             message = '错误请求'
            break;
        case 401:
             message = '未授权，请重新登录'
            break;
        case 403:
            message = '拒绝访问'
            break;
        case 404:
            message = '请求错误,未找到该资源'
            break;
        case 405:
            message = '请求方法未允许'
            break;
        case 408:
            message = '请求超时'
            break;
        case 500:
            message = '服务器端出错'
            break;
        case 501:
            message = '网络未实现'
            break;
        case 502:
            message = '网络错误'
            break;
        case 503:
           message = '服务不可用'
            break;
        case 504:
            message = '网络超时'
            break;
        case 505:
            message = 'http版本不支持该请求'
            break;
        case 608:
            message = 'token生效，请重新登录'
            break;    
        default:
            message = `连接错误${err.response.status}`
        }
        Message({
            message:message,
            type: 'error'
        });
        // console.log("asdf");
        // router.push({name: 'login'})
           
       
  });; 
};



/*
* 格式化日期
* sFormat：日期格式:默认为yyyy-MM-dd     年：y，月：M，日：d，时：h，分：m，秒：s
* @example  dateFormat(new Date(),'yyyy-MM-dd')   "2017-02-28"
* @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')   "2017-02-28 09:24:00"
* @example  dateFormat(new Date(),'hh:mm')   "09:24"
* @param date 日期
* @param sFormat 格式化后的日期字符串
* @returns {String}
*/
export const formatDate = (value,sformat)=>{
    return this.dateFormat(new Date(value),sformat);
}

export const dateFormat = (date,sFormat) =>{

 let time = {
   Year: 0,
   TYear: '0',
   Month: 0,
   TMonth: '0',
   Day: 0,
   TDay: '0',
   Hour: 0,
   THour: '0',
   hour: 0,
   Thour: '0',
   Minute: 0,
   TMinute: '0',
   Second: 0,
   TSecond: '0',
   Millisecond: 0
 };
 time.Year = date.getFullYear();
 time.TYear = String(time.Year).substr(2);
 time.Month = date.getMonth() + 1;
 time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
 time.Day = date.getDate();
 time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
 time.Hour = date.getHours();
 time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
 time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
 time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
 time.Minute = date.getMinutes();
 time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
 time.Second = date.getSeconds();
 time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
 time.Millisecond = date.getMilliseconds();

 return sFormat.replace(/yyyy/ig, String(time.Year))
   .replace(/yyy/ig, String(time.Year))
   .replace(/yy/ig, time.TYear)
   .replace(/y/ig, time.TYear)
   .replace(/MM/g, time.TMonth)
   .replace(/M/g, String(time.Month))
   .replace(/dd/ig, time.TDay)
   .replace(/d/ig, String(time.Day))
   .replace(/HH/g, time.THour)
   .replace(/H/g, String(time.Hour))
   .replace(/hh/g, time.Thour)
   .replace(/h/g, String(time.hour))
   .replace(/mm/g, time.TMinute)
   .replace(/m/g, String(time.Minute))
   .replace(/ss/ig, time.TSecond)
   .replace(/s/ig, String(time.Second))
   .replace(/fff/ig, String(time.Millisecond));
}

