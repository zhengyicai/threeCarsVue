<template> 
 <div class="block">   
	 	<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" style="text-align:right" >
				<!-- <el-form-item>
					<el-input  placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item> -->
				
				<el-form-item>
					<el-button type="primary" @click="add()">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
        
		<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;">
		
			
			<el-table-column prop="communityNo" label="用户编号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="communityName" label="用户名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="province" label="省份" width="120" sortable>
			</el-table-column>
			<el-table-column prop="city" label="城市" width="120" sortable>
			</el-table-column>
			<el-table-column prop="area" label="区县" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="address" label="地址" min-width="120" sortable>
			</el-table-column>
			<!-- <el-table-column prop="createTime" :formatter="dateFormat"  label="创建时间" min-width="120" sortable>
						
			</el-table-column> -->

			<el-table-column  label="创建时间" min-width="120">
				<template slot-scope="scope">{{ scope.row.createTime | moment('YYYY-MM-DD') }}</template>
			</el-table-column>
			<el-table-column  label="状态" min-width="80">
				<template slot-scope="scope">{{ state(scope.row.state)}}</template>
			</el-table-column>
			
			<!-- <el-table-column prop="userName" label="物业员用户名" min-width="150">
			</el-table-column>
			<el-table-column label="物业员状态" min-width="110">
				<template slot-scope="scope">{{ state(scope.row.userStatus)}}</template>
			</el-table-column> -->
			<el-table-column prop="code" label="代理商编号" min-width="110">
			</el-table-column>
			<el-table-column prop="userWorkName" label="代理商名称" min-width="110">
			</el-table-column>


			
			<!-- <el-table-column prop="userWorkName" label="工程商用户名" min-width="150" sortable>
			</el-table-column>
			<el-table-column label="工程商状态" min-width="120">
				<template slot-scope="scope">{{ state(scope.row.userWorkStatus)}}</template>
			</el-table-column> -->
			<el-table-column label="操作" min-width="340">
				<template scope="scope">
				<!-- <el-button size="small" type="primary"  @click="editWork(scope.$index,scope.row)">工程商</el-button> -->
				<el-button size="small" type="primary"  @click="edit(scope.$index,scope.row)">编辑</el-button>
				<!-- <el-button size="small" type="primary"  v-if='scope.row.sysUserId=="" ||  scope.row.sysUserId ==null' @click="addAdmin(scope.$index,scope.row)">新增物业</el-button>
				<el-button size="small" type="warning"  v-if='scope.row.sysUserId!="" &&  scope.row.sysUserId !=null' @click="editAdmin(scope.$index,scope.row)">修改物业</el-button> -->
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
			<el-form ref="form" :model="form" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;">
				<!-- <el-form-item label="小区编号">
					<el-input v-model="form.communityNo"></el-input>
				</el-form-item> -->
				<el-form-item label="*小区名字">
					<el-input v-model="form.communityName"></el-input>
				</el-form-item>
				<!-- <el-form-item label="*主机数">
					<el-input type="number" v-model="form.masterNum"></el-input>
				</el-form-item>
				<el-form-item label="*用户数">
					<el-input type="number" v-model="form.userNum"></el-input>
				</el-form-item> -->
				<el-form-item label="省" >
					<el-select  v-model="form.provinceCode" placeholder="请选择省份" @change="selectProvince(form.provinceCode)">
						<el-option :label="item.name" :key="item.code" :value="item.code" v-for="item in provinces">{{item.name}}</el-option>
						
					</el-select>
				</el-form-item>
				<el-form-item label="市">
					<el-select v-model="form.cityCode" placeholder="请选择市" @change="selectCity(form.cityCode)">
						<el-option :label="item.name" :key="item.code" :value="item.code" v-for="item in citys">{{item.name}}</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="区">
					<el-select v-model="form.areaCode" placeholder="请选择区" @change="selectArea(form.areaCode)">
						<el-option :label="item.name" :key="item.code" :value="item.code" v-for="item in areas">{{item.name}}</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="地址">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.state">
						<el-radio label="10">正常</el-radio>
						<el-radio label="20">禁用</el-radio>
					</el-radio-group>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="open2()">确 定</el-button>
			</div>
        </el-dialog>
		
	
		

		<!-- 弹出新增物业 -->
		<el-dialog   :title="formAdmintitle" :visible.sync="dialogFormAdminVisible" >
			<el-form ref="form1" :model="form1" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;">
			
				<el-form-item label="*用户名">
					<el-input placeholder="请输入用户名" v-model="form1.userName"></el-input>
				</el-form-item>
				<el-form-item label="*登录名">
					<el-input placeholder="请输入登录名" v-model="form1.loginName"></el-input>
				</el-form-item>
				<el-form-item label="*密码">
					<el-input placeholder="请输入密码" v-model="form1.password"></el-input>
				</el-form-item>
				<el-form-item label="手机号">
					<el-input placeholder="请输入手机号" v-model="form1.mobile"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form1.state">
						<el-radio label="10">正常</el-radio>
						<el-radio label="20">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="openAdmin()">确 定</el-button>
			</div>
        </el-dialog>


		<!-- 弹出修改物业 -->
		<el-dialog   :title="formAdmintitle" :visible.sync="dialogFormAdminUpdateVisible" >
			<el-form ref="form1" :model="form1" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;">
			
				<el-form-item label="用户名">
					<el-input disabled="disabled"  placeholder="请输入用户名" v-model="form1.userName"></el-input>
				</el-form-item>
				
				<el-form-item label="*密码">
					<el-input placeholder="请输入密码" v-model="form1.password"></el-input>
				</el-form-item>
				

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="openAdmin()">确 定</el-button>
			</div>
        </el-dialog>
		<!-- 查看工程商信息 -->
		<el-dialog   title=" 查看工程商信息" :visible.sync="dialogFormWorkVisible"  width="40%">
			<el-form ref="form1" :model="form1" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;">
				<el-form-item label="工程商用户名">
					<el-input disabled="disabled"  placeholder="请输入用户名" v-model="form2.userWorkName"></el-input>
					<!-- {{form2.userWorkName}} -->
				</el-form-item>
				
				<el-form-item label="工程商状态">
					<!-- <el-input disabled="disabled"  placeholder="请输入用户名" v-model="form2.userWorkStatus"></el-input> -->
					 {{ state(form2.userWorkStatus)}}
					<!-- <template slot-scope="scope">{{ state(scope.form2.userWorkStatus)}}</template> -->
				</el-form-item>
				


				
				

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormWorkVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogFormWorkVisible = false">确 定</el-button>
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
	  deleteRow(index, rows) {
       this.$confirm('是否确认删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
            this.dialogFormVisible = false;
            
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
      },
      edit(index,rows){
        this.dialogFormVisible = true;   
		this.form = rows;
		this.formtitle ="修改小区";
		this.loadCity(this.form.provinceCode);
		this.loadArea(this.form.cityCode);
		//alert(this.form.province+"city"+this.form.city+"province"+this.form.area);
		// this.selectProvince(this.form.provinceCode);
		// this.selectCity(this.form.cityCode);
		// this.selectArea(this.form.areaCode);
		
		//console.log(this.form);
	  },
	  editWork(index,rows){
		
        this.dialogFormWorkVisible = true;   
		this.form2 = rows;
			
	  },
      add(){
		this.dialogFormVisible = true;
		
		this.formtitle ="新增小区";   
		this.form = {
			"provinceCode":"",
			"cityCode":"",
			"areaCode":"",
			"code":sessionStorage.getItem("code"),
			"sysWorkId":sessionStorage.getItem("userId"),
			"state":"10"			
		};
        
      },
      getUsers(){

      },
      open2() {
		  	if(this.formtitle =="新增小区"){

				  if(this.validate1() == false){
					  return;
				  }
				  this.$confirm('新增小区, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
					}).then(() => {	

						
						//return;
						RequestPost("/community/workAdd",this.form).then(response => {
							
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


					
					
					}).catch(() => {
							// this.$message({
							// 	type: 'info',
							// 	message: '已取消修改'
							// });          
					});

			}else{
				 if(this.validate1() == false){
					  return;
				  }
				this.$confirm('修改小区, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(() => {	
					RequestPost("/community/update",this.form).then(response => {
						
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


				
				
				}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消修改'
						});          
				});

			}
			this.loadData();
		
            
	  },

	  	//新增物业保存 
	   openAdmin() {
		  	if(this.formAdmintitle =="添加物业账号"){
				  if(this.valuidate2() ==false){
					  return;
				  }
				  this.$confirm('添加物业账号, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
					}).then(() => {	
						RequestPost("/community/addUser",this.form1).then(response => {
							
							
							if(response.code=='0000'){
								this.$message({
									message: response.message,
									type: 'success'
								});  
								this.dialogFormAdminVisible = false;
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


					
						this.loadData();
					}).catch(() => {
							this.$message({
								type: 'info',
								message: '已取消修改'
							});          
					});

			}else{ 

				if(this.form1.password.trim()=="" ||this.form1.password==null){
					this.$message({
						type: 'error',
						message: '密码不能为空'
					}); 
					return;
				}	

				this.$confirm('修改物业账号, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(() => {	
					RequestPost("/community/updatePw",this.form1).then(response => {
						
						//this.logining = false; 
						if(response.code=='0000'){
							this.$message({
								message: response.message,
								type: 'success'
							});  
							this.dialogFormAdminVisible = false;
							this.dialogFormAdminUpdateVisible =false; 
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


				
				
				}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消修改'
						});          
				});

			}
			this.loadData();
		
            
	  },

	/**
    * 加载省份
    */
   //二
    loadProvince(){
		var page = {
			 parentCode:'100000'
		}


		
		this.$axios.get(url+'/community/findCitys', {params:page}).then(response => {
			 			if(response.data.code == '0000'){
								this.provinces = response.data.data;
								//console.log(this.provinces);
								for(let opt in this.provinces){
									if(!this.form.provinceCode){
										this.form.provinceCode = this.provinces[opt].code;
										this.form.province = this.provinces[opt].name;
										//alert("province"+this.form.province +this.form.provinceCode);
										this.loadCity(this.form.provinceCode);
									}
									break;
								}
								
						 }
                 
                }).catch(error => {
                  console.log(error)
        })	


    },

    /**
    * 加载城市
    */
   //三
    loadCity(provinceCode){

		//alert("form"+ this.form.province+this.form.provinceCode);
		var data = {
		
                parentCode:provinceCode
            
		}
		this.$axios.get(url+'/community/findCitys', {params:data}).then(response => {
			 			if(response.data.code == '0000'){
								this.citys = response.data.data;
								//console.log(this.citys);	
								for(let opt in this.citys){
								if(!this.form.cityCode){
									this.form.cityCode = this.citys[opt].code;
									this.form.city = this.citys[opt].name;
									//alert("city"+this.form.province +this.form.city+this.form.area);
									this.loadArea(this.form.cityCode);
								}
								break;
							}							
						 }
                }).catch(error => {
                  console.log(error)
        })
       
    },

    /**
    * 加载区县
    */

    //四
    loadArea(cityCode){
		var data = {
			
                parentCode:cityCode
           
		}
		
		this.$axios.get(url+'/community/findCitys', {params:data}).then(response => {
			 			if(response.data.code == '0000'){
								this.areas = response.data.data;
								//console.log(this.areas);	
								 for(let opt in this.areas){
									if(!this.form.areaCode){
										this.form.areaCode = this.areas[opt].code;
										this.form.area = this.areas[opt].name;
										//alert("area"+this.form.province +this.form.city+this.form.area);
										
									}
									break;
								}							
						 }
                }).catch(error => {
                  console.log(error)
        })
	},
	/**
    * 改变省份
	* 五
    */
    selectProvince(obj){
	//	alert(obj);
	   //this.form.province = obj;
	 for(let opt in this.provinces){
		 if(obj  ==  this.provinces[opt].code){
				 this.form.province = this.provinces[opt].shortName;
				 break;
		 }

	 }
	   //alert(this.provinces[obj.selectedIndex].name);
        this.form.cityCode=null;
		this.form.areaCode=null;
        this.loadCity(obj);
    },

    /**
    * 改变城市
	* 六
    */
    selectCity(obj){
		//this.form.city = obj;
		 for(let opt in this.citys){
			if(obj  ==  this.citys[opt].code){
					this.form.city = this.citys[opt].shortName;
					break;
			}

		}
		this.form.areaCode=null;
		this.form.area=null;
        this.loadArea(obj);
    },

    /**
    * 改变区县
	* 七
    */
    selectArea(obj){
		
		for(let opt in this.areas){
			if(obj  ==  this.areas[opt].code){
					this.form.area = this.areas[opt].shortName;
					break;
			}

		}
		//alert(this.form.area);
	},
	
	loadData(){

		RequestGet("/community/findAll",this.page).then(response => {
						if(response.code == '0000'){
								 this.datalist = response.data;
								 this.total = response.page.totalCount; 
								 this.totalsize  = response.page.pageSize;
						 }
					
					}).catch(error => {
						 this.$router.push({ path: '/login' });
						
		})  
						
		
		//  this.$axios.get(url+'/community/findAll', {params:this.page}).then(response => {
		// 	 			if(response.data.code == '0000'){
		// 						 this.datalist = response.data.data;
		// 						 this.total = response.data.page.totalCount; 
		// 						 this.totalsize  = response.data.page.pageSize;
		// 				 }
                 
        //         }).catch(error => {
        //           console.log(error)
		// });	
	},

	addAdmin(index,rows){
        this.dialogFormAdminVisible = true;   
		
		this.formAdmintitle ="添加物业账号";
		
		this.form1 = {
            userName: '',
            loginName: '',
            password: '1q2w3e',
            mobile: '',
            roleId: '7541f8cd47ca45edb046e06dc9bb2f1a',
            roleName: '物业管理员',
            state: '10',
			communityArea:rows.id,
			code:sessionStorage.getItem("code")
        };
    },
	editAdmin(index,rows){
        this.dialogFormAdminUpdateVisible = true; 
		
	
		this.form1 = {
            userName: rows.userName,
            password: '',
            state: '10',
            id:rows.sysUserId
        };
		this.formAdmintitle ="修改物业账号";
		
	  },

	  valuidate2(){
		  if(this.form1.userName =="" ||this.form1.userName.trim() =="" || this.form1.userName == null){
				this.$message({
					type: 'error',
					message: "用户名不能为空"
				});          
				return false;
		  }
		  if(this.form1.loginName =="" ||this.form1.loginName.trim() =="" || this.form1.loginName == null){
				this.$message({
					type: 'error',
					message: "登录名不能为空"
				});          
				return false;
		  }	

		  if(this.form1.password =="" ||this.form1.password.trim() =="" || this.form1.password == null){
				this.$message({
					type: 'error',
					message: "密码不能为空"
				});          
				return false;
		  }	

		   if(this.form1.mobile =="" ||this.form1.mobile.trim() =="" || this.form1.mobile == null){
				this.$message({
					type: 'error',
					message: "手机号不能为空"
				});          
				return false;
		  }	




	  },	
	  validate1(){  //新增（修改）小区
	
		
		if(this.form.communityName =="" || this.form.communityName == null){
				//this.warningText = ;
				this.$message({
					type: 'error',
					message: "小区名字不能为空"
				});          
				return false;
		}

		if(this.form.communityName.trim().length =="" ){
				//this.warningText = ;
				this.$message({
					type: 'error',
					message: "小区名字不能为空"
				});          
				return false;
		}
		if(this.form.communityName.length>20){
				this.$message({
					type: 'error',
					message: "小区名字长度过大"
				});    
				return false;				
		}
		// if(this.form.masterNum <=0 || this.form.masterNum == null){
		// 		this.$message({
		// 			type: 'error',
		// 			message: "主机数不能小于1"
		// 		});
		// 		return false;
		// }
		// if(this.form.userNum <=0 || this.form.userNum == null){
		// 		this.$message({
		// 			type: 'error',
		// 			message: "用户数不能小于1"
		// 		});
		// 		return false;
		// }
		if(this.form.provinceCode.trim().length ==0 || this.form.provinceCode == null){
				this.$message({
					type: 'error',
					message: "请选择省份"
				});
				return false;
		}
		if(this.form.cityCode.trim().length ==0 || this.form.cityCode == null){
				this.$message({
					type: 'error',
					message: "请选择城市"
				});
				return false;
		}
		if(this.form.areaCode.trim().length ==0 || this.form.areaCode == null){
				this.$message({
					type: 'error',
					message: "请选择区县"
				});
				return false;
		}

	},

	},
	
	//1
	created:function(){
		//3
		this.loadData();
		
		//一
		this.loadProvince();
	},
    data() {
      return {
		total:0,     //数据的总数量
		totalsize:0,  //总的页数 = 总数量/每页显示的条数
		currentPage:1,
		page:{
			pageSize:PageSize   //一页显示的条数
		},
		datalist:[],
		
		listLoading: false,
		form:{communityName:"",provinceCode:"",cityCode:"",areaCode:""},
		form1:{},
		form2:{},
		dialogFormVisible:false,
		provinces:[], //获取省份
		citys:[], //获取市
		areas:[], //获取区
		formtitle:"",
		formAdmintitle:"",
		dialogFormAdminVisible:false,//物业
		dialogFormAdminUpdateVisible:false,
		dialogFormWorkVisible:false,  //工程商
		isEditUser:false, //是否禁用
		warningText:"" //警告语


      };
    }
  }
</script>
<style>
	.el-dialog--small {
		 width: 30%; 
	}
</style>
