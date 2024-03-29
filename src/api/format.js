import moment from 'moment';
export function timeFormat(row,column){
    var date = row[column.property];
          if (date == undefined) {
             return "";
          }
          return moment(date).format("YYYY-MM-DD HH:mm:ss");
};

export function dateFormat(row,column){
    var date = row[column.property];
          if (date == undefined) {
             return "";
          }
          return moment(date).format("YYYY-MM-DD");
};

export function state(row){
    var date = row;
          return date =='10'?'正常':date =='20'?'禁用':'';
};

export function isTrue(row){
    var date = row;
          return date =='10'?'是':date =='20'?'否':'';
};

export function isCars(row){
    var date = row;
          return date =='10'?'否':date =='20'?'是':'';
};

export function isWeight(row){
    var date = row;
          return date =='10'?'20~50斤':date =='20'?'51~100斤':date =='30'?'101~500斤':date =='40'?'500斤以上':'';
};

export function isOrderState(row){
    var date = row;
          return date =='10'?'待上门取件':date =='20'?'已上门取件':date =='30'?'取消订单':date =='40'?'确认订单':date =='50'?'交易成功':"";
};

export function isNoticeState(row){
    var date = row;
          return date =='10'?'全量公告':date =='20'?'项目公告':"";
};

export function isPushState(row){
    var date = row;
          return date =='10'?'全量推送':date =='20'?'项目推送':"个人推送";
};




export function recordType(row){
    var data = row;
    var str = "";
    

    if(data == '10'){
        str="密码"; 
    }else if(data == '20'){
        str="用户卡"; 
    }else if(data == '30'){
        str="管理员卡"; 
    }else if(data == '40'){
        str="人脸"; 
    }else if(data == '50'){
        str="身份证"; 
    }else if(data == '60'){
        str="手机远程"; 
    }else if(data == '70'){
        str="二维码"; 
    }else if(data == '80'){
        str="指纹开锁"; 
    }
    return str;
};


export function showType(row){
    var data = row;
    var str = "";
    

    // if(data == '10'){
    //     str="全屏图片"; 
    // }else if(data == '20'){
    //     str="全屏视频"; 
    // }else if(data == '30'){
    //     str="(左1/3)图片:(右2/3)视频"; 
    // }else if(data == '40'){
    //     str="(左2/3)图片:(右1/3)视频"; 
    // }else if(data == '50'){
    //     str="(左1/3)视频:(右2/3)图片"; 
    // }else if(data == '60'){
    //     str="(左2/3)视频:(右1/3)图片"; 
    // }

     if(data == '10'){
        str="图片全屏"; 
    }else if(data == '20'){
        str="视频全屏"; 
    }else if(data == '30'){
        str="图片视频1:2"; 
    }else if(data == '40'){
        str="视频图片2:1"; 
    }else if(data == '50'){
        str="图片1:2"; 
    }else if(data == '60'){
        str="图片2:1"; 
    }else if(data == '70'){
        str="图片1:1"; 
    }
    return str;
};




export function cardState(row){
    var date = row;
          return date =='10'?'已发卡':date =='20'?'未发卡':'';
};
