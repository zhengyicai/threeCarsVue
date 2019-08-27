<template> 
 <div class="block">   
	 	
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" style="text-align:right" >
			
				<el-form-item>
					<el-button type="primary" @click="add()">新增卡号</el-button>
				</el-form-item>
			</el-form>
		</el-col>
        
		<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;">
		
			
			<el-table-column prop="cardNo" label="卡号" width="200" sortable>
			</el-table-column>
			<el-table-column prop="cardName" label="名称" width="200" sortable>
			</el-table-column>
			
			<el-table-column  label="创建时间" min-width="120">
				<template slot-scope="scope">{{ scope.row.createTime | moment('YYYY-MM-DD') }}</template>
			</el-table-column>
			<el-table-column  label="状态" min-width="120">
				<template slot-scope="scope">{{ state(scope.row.state)}}</template>
			</el-table-column>

            <el-table-column prop="remark" label="备注" width="250" sortable>
			</el-table-column>
			
			
			<el-table-column label="操作" min-width="250">
				<template scope="scope">
				 <el-button size="small" type="primary" :disabled="scope.row.countSum!=''  && scope.row.countSum!='0'"  @click="edit(scope.$index,scope.row)">编辑</el-button>
                 <el-button size="small" type="primary"  @click="queryEqu(scope.$index,scope.row)">查看</el-button>
			     <el-button size="small" type="danger" :disabled="scope.row.countSum!=''  && scope.row.countSum!='0'" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
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

        <el-dialog   :title="formtitle" :visible.sync="dialogFormVisible" width="70%" >
           <el-form  label-width="50px"   style="margin:20px; text-align:left">
                    <el-form-item label="*卡号">
                      <el-input v-model="subData1.cardNo" :disabled="updateDate"  placeholder="请输入卡号"></el-input>
                    </el-form-item>
                    <el-form-item label="*名称">
                      <el-input v-model="subData1.cardName" :disabled="updateDate"   placeholder="请输入名称"></el-input>
                    </el-form-item>    
           </el-form>   
            <el-row>
                <el-col :span="24" style="font-size:14px;">
                    <el-card header="小区设备">
                            <table>
                            <label style="font-weight:bold"><input type="checkbox" :checked="choOne"  @click="isSelectedOne($event)"/>围墙机</label>
                            <tr style="text-align:left">
                                <td >
                                    <label :label="m.id" :key="m.id"  v-for=" m in parentMenuOneData" style="margin-right:10px;width:120px" > <input type="checkbox"  v-model="selectedOneData" :value="m.id"/>{{m.equipmentName}}  </label>
                                </td>
                            </tr>
                            <br/>    
                            <label style="font-weight:bold"><input type="checkbox" :checked="choTwo"  @click="isSelectedTwo($event)"/>单元门口机</label>
                            <tr style="text-align:left">
                                <td >
                                    <label :label="m.id" :key="m.id"  v-for=" m in parentMenuTwoData" style="margin-right:10px;width:150px" > <input type="checkbox" v-model="selectedTwoData" :value="m.id"/>{{m.equipmentName}}  </label>
                                </td>
                            </tr>
                        </table>
                    </el-card>
                </el-col>
            
            </el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addCho()">确 定</el-button>
			</div>
        </el-dialog>



        <!-- 查看设备绑定状态 -->
        <el-dialog   :title="formtitle" :visible.sync="dialogFormVisible2" width="40%" >
           <el-table :data="userEquipmentList" highlight-current-row style="width: 100%;">
                    <el-table-column prop="equipmentName" label="设备名称" width="385" sortable>
                    </el-table-column>
                    
                    <el-table-column label="是否已发卡" width="150" sortable>
                            <template slot-scope="scope">{{ scope.row.state =='10'?'是':'否'}}</template>
                    </el-table-column>
                  
                    
            </el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible2 = false">取 消</el-button>
				<el-button type="primary" @click="addCho()">确 定</el-button>
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
    import {cardState} from '../../api/format';
	import { PageSize } from '../../api/api';
	import moment from 'moment';
  	export default {
	  
    methods: {
	  dateFormat,	
	  timeFormat,
      state,
      cardState,	
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
    queryEqu(index, rows){
        this.dialogFormVisible2 = true;
        var cardId1  = rows.id;
        this.userEquipmentList = [];
        RequestGet("/user/cardEquipmentFindAll",{cardId:cardId1}).then(response => {
						if(response.code == '0000'){
                              //this.parentMenuOneData = response.data;
                                this.userEquipmentList = response.data;
                             
							
						 }
					
		}).catch(error => {
						 this.$router.push({ path: '/login' });
						
		})      





    },    

            /**
    * 加载菜单
    */
    loadMenus(){

        RequestGet("/equipment/findAll",this.page).then(response => {
						if(response.code == '0000'){
                              //this.parentMenuOneData = response.data;
                             this.parentMenuOneData = [];
                             this.parentMenuTwoData = [];
                              for(var i= 0;i<response.data.length;i++){
                                  if(response.data[i].equipmentType=='20'){
                                      this.parentMenuOneData.push(response.data[i]);
                                  }else{
                                      this.parentMenuTwoData.push(response.data[i]);
                                      //this.choTwo = true;
                                  }
                              }
							// 	 this.datalist = response.data;
							// 	 this.total = response.page.totalCount; 
							// 	 this.totalsize  = response.page.pageSize;
						 }
					
		}).catch(error => {
						 this.$router.push({ path: '/login' });
						
		})  
      
    },  

      add(){
          
           this.isEdit = false;
           this.dialogFormVisible = true;
		   this.formtitle ="新增管理员卡号";   
           this.subData1 = {};
           this.selectedOneData = [];
           this.selectedTwoData = [];
           this.updateDate = false; 

             this.loadMenus();


      },
      addCho(){
            
            
            this.subData1.choId = this.selectedTwoData.concat(this.selectedOneData); 
            this.subData1.communityId = sessionStorage.getItem("communityId");
            this.subData1.userId = sessionStorage.getItem("userId");

            if(!this.updateDate){
                RequestPost("/user/addUserCard",this.subData1).then(response => {
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
                RequestPost("/user/updateUserCard",this.subData1).then(response => {
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

      validate(){
          if(this.subData.userName.trim() =="" || this.subData.userName == null){
            this.$message({
                message:"用户名不能为空",
                type: 'error'
            });
            return false;
          }

          if(this.subData.loginName.trim() =="" || this.subData.loginName == null){
            this.$message({
                message:"登录名不能为空",
                type: 'error'
            });
            return false;
          }
          if(this.subData.password.trim() =="" || this.subData.password == null){
            this.$message({
                message:"密码不能为空",
                type: 'error'
            });
            return false;
          }

          if(this.subData.code=="" || this.subData.code == null){
            this.$message({
                message:"厂商编号不能为空",
                type: 'error'
            });
            return false;
          }






      },
    
       edit(index, rows){
            this.isEdit = true;
            this.dialogFormVisible = true;
		    this.formtitle ="修改设备";   
           
            this.subData1.cardNo = rows.cardNo;
            this.subData1.cardName = rows.cardName;
            this.subData1.id = rows.id;
            var cardId1 = rows.id;
            this.updateDate = true;

            RequestGet("/user/cardEquipmentFindAll",{cardId:cardId1}).then(response => {
						if(response.code == '0000'){
                            this.selectedOneData = [];
                            this.selectedTwoData = [];
                            for(var i= 0;i<response.data.length;i++){
                                if(response.data[i].equipmentType=='20'){
                                    this.selectedOneData.push(response.data[i].equipmentId);
                                }else{
                                    this.selectedTwoData.push(response.data[i].equipmentId);
                                    //this.choTwo = true;
                                }
                            }
                             
							
						 }
                        
            }).catch(error => {
                            this.$router.push({ path: '/login' });
                            
            })



            this.loadMenus();
        

      },

      isSelectedTwo(e){
            var cho = e.target.checked;  //判断是否选中
            
            if(cho){
                for(var i = 0 ;i<this.parentMenuTwoData.length;i++){
                    this.selectedTwoData.push(this.parentMenuTwoData[i].id);
                }
                this.choTwo = true;
              
            }else{
              
                this.selectedTwoData=[];
                this.choTwo = false;
            }
      },
      isSelectedOne(e){
            var cho = e.target.checked;  //判断是否选中
            
            if(cho){
                for(var i = 0 ;i<this.parentMenuOneData.length;i++){
                    this.selectedOneData.push(this.parentMenuOneData[i].id);
                }
                this.choOne = true;
              
            }else{
              
                this.selectedOneData=[];
                this.choOne = false;
            }
      },
     
      open(){
          if(this.formtitle == '新增厂商'){
              this.subData.parentId ='66b7ef552d9e4e4599e853c7d6101373';  //admin
              this.subData.roleId='70220c5ee71e11e8987f5254003ad144';
              this.subData.roleName='厂商管理员';
               
              if(this.validate() == false){
                  return;
              }

              RequestPost("/user/firmAdd",this.subData).then(response => {
						
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
              
              if(this.validate() == false){
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
           
            var cardId1 = rows.id;   
            RequestPost("/user/deleteUserCard",{id:cardId1}).then(response => {
						
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
       
		RequestGet("/user/cardFindAll",{ userId:sessionStorage.getItem("userId")}).then(response => {
						if(response.code == '0000'){
                                 
                                 this.datalist = response.data;
                                 for(var i= 0 ;i<this.datalist.length;i++){
                                    
                                    // if(this.datalist[i].code != null && this.datalist[i].code != "" ){
                                    //     this.datalist[i].code = this.datalist[i].code.toString(16);
                                    // }
                                    
                                 }   
                                 
                                 
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
			pageSize:9999,   //一页显示的条数
            criteria:''
		},
		datalist:[],
		
		listLoading: false,
		form:{},
        subData:{},
        isEdit:true, //是否禁用
        dialogFormVisible:false,
        dialogFormVisible2:false,
        roles:[],
        formtitle:"",
        parentMenuOneData:[],
        parentMenuTwoData:[],
        selectedTwoData:[],
        selectedOneData:[],
        selectedTwoDataAll:[],
        selectedOneDataAll:[],
        choTwo:false,
        choOne:false,
        subData1:{},
        userEquipmentList:[],
        updateDate:false, //修改界面是否可以修改卡号卡名
         
      };
    }
  }
</script>
<style>
	
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
