<template> 
 <div class="block">   
	 	
      

         <el-card header="修改密码" style="width:400px;margin:auto auto;margin-top:50px">
			<el-form ref="subData" :model="subData" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;">
                    <el-form-item label="*旧密码">
                      <el-input  v-model="subData.oldPw"  placeholder="请输入旧密码"></el-input>
                    </el-form-item>    
                    <el-form-item label="*新密码">
                        <el-input v-model="subData.newPw"  placeholder="请输入新密码"></el-input>
                    </el-form-item>
                    <el-form-item label="*确认密码">
                      <el-input  v-model="subData.okPw"  placeholder="请输入确认密码"></el-input>
                    </el-form-item>
                     <el-form-item style="text-align:right" >
                      <el-button type="primary" @click="UpdateRow()">确 定</el-button>
                    </el-form-item>
                 
			</el-form>	
			
        </el-card>

		 

  </div>
</template>
<script>
	//2
	import { RequestPost } from '../../api/api';
    import { RequestGet } from '../../api/api';
	import { url } from '../../api/api';
	import {timeFormat} from '../../api/format';
	import {dateFormat} from '../../api/format';
	import {state} from '../../api/format';
	import { PageSize } from '../../api/api';
	import moment from 'moment';
  	export default {
	  
    methods: {
	  dateFormat,	
	  timeFormat,
	  state,	
      handleSizeChange(val) {
		console.log(`每页 ${val} 条`);
		

      },
      handleCurrentChange(val) {
		console.log(`当前页: ${val}`);
		this.pageNumber = val;

		
		this.page.pageNumber = val;
		/**
		 * 1.get 请求传参数，必须是json前面加一个params
		 * 2.post传参数不需要在json对象传值前面带params
		 */
		

	  },
       


      
     
	  UpdateRow() {
       this.$confirm('确认修改密码, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            
            
            RequestPost("/user/updatePw",this.subData).then(response => {
						
						//this.logining = false; 
                if(response.code=='0000'){
                    this.$message({
                        message: response.message,
                        type: 'success'
                    });  
                    this.$router.push({ path: '/login' });
         
                }else{
                    this.$message({
                        message: response.message,
                        type: 'error'
                    });
                }
         
            }).catch(error => {
            this.$router.push({ path: '/login' });
            })


            
         
            
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消修改'
            });          
            });
      },
     

	
	

  
    
   

	},
	//1
	created:function(){
		//3
	
	
	
	},
    data() {
      return {
		total:0,     //数据的总数量
		totalsize:0,  //总的页数 = 总数量/每页显示的条数
		currentPage:1,
		page:{
			pageSize:PageSize,   //一页显示的条数
            criteria:''
		},
		datalist:[],
		
		listLoading: false,
		form:{},
        subData:{
            oldPw:'',
            newPw:'',
            okPw:''
        },
        isEdit:true, //是否禁用
        dialogFormVisible:true,
        roles:[],
        formtitle:"",
      };
    }
  }
</script>
<style>
	.el-dialog--small {
		 width: 30%; 
	}
    .span {
        position:relative;
        padding:8px;
    }
    .tip {
        display:block;
        background:#f00;
        border-radius:50%;
        width:8px;
        height:8px;
        top:12px;
        right:0px;
        position:absolute;
    }
</style>
