<template> 
 <div class="block">   
	 	<!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item style="width:300px">
					<el-input v-model="page.criteria" @keyup.enter.native="query"   placeholder="请输入[姓名|手机号]" style="width:300px"></el-input>
				</el-form-item>
				<el-form-item  >
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
               
				
			</el-form>
		</el-col> -->
        <!-- <el-col :span="4" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				
				<el-form-item  style="text-align:right">
					<el-button type="primary" @click="add()">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col> -->
      
        
		<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%; margin-top:20px">
		
			
			<el-table-column prop="name" label="姓名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="手机号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="communityName" label="所属小区" width="150" sortable>
			</el-table-column>
            <el-table-column prop="equipmentNo" label="设备编号" width="150" sortable>
			</el-table-column>
			<el-table-column  label="创建时间" min-width="120">
				<template slot-scope="scope">{{ scope.row.createTime | moment('YYYY-MM-DD HH:mm:ss') }}</template>
			</el-table-column>
            <el-table-column prop="wxId" label="微信" width="300" sortable>
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
				<template slot-scope="scope">{{recordType(scope.row.state)}}</template>
			</el-table-column>
            <el-table-column prop="remark" label="留言" width="170" sortable>
			</el-table-column>
			
			
			<el-table-column label="操作" min-width="70">
				<template scope="scope">
				<!-- <el-button size="small" type="primary"  @click="edit(scope.$index,scope.row)">编辑</el-button>
				<el-button size="small" type="primary"  v-if='scope.row.sysUserId=="" ||  scope.row.sysUserId ==null' @click="addAdmin(scope.$index,scope.row)">新增物业</el-button>
				<el-button size="small" type="warning"  v-if='scope.row.sysUserId!="" ||  scope.row.sysUserId !=null' @click="editAdmin(scope.$index,scope.row)">修改物业</el-button>
                <el-button size="small" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button> -->
                <el-button size="small" type="primary"  @click="edit(scope.$index,scope.row)">查看开锁图片</el-button>
                <!-- <el-button size="small" type="primary"   @click="updateRoom(scope.row)">房卡管理</el-button> -->
                <!-- <el-button size="small" type="primary" @click="showRelationPanel(scope.$index,scope.row)">住房信息</el-button> -->
                <!-- <el-button size="small" type="danger" @click="deleteRow(scope.$index,scope.row)">删除</el-button> -->
                <!-- <el-button size="small" type="warning" v-if="scope.row.state==='10'"   @click="updateState(scope.row,'20')" >禁用</el-button>
                <el-button size="small" type="success" v-if="scope.row.state==='20'" @click="updateState(scope.row,'10')" >启用</el-button>
                <el-button size="small" type="info" v-if="scope.row.state==='30'"  @click="updateState(scope.row,'10')">授权</el-button> -->
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
			
			
        </el-dialog>


         <el-dialog   :title="formtitle" :visible.sync="dialogFormVisibleEqu" width="70%" >
          
            <el-row>
                <el-col :span="24" style="font-size:14px;">
                    <el-card>
                           <img :src="imgurl" style="width:100%;height:100%;">
                    </el-card>
                </el-col>
            
            </el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleEqu = false">取 消</el-button>
				<el-button type="primary" @click="addCho()">确 定</el-button>
			</div>
        </el-dialog>




         <el-dialog   title="房卡管理" :visible.sync="dialogFormVisibleRoom" >
			<el-form ref="subData" :model="subData1" label-width="100px" @submit.prevent="onSubmit" style="margin:0px;">
                <el-form-item label="卡号1">
                        <el-input style="width:60%"  v-model="one" type="number" placeholder="请输入10位数的卡号"></el-input>
                </el-form-item>
                <el-form-item label="卡号2">
                        <el-input style="width:60%" v-model="two"  placeholder="请输入10位数的卡号"></el-input>
                </el-form-item>
                <el-form-item label="卡号3">
                        <el-input style="width:60%"  v-model="three"  placeholder="请输入10位数的卡号"></el-input>
                </el-form-item>
                <el-form-item label="卡号4">
                        <el-input style="width:60%"  v-model="four"  placeholder="请输入10位数的卡号"></el-input>
                </el-form-item>
                <el-form-item label="卡号5">
                        <el-input style="width:60%" v-model="free"  placeholder="请输入10位数的卡号"></el-input>
                </el-form-item>
               
                   
			</el-form>	
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleRoom = false">取 消</el-button>
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
    import {recordType} from '../../api/format';
    
    import { PageSize } from '../../api/api';
	import moment from 'moment';
  	export default {
	  
    methods: {
	  dateFormat,	
	  timeFormat,
      state,	
      recordType,
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
           

      },
      deleteItem(){

      },
      showRelationPanel(index, rows){
          this.dialogFormVisible= true;
          this.communityId = rows.communityId;
                this.residentId = rows.id;
               
                this.loadRooms();
      },
      /**
        * 加载住户房间信息
        */
      

      loadRooms(){
         
            var room = {
                    residentId: this.residentId,
                    communityId: this.communityId
                };
            RequestGet("/resident/findResidentRooms",room).then(response => {
						if(response.code == '0000'){
								 this.residRooms = response.data;
						 }
					
            }).catch(error => {
                            this.$router.push({ path: '/login' });
                            
            })  
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
		    this.formtitle ="查看开锁图片";   
           
            this.residentId = rows.id;
            this.imgurl = "http://www.zhcloudshare.com/uploadImages/"+rows.imgUrl;
            
            this.updateDate = true; 
           



        

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

         if(sessionStorage.getItem("userId") == "66b7ef552d9e4e4599e853c7d6101373"){
            this.page.communityId ="";        
         }else{
            this.page.communityId = sessionStorage.getItem("communityId");
         }


		RequestGet("/resident/useEquRecord",this.page).then(response => {
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
            communityId:''
        },
        formtitle:"用户住房信息",
        datalist:[],
        communityId:'',
        residentId:'',
		residRooms:[],
		listLoading: false,
		form:{},
        subData:{},
        isEdit:true, //是否禁用
        dialogFormVisible:false,
        dialogFormVisibleEqu:false,  //显示设备列表
        
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
        imgurl:"",


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
