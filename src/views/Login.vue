<!--:style="{backgroundImage:'url('+require('./../assets/logo.png')+')'}"-->
<template  >
    <div class="login-wrap">
            <div class="ms-login">
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container"  >
        <h3 class="title">AI屏管理平台</h3>
        <el-form-item prop="account">
          <el-input type="text" @keyup.enter.native="handleSubmit2" v-model="data.loginName" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password" @keyup.enter.native="handleSubmit2" v-model="data.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        

        <el-row>
            <el-col :span="14">
            
                <el-form-item prop="account">
                    <el-input  type="text"   @keyup.enter.native="handleSubmit2"   v-model="data.picCode" auto-complete="off" placeholder="验证码"></el-input>
                </el-form-item>
            
            </el-col>
            <el-col :span="10" style="padding-left:20px"> <img :span="10"  :src="imgStr"  @click="loadImg"> </el-col>
        </el-row>
        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;"   @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
          <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
        </el-form-item>
      
      </el-form>
            </div>
    </div>          
</template>

<script>
  // import { requestLogin } from '../api/api';
  import { url } from '../api/api';
  import { RequestPost } from '../api/api';
    import { RequestGet } from '../api/api';
  
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: 'admin',
          checkPass: '123456'
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true,
        data:{
            loginName:"",
            password:"",
            imgKey:"",
            picCode:""
        },
        imgStr:""
      };
    },
    created:function(){
        this.loadImg();

    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      loadImg(){
        // this.$axios.get(url+'/login/loadImgCode').then(response => {
        //           this.data.imgKey  = response.data.data.imgKey;
        //           this.imgStr = "data:image/jpg;base64,"+response.data.data.imgStr;
                 
        //         }).catch(error => {
        //           console.log(error)
        //   })
        RequestGet("/login/loadImgCode").then(response => {
                
                this.data.imgKey  = response.data.imgKey;
                this.imgStr = "data:image/jpg;base64,"+response.data.imgStr;
            }).catch(error => {
                // this.$message({
                //     message:"error",
                //     type: 'error'
                // });
              })
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            
          // this.$axios.post(url+'/login/loginIn',this.data, {
          // headers: { 
          //   'token':'asdf'
          // }
          // }).then(response => {
                  //this.testData = response.data
                 
                //   if(response.data.code=='0000'){
                //     sessionStorage.setItem('user', JSON.stringify(response.data.data));
                //     this.$router.push({ path: '/table' });
                //   }else{
                //     this.$message({
                //         message: response.data.message,
                //         type: 'error'
                //     });
                //   }
                // }).catch(error => {
                //     this.$message({
                //         message:"error",
                //         type: 'error'
                //     });
                //  })


         
         
            this.logining = true;

            //登录接口
            RequestPost("/login/loginIn",this.data).then(response => {
                  
                  this.logining = false; 
                  if(response.code=='0000'){
                    sessionStorage.setItem('user', JSON.stringify(response.data));
                    sessionStorage.setItem('token', response.data);
                   
                    this.$router.push({ path: '/homeIndex' });
                  }else{
                    this.$message({
                        message: response.message,
                        type: 'error'
                    });
                  }
            }).catch(error => {
               this.$router.push({ path: '/login' });
              })
           
          
           
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
    //background-image: url("../assets/bg1.jpg");
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
   // box-shadow: 0 0 25px #cac6c6;
    .title {
       margin: 0px auto 20px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
    
  }

   .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        
       // background-image: url(/static/login-bg.jpg);
       background-color: #323639;
        //background-size: 100%;
       background-size:cover;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        //width:350px;
        margin:-390px 0 0 -175px;
        border-radius: 5px;
        //background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>