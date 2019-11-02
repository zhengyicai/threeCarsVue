<template> 
 <div class="block">   
	 	<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item style="width:300px">
					<el-input v-model="page.criteria" @keyup.enter.native="query"   placeholder="请输入[姓名|手机号]" style="width:300px"></el-input>
				</el-form-item>
				<el-form-item  >
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
               
				
			</el-form>
		</el-col>
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
		
			
			<el-table-column prop="name" label="昵称" width="120" sortable>
			</el-table-column>
            <el-table-column prop="userName" label="姓名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="手机号" width="150" sortable>
			</el-table-column>
			<el-table-column  label="创建时间" min-width="170">
				<template slot-scope="scope">{{ scope.row.createTime | moment('YYYY-MM-DD HH:mm:ss') }}</template>
			</el-table-column>

            <el-table-column prop="wxId" label="微信" width="330" sortable>
			</el-table-column>
            <!-- <el-table-column prop="imgUrl" label="图片地址" width="170" sortable>
			</el-table-column>
            <el-table-column prop="fingerUrl" label="指纹地址" width="170" sortable>
			</el-table-column>
            <el-table-column prop="identityId" label="身份证id" width="170" sortable>
			</el-table-column>
            <el-table-column prop="identityNo" label="身份证编号" width="170" sortable>
			</el-table-column> -->
			
			<el-table-column  label="状态" min-width="120">
				<template slot-scope="scope">{{ state(scope.row.state)}}</template>
			</el-table-column>
            <el-table-column  label="车夫" min-width="120">
				<template slot-scope="scope">{{ isCars(scope.row.residentType)}}</template>
			</el-table-column>
            <!-- <el-table-column prop="remark" label="留言" width="170" sortable>
			</el-table-column> -->
			
			
			<el-table-column label="操作" min-width="250">
				<template scope="scope">
				<!-- <el-button size="small" type="primary"  @click="edit(scope.$index,scope.row)">编辑</el-button>
				<el-button size="small" type="primary"  v-if='scope.row.sysUserId=="" ||  scope.row.sysUserId ==null' @click="addAdmin(scope.$index,scope.row)">新增物业</el-button>
				<el-button size="small" type="warning"  v-if='scope.row.sysUserId!="" ||  scope.row.sysUserId !=null' @click="editAdmin(scope.$index,scope.row)">修改物业</el-button>
                <el-button size="small" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button> --> 
                <!-- <el-button size="small" type="primary"  @click="edit(scope.$index,scope.row)">授权设备</el-button>
                <el-button size="small" type="primary"   @click="updateRoom(scope.row)">房卡管理</el-button> -->
                <el-button size="small" type="primary" @click="setRow(scope.$index, scope.row)">修改</el-button>
                <el-button size="small" type="warning" @click="setDelete(scope.$index, scope.row)">删除</el-button>

                <!-- <el-button size="small" type="warning" v-if="scope.row.state==='10'"   @click="updateState(scope.row,'20')" >禁用</el-button>
                <el-button size="small" type="success" v-if="scope.row.state==='20'" @click="updateState(scope.row,'10')" >启用</el-button> -->
                
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

        <el-dialog   :title="formtitle" :visible.sync="dialogFormVisibleEqu" >
			<el-table :data="residRooms" highlight-current-row style="width: 100%;">
                    <el-table-column prop="buildingName" label="楼栋" width="100" sortable>
                    </el-table-column>
                    <el-table-column prop="unitName" label="单元" width="100" sortable>
                    </el-table-column>
                    <el-table-column prop="roomName" label="房间" width="100" sortable>
                    </el-table-column>
                    <el-table-column label="户主" width="100" sortable>
                            <template slot-scope="scope">{{ scope.row.owner =='10'?'是':'否'}}</template>
                    </el-table-column>
                    <el-table-column  label="操作" min-width="120" sortable>
                         <!-- <template slot-scope="scope"><el-button size="small" type="danger" @click="deleteItem(scope.row)">删除</el-button></template> -->
                        
                    </el-table-column>
                    
            </el-table>
			
        </el-dialog>


        <el-dialog   title="设为车夫" :visible.sync="dialogFormAdminVisible"  style="width: 70%;margin-left:10%">
			<el-form ref="form1" :model="form1" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;">
			
				<el-form-item label="*用户名">
					<el-input placeholder="请输入用户名" v-model="form1.userName"></el-input>
				</el-form-item>
			
				<el-form-item label="*手机号">
					<el-input placeholder="请输入手机号" v-model="form1.mobile"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormAdminVisible = false">取 消</el-button>
				<el-button type="primary" @click="openAdmin()">确 定</el-button>
			</div>
        </el-dialog>


        <el-dialog   title="新增车夫" :visible.sync="dialogFormAdminAddVisible"  style="width: 80%;margin-left:10%">
			<el-form ref="form1" :model="form1" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;">
                <el-form-item label="选择用户" v-if="choose1">
					<el-button type="primary" @click="showSelect()">选择用户</el-button>{{currObj.name}}
				</el-form-item>

				<el-form-item label="*姓名">
					<el-input placeholder="请输入姓名" v-model="form1.userName"></el-input>
				</el-form-item>
			
				<el-form-item label="*手机号">
					<el-input placeholder="请输入手机号" v-model="form1.mobile"></el-input>
				</el-form-item>
                <el-form-item label="*身份证号码">
					<el-input placeholder="请输入身份证号码" v-model="form1.card"></el-input>
				</el-form-item>
                <el-form-item label="*住址">
					<el-input placeholder="请输入住址" v-model="form1.address"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormAdminAddVisible = false">取 消</el-button>
				<el-button type="primary" @click="openAdmin()">确 定</el-button>
			</div>
        </el-dialog>



        <el-dialog   title="选择用户" :visible.sync="dialogFormAdminAddSelectVisible"  style="width: 90%;margin-left:10%">
           <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true">
                    <el-form-item style="width:300px">
                        <el-input v-model="mobile"    placeholder="请输入[姓名|手机号]" style="width:300px"></el-input>
                    </el-form-item>
                    




                    <el-form-item  >
                        <el-button type="primary" v-on:click="selectMobile">查询</el-button>
                    </el-form-item>
                
                    
                </el-form>

                <el-col style="width:100%">
                        <!-- <el-radio-group v-model="radio">
                            <el-radio   v-for=" m in mobileList" :key="m.id" :label="m.id"><div>昵称:{{m.name}}</div>&nbsp;&nbsp;联系人:{{m.contactName}}&nbsp;&nbsp;联系方式:{{m.contactMobile}}</el-radio>
                           
                        </el-radio-group> -->
                       <!-- {{mobileList}} -->

                       <el-table
                            ref="singleTable"
                            :data="mobileList"
                            highlight-current-row
                            @current-change="handleSelectionChange"
                            style="width: 100%">
                            <el-table-column
                            type="index"
                            width="50">
                            </el-table-column>
                            <el-table-column
                            property="name"
                            label="微信昵称"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            property="contactName"
                            label="联系人"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            property="contactMobile"
                            label="联系方式"
                            >
                            </el-table-column>
                        </el-table>
                </el-col>

            </el-col>
			<!-- <div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormAdminAddSelectVisible = false">取 消</el-button>
				<el-button type="primary" @click="openAdmin()">确 定</el-button>
			</div> -->
        </el-dialog>




         <el-dialog   :title="formtitle" :visible.sync="dialogFormVisibleEqu" width="70%" >
          
            <el-row>
                <el-col :span="24" style="font-size:14px;">
                    <el-card header="小区设备">
                            <table>
                            <label style="font-weight:bold"><input type="checkbox" :checked="choOne"  @click="isSelectedOne($event)"/>全选</label>
                            <tr style="text-align:left">
                                <td >
                                    <label :label="m.id" :key="m.id"  v-for=" m in parentMenuOneData" style="margin-right:10px;width:120px" > <input type="checkbox"  v-model="selectedOneData" :value="m.id"/>{{m.equipmentName}}  </label>
                                </td>
                            </tr>
                            <br/>    
                            
                        </table>
                    </el-card>
                </el-col>
            
            </el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleEqu = false">取 消</el-button>
				<el-button type="primary" @click="addCho()">确 定</el-button>
			</div>
        </el-dialog>



         <el-dialog   title="地址管理" :visible.sync="dialogFormVisible" width="90%" >
			 <el-table  style="width: 100%" :data="addressList">
                        <el-table-column
                            prop="contactName"
                            label="联系人"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            prop="contactMobile"
                            label="联系电话"
                            width="130">
                        </el-table-column>
                        <el-table-column
                            prop="city"
                            label="城市"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            prop="country"
                            label="区县"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            prop="town"
                            label="城镇"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            prop="detail"
                            label="详细地址"
                            width="228">
                        </el-table-column>
                         <el-table-column
                         
                            label="默认"
                            width="80">
                            <template slot-scope="scope">{{ isTrue(scope.row.type)}}</template>
                        </el-table-column>
                        </el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button  type="primary" @click="open1()">确 定</el-button>
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
    import {isTrue} from '../../api/format';
    import {isCars} from '../../api/format';
	import { PageSize } from '../../api/api';
	import moment from 'moment';
  	export default {
	  
    methods: {
	  dateFormat,	
	  timeFormat,
      state,	
      isTrue,
      isCars,
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


      handleSelectionChange(val) {
       
         this.dialogFormAdminAddSelectVisible = false
         this.currObj = val;
         //this.multipleSelection = val;
      },  

      add(){
            this.dialogFormAdminAddVisible = true;
            this.currObj = "";
            this.form1.userName = '';
            this.form1.mobile = '';
            this.form1.address = '';
            this.form1.card = '';
            this.choose1= true;
           

      },
      selectMobile(){
          if(this.mobile ==null|| this.mobile.trim()=="" ){
              return;
          }

            RequestGet("/resident/findSelectAll",{mobile:this.mobile}).then(response => {
            if(response.code == '0000'){
               // alert(response.data);        
                this.mobileList  = response.data;
                    
            }
					
        }).catch(error => {
                        this.$router.push({ path: '/login' });
                        
        })



      },
      showSelect(){
            this.dialogFormAdminAddSelectVisible = true;

      },
      openAdmin(){
          if(this.form1.userName =="" ||this.form1.userName.trim() =="" || this.form1.userName == null){
				this.$message({
					type: 'error',
					message: "姓名不能为空"
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

          if(this.form1.card =="" ||this.form1.card.trim() =="" || this.form1.card == null){
				this.$message({
					type: 'error',
					message: "身份证号码不能为空"
				});          
				return false;
          }
           if(this.currObj.residentId =="" || this.currObj.residentId == null){
				this.$message({
					type: 'error',
					message: "用户不能为空"
				});          
				return false;
          }
         
          

           var opt ={             
                id:this.currObj.residentId,
                residentType:"20",
                mobile:this.form1.mobile,
                userName:this.form1.userName,
                card:this.form1.card,
                address:this.form1.address

            }

            RequestPost("/resident/updateCars",opt).then(response => {
                        
                        
                if(response.code=='0000'){
                    this.$message({
                        message: response.message,
                        type: 'success'
                    });  
                    this.dialogFormAdminAddVisible = false;
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


            


      },  
      setRow(index, rows){
          this.choose1= false;  
          this.form1 = rows;
          this.currObj.residentId = rows.id;
          //this.currObj.name = rows.userName;
          this.dialogFormAdminAddVisible= true;
      },
      setDelete(index, rows){
          this.choose1= false;  
          this.form1 = rows;
          this.form1.residentType = '10';
          this.currObj.residentId = rows.id;

          
           this.$confirm('确认该操作, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {

                 var opt ={             
                    id:this.currObj.residentId,
                    residentType:"10",
                    mobile:this.form1.mobile,
                    userName:this.form1.userName,
                    card:this.form1.card,
                    address:this.form1.address

                }

                RequestPost("/resident/updateCars",opt).then(response => {
                            
                            
                    if(response.code=='0000'){
                        this.$message({
                            message: response.message,
                            type: 'success'
                        });  
                        //this.dialogFormAdminAddVisible = false;
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
                message: '已取消删除'
            });          
            });  

          
          //this.currObj.name = rows.userName;
          //this.dialogFormAdminAddVisible= true;
      },
      showRelationPanel(index, rows){
          this.dialogFormVisible= true;
        
                this.residentId = rows.wxId;
               
                this.loadRooms();
      },
      /**
        * 加载住户房间信息
        */
      

      loadRooms(){
          
         RequestGet("/address/findAllWxId",{wxId:this.residentId}).then(response => {
            if(response.code == '0000'){
                    
                    
                        this.dialogFormVisible = true;    
                        this.addressList = response.data;
                    
            }
					
        }).catch(error => {
                        this.$router.push({ path: '/login' });
                        
        })


          //this.addressList
         
          
      },  
      updateState(rows,state){

           this.$confirm('确认该操作, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
               

                var opt ={
                    communityId:rows.communityId,
                    id:rows.id,
                    state:state
                }

                RequestPost("/resident/updateState",opt).then(response => {
                            
                          
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
      open1(){
         
        this.subData1= {}; 
        this.subData1.remark = this.one+","+this.two+","+this.three+","+this.four+","+this.free;  
        this.subData1.residentId = this.residentId;
        RequestPost("/resident/addCard",this.subData1).then(response => {
                    if(response.code=='0000'){
                        this.$message({
                            message: response.message,
                            type: 'success'
                        });  
                        this.dialogFormVisibleRoom = false;
                    }else{
                        this.$message({
                            message: response.message,
                            type: 'error'
                        });
                    }
                    //this.loadData();
                    //this.communityId = this.subData.communityId;
                    //this.loadCommunityData();
        }).catch(error => {
        this.$router.push({ path: '/login' });
        })

    },
      updateRoom(rows){
         
         this.subData1 = {};
         this.subData = rows;

         this.one = "";
         this.two = "";
         this.three = "";
         this.four = "";
         this.free = "";
         this.residentId = rows.id;

       
         RequestGet("/resident/findResidentCount",{residentId:this.residentId}).then(response => {
            if(response.code == '0000'){
                    if(response.data == 0){
                        this.dialogFormVisibleRoom = false;    
                        this.$message({
								message: "请先授权设备",
								type: 'error'
						});  
                    }else{
                        this.dialogFormVisibleRoom = true;    
                    }
            }
					
        }).catch(error => {
                        this.$router.push({ path: '/login' });
                        
        })

     
         //this.subData1.roomId  = rows.id;
     


         RequestGet("/resident/findCard",{residentId:rows.id}).then(response => {
                    if(response.code=='0000'){
                          if(response.data.length>0){
                              for(var i = 0 ;i<response.data.length;i++){
                                    if(i ==0){
                                      this.one = response.data[i].cardNo+"";
                                  }else if(i ==1){
                                      this.two = response.data[i].cardNo+"";
                                  }else if(i ==2){
                                      this.three = response.data[i].cardNo+"";
                                  }else if(i ==3){
                                      this.four = response.data[i].cardNo+"";
                                  }else if(i ==4){
                                      this.free = response.data[i].cardNo+"";
                                  }
                              }
                          }
                          


                    }else{
                        this.$message({
                            message: response.message,
                            type: 'error'
                        });
                    }
                // this.loadCommunityData();
        }).catch(error => {
        this.$router.push({ path: '/login' });
        })
         

    },  
      
      isSelectedOne(e){
          this.selectedOneData = [];
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
          RequestPost("/equipment/add",this.subData).then(response => {
						
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
          
      },
      getUsers(){},


      
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

            RequestPost("/resident/delete",rows).then(response => {
						
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
       edit(index, rows){
            this.isEdit = true;
            this.dialogFormVisibleEqu = true;
		    this.formtitle ="添加设备";   
           
            this.residentId = rows.id;
            
            this.updateDate = true; 
            RequestGet("/equipment/findCommunitys",{}).then(response => {
						if(response.code == '0000'){
                            this.selectedOneData = [];
                            this.selectedTwoData = [];

                            
                            RequestGet("/user/residentEquipmentFindAll",{residentId:rows.id,communityId:sessionStorage.getItem("communityId")}).then(response => {
                                     for(var i= 0;i<response.data.length;i++){
                              
                                        this.selectedOneData.push(response.data[i].equipmentId);
                                    
                                    }


                            }).catch(error => {
                                   this.$router.push({ path: '/login' });
                                            
                            })   
                           
                             
							
						 }
                        
            }).catch(error => {
                            this.$router.push({ path: '/login' });
                            
            })



            this.loadMenus();
        

      },
     /* 
       * 加载菜单
    */
    loadMenus(){
        this.page.pageSize=9999;   
        RequestGet("/equipment/findAll",this.page).then(response => {
						if(response.code == '0000'){
                              //this.parentMenuOneData = response.data;
                             this.parentMenuOneData = [];
                             this.parentMenuTwoData = [];
                              for(var i= 0;i<response.data.length;i++){
                                 // if(response.data[i].equipmentType=='20'){
                                      this.parentMenuOneData.push(response.data[i]);
                                //   }else{
                                //       this.parentMenuTwoData.push(response.data[i]);
                                   
                                //   }
                              }
							// 	 this.datalist = response.data;
							// 	 this.total = response.page.totalCount; 
                            // 	 this.totalsize  = response.page.pageSize;
                            this.page.pageSize = PageSize;  //一页显示的条数
						 }
					
		}).catch(error => {
						 this.$router.push({ path: '/login' });
						
		})  
      
    },  
	 addCho(){
            
            
            this.subData1.choId = this.selectedOneData; 
            this.subData1.communityId = sessionStorage.getItem("communityId");
            this.subData1.userId = sessionStorage.getItem("userId");
            this.subData1.id = this.residentId;
            if(!this.updateDate){
                RequestPost("/user/addResidentEquipment",this.subData1).then(response => {
                            if(response.code=='0000'){
                                this.$message({
                                    message: response.message,
                                    type: 'success'
                                });  
                                this.dialogFormVisibleEqu = false;
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
                RequestPost("/user/updateResidentEquipment",this.subData1).then(response => {
                            if(response.code=='0000'){
                                this.$message({
                                    message: response.message,
                                    type: 'success'
                                });  
                                 this.dialogFormVisibleEqu = false;
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
	loadData(){

		RequestGet("/resident/residentList",this.page).then(response => {
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
		
	
	},
    data() {
      return {
		total:0,     //数据的总数量
		totalsize:0,  //总的页数 = 总数量/每页显示的条数
		currentPage:1,
		page:{
			pageSize:PageSize,   //一页显示的条数
            criteria:'',
            type:'20'

        },
        currObj:{
            name:'',
            residentId:''

        }, //选择的用户
        formtitle:"用户住房信息",
        datalist:[],
        mobile:"",
        mobileList:[],  //查询的用户列表
        communityId:'',
        residentId:'',
		residRooms:[],
		listLoading: false,
		form:{},
        subData:{},
        isEdit:true, //是否禁用
        dialogFormVisible:false,
        dialogFormVisibleEqu:false,  //显示设备列表
        dialogFormAdminVisible:false, //显示车夫信息
        dialogFormAdminAddVisible:false, //显示车夫信息
        dialogFormAdminAddSelectVisible:false,
        radio:3,
        
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
        residentId:"",
        updateDate:false,
        choose1:true,


        // 房卡
        dialogFormVisibleRoom:false,
        dialogFormVisibleRoomDevice:false,
        one:"",
        two:"",
        three:"",
        four:"",
        free:"",
        
        oneId:"",
        twoId:"",
        threeId:"",
        fourId:"",
        freeId:"",
        
        roomNo:"",
        roomId:"",
        
        oneOld:"",
        twoOld:"",
        threeOld:"",
        fourOld:"",
        freeOld:"",

        oneSum:false,
        twoSum:false,
        threeSum:false,
        fourSum:false,
        freeSum:false,
        addressList:[],
        form1:{
            userName:"",
            mobile:"",
            card:"",
            address:""
        }
       
      };
    }
  }
</script>
<style>
	.el-dialog--small {
		 width: 50%; 
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
