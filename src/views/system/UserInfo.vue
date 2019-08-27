<template> 
 <div class="block" style="margin-top:20px">   
	 	<!-- <el-col :span="20" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item style="width:300px">
					<el-input v-model="page.criteria"  @keyup.enter.native="query"  placeholder="请输入设备[编号|名称]" style="width:300px"></el-input>
				</el-form-item>
				<el-form-item  >
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
                <el-form-item  >
					<el-button type="success" v-on:click="query">刷新</el-button>
				</el-form-item>
				
				
			</el-form>
		</el-col> -->
        <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" style="text-align:right" >
				<el-form-item>
					<el-input  placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item> 
				
				<el-form-item>
					<el-button type="primary" @click="add()">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col> -->
        
		<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;">
		
			
			<el-table-column prop="userName" label="用户名" width="150" sortable>
			</el-table-column>
			<el-table-column prop="loginName" label="登录名" width="150" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="手机号" width="250" sortable>
			</el-table-column>
            <el-table-column prop="roleName" label="角色" width="250" sortable>
			</el-table-column>
			<el-table-column  label="创建时间" min-width="120">
				<template slot-scope="scope">{{ scope.row.createTime | moment('YYYY-MM-DD') }}</template>
			</el-table-column>
			
         
			<el-table-column  label="状态" min-width="120">
				<template slot-scope="scope">{{ state(scope.row.state)}}</template>
			</el-table-column>
            
			
			
			<el-table-column label="操作" min-width="250">
				<template scope="scope">
				 <el-button size="small" type="primary"  @click="edit(scope.$index,scope.row)">编辑</el-button>
			     <el-button size="small" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination
		 	class="pull-right clearfix"
			@current-change="handleCurrentChange"
			:current-page="currentPage"
			:page-size="totalsize" 
			layout="total, prev, pager, next, jumper"
			:total="total" 
		>
		</el-pagination>

        <el-dialog   :title="formtitle" :visible.sync="dialogFormVisible" >
			<el-form ref="subData" :model="subData" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;">
                    <el-form-item label="*用户名">
                      <el-input v-model="subData.userName"  placeholder="请输入用户名"></el-input>
                    </el-form-item>    
                    <el-form-item label="*登录名">
                        <el-input v-bind:disabled="isEdit" v-model="subData.loginName"  placeholder="请输入登录名"></el-input>
                    </el-form-item>
                    <el-form-item label="*密码">
                      <el-input v-bind:disabled="isEdit" v-model="subData.password"  placeholder="请输入密码"></el-input>
                    </el-form-item>
                     <el-form-item label="手机号">
                        <el-input v-model="subData.mobile"  placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="状态">
                        <el-radio-group v-model="subData.roleId">
                            <el-radio :label="item.id" :key="item.id" v-for="item in roles">{{item.roleName}}</el-radio>
                        </el-radio-group>
                    </el-form-item> -->
                    <el-form-item label="状态">
					<el-radio-group v-model="subData.state">
						<el-radio label="10">正常</el-radio>
						<el-radio label="20">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>	
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="open()">确 定</el-button>
			</div>
        </el-dialog>

		 

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
		this.loadData();


	  },
       /**
        * 查询
        */
        query(){
            this.loadData();
        },

      add(){
           this.isEdit = false;
           this.dialogFormVisible = true;
		   this.formtitle ="新增账户";   
		   
           this.subData = {
                userName: '',
                loginName: '',
                password: '1q2w3e',
                mobile: '',
                roleId: '',
                roleName: '',
                state: '10'
            };
            for(let obj in this.roles){
                this.subData.roleId = this.roles[obj].id;
                this.subData.roleName = this.roles[obj].roleName;
                break;
            }


      },
    
       edit(index, rows){
            this.isEdit = true;
            this.dialogFormVisible = true;
		    this.formtitle ="修改账户";   
            this.subData = rows;
            this.subData.password = "******";
        //alert("asdf");


      },
      /**
        * 加载角色
        */
        loadRoles(){
                RequestGet("/user/findRoles").then(response => {
                        if(response.code == '0000'){
                                this.roles = response.data;
                        }else{
                            this.$message({
                                message: response.message,
                                type: 'error'
                            });
                        }
                    
                }).catch(error => {
                                this.$router.push({ path: '/login' });
                                
                })  
        
        },
      open(){
          if(this.formtitle == '新增账户'){
              RequestPost("/user/add",this.subData).then(response => {
						
						//this.logining = false; 
						if(response.code=='0000'){
							this.$message({
								message: response.message,
								type: 'success'
							});  
							this.dialogFormVisible = false;
						}else{
							this.$message({
								message: response.message,
								type: 'error'
							});
						}
						this.loadData();
            }).catch(error => {
            this.$router.push({ path: '/login' });
            })

          }else{
              if(this.subData.loginName.trim()=="" || this.subData.loginName == null){
                this.$message({
                    message: "登录名不能为空",
                    type: 'error'
                });
                return;
              }
            
              RequestPost("/user/update",this.subData).then(response => {
						
						//this.logining = false; 
						if(response.code=='0000'){
							this.$message({
								message: response.message,
								type: 'success'
							});  
							this.dialogFormVisible = false;
						}else{
							this.$message({
								message: response.message,
								type: 'error'
							});
						}
						this.loadData();
            }).catch(error => {
            this.$router.push({ path: '/login' });
            })
          }
          
          
      },  
	  deleteRow(index, rows) {
       this.$confirm('确认删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            // this.$message({
            //     type: 'success',
            //     message: '删除成功!'
            // });

            RequestPost("/user/delete",rows).then(response => {
						
						//this.logining = false; 
                if(response.code=='0000'){
                    this.$message({
                        message: response.message,
                        type: 'success'
                    });  
                    this.dialogFormVisible = false;
                }else{
                    this.$message({
                        message: response.message,
                        type: 'error'
                    });
                }
                this.loadData();
            }).catch(error => {
            this.$router.push({ path: '/login' });
            })


            
            this.dialogFormVisible = false;
            
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
      },
     

	
	loadData(){

		RequestGet("/user/findAll",this.page).then(response => {
						if(response.code == '0000'){
								 this.datalist = response.data;
								 this.total = response.page.totalCount; 
								 this.totalsize  = response.page.pageSize;
						 }
					
		}).catch(error => {
						 this.$router.push({ path: '/login' });
						
		})  
        
						
	
	},

  
    
   

	},
	//1
	created:function(){
		//3
		this.loadData();
		 this.loadRoles();
	
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
        subData:{},
        isEdit:true, //是否禁用
        dialogFormVisible:false,
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
