<template> 
 <div class="block">   
	 	<el-col :span="20" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item style="width:300px">
					<el-input v-model="page.criteria" @keyup.enter.native="query"   placeholder="请输入[姓名|手机号]" style="width:300px"></el-input>
				</el-form-item>
				<el-form-item  >
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
               
				
			</el-form>
		</el-col>
        <el-col :span="4" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				
				<el-form-item  style="text-align:right">
					<el-button type="primary" @click="export1()">导出数据</el-button>
				</el-form-item>
			</el-form>
		</el-col>
      
        
		<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;">
            
            <el-table-column prop="city" label="城市" width="100" sortable>
			</el-table-column>
            <el-table-column prop="country" label="区县" width="100" sortable>
			</el-table-column>
            <el-table-column prop="town" label="城镇" width="100" sortable>
			</el-table-column>
            <el-table-column prop="detail" label="详细地址" width="170" sortable>
			</el-table-column>
			
			<el-table-column prop="contactName" label="用户名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="contactMobile" label="手机号" width="130" sortable>
			</el-table-column>
            <el-table-column  label="重量" min-width="100">
				<template slot-scope="scope">{{ isWeight(scope.row.weight)}}</template>
			</el-table-column>
            <el-table-column  label="预约上门时间" min-width="170">
				<template slot-scope="scope">{{ scope.row.doorTime | moment('YYYY-MM-DD HH:mm:ss') }}</template>
			</el-table-column>
			<el-table-column  label="创建时间" min-width="170">
				<template slot-scope="scope">{{ scope.row.createTime | moment('YYYY-MM-DD HH:mm:ss') }}</template>
			</el-table-column>

            <!-- <el-table-column prop="wxId" label="微信" width="330" sortable>
			</el-table-column> -->
            <!-- <el-table-column prop="imgUrl" label="图片地址" width="170" sortable>
			</el-table-column>
            <el-table-column prop="fingerUrl" label="指纹地址" width="170" sortable>
			</el-table-column>
            <el-table-column prop="identityId" label="身份证id" width="170" sortable>
			</el-table-column>
            <el-table-column prop="identityNo" label="身份证编号" width="170" sortable>
			</el-table-column> -->
			
			<el-table-column  label="状态" min-width="120">
				<template slot-scope="scope">{{ isOrderState(scope.row.type)}}</template>
			</el-table-column>
            <el-table-column prop="buyprice" label="用户成交总价" width="150" sortable>
			</el-table-column>
            <el-table-column prop="sellprice" label="回收总价" width="120" sortable>
			</el-table-column>
			
			
			<el-table-column label="操作" min-width="150">
				<template scope="scope">
				<!-- <el-button size="small" type="primary"  @click="edit(scope.$index,scope.row)">编辑</el-button>
				<el-button size="small" type="primary"  v-if='scope.row.sysUserId=="" ||  scope.row.sysUserId ==null' @click="addAdmin(scope.$index,scope.row)">新增物业</el-button>
				<el-button size="small" type="warning"  v-if='scope.row.sysUserId!="" ||  scope.row.sysUserId !=null' @click="editAdmin(scope.$index,scope.row)">修改物业</el-button>
                <el-button size="small" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button> -->
                <!-- <el-button size="small" type="primary"  @click="edit(scope.$index,scope.row)">授权设备</el-button>
                <el-button size="small" type="primary"   @click="updateRoom(scope.row)">房卡管理</el-button> -->
                <el-button size="small" type="primary"   @click="updateRoom(scope.row)">结算</el-button>
                <el-button size="small" type="primary" @click="showRelationPanel(scope.$index,scope.row)">详情</el-button>
                <!-- <el-button size="small" type="danger" @click="deleteRow(scope.$index,scope.row)">删除</el-button> -->

             
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

        <el-dialog   title="结算金额" :visible.sync="dialogPrice" >
			<el-form ref="subData"  label-width="100px" @submit.prevent="onSubmit" style="margin:0px;">
                <el-form-item label="结算金额">
                        <el-input style="width:60%"  v-model="sellPrice" type="number" placeholder="请输入结算金额"></el-input>
                </el-form-item>
                
			</el-form>	
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogPrice = false">取 消</el-button>
				<el-button  type="primary" @click="open3()">确 定</el-button>
			</div>

			
        </el-dialog>


        <el-dialog   title="修改最终重量" :visible.sync="dialogPrice2" >
			<el-form ref="subData"  label-width="100px" @submit.prevent="onSubmit" style="margin:0px;">
                <el-form-item label="最终重量">
                        <el-input style="width:60%"  v-model="sellPrice2" type="number" placeholder="请输入最终重量"></el-input>
                </el-form-item>
                
			</el-form>	
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogPrice2 = false">取 消</el-button>
				<el-button  type="primary" @click="open4()">确 定</el-button>
			</div>

			
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



         <el-dialog   title="订单详情" :visible.sync="dialogFormVisible" width="90%" >
             <span style="font-size:20px; ">车夫：{{carName}}</span><br/><br/><br/>
			 <el-table  style="width: 100%" :data="addressList">
                        <el-table-column
                            prop="goodsName"
                            label="商品名称"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="buyWeight"
                            label="商品重量"
                            width="130">
                        </el-table-column>
                        <el-table-column
                            prop="buyPrice"
                            label="用户成交价"
                            width="120">
                        </el-table-column>
                        
                        <el-table-column
                            label="用户总额"
                            width="120">
                            <template slot-scope="scope">{{ scope.row.buyWeight * scope.row.buyPrice }}</template>
                        </el-table-column>
                       
                        <el-table-column
                            prop="sellWeight"
                            label="最终确认重量"
                            width="120">
                        </el-table-column>
                        <!-- <el-table-column
                            prop="sellPrice"
                            label="回收价"
                            width="120">
                        </el-table-column>
                        <el-table-column
                           
                            label="回收总额"
                            width="125">
                            <template slot-scope="scope">{{ scope.row.sellWeight * scope.row.sellPrice }}</template>
                        </el-table-column> -->
                        <el-table-column label="操作" min-width="120">
                                <template scope="scope">
                                <!-- <el-button size="small" type="primary"  @click="edit(scope.$index,scope.row)">编辑</el-button>
                                <el-button size="small" type="primary"  v-if='scope.row.sysUserId=="" ||  scope.row.sysUserId ==null' @click="addAdmin(scope.$index,scope.row)">新增物业</el-button>
                                <el-button size="small" type="warning"  v-if='scope.row.sysUserId!="" ||  scope.row.sysUserId !=null' @click="editAdmin(scope.$index,scope.row)">修改物业</el-button>
                                <el-button size="small" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button> -->
                                <!-- <el-button size="small" type="primary"  @click="edit(scope.$index,scope.row)">授权设备</el-button>
                                <el-button size="small" type="primary"   @click="updateRoom(scope.row)">房卡管理</el-button> -->
                                <el-button size="small" type="warning"   @click="updateRoom2(scope.row)">修改最终重量</el-button>
                                <!-- <el-button size="small" type="primary" @click="showRelationPanel(scope.$index,scope.row)">详情</el-button> -->
                                <!-- <el-button size="small" type="danger" @click="deleteRow(scope.$index,scope.row)">删除</el-button> -->

                            
                                </template>
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
    import {isWeight} from '../../api/format';
    import {isOrderState} from '../../api/format';

    
	import { PageSize } from '../../api/api';
	import moment from 'moment';
  	export default {
	  
    methods: {
	  dateFormat,	
	  timeFormat,
      state,	
      isTrue,
      isWeight,
      isOrderState,
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

     formatDate1(now) { 
        var year=now.getFullYear(); 
        var month=now.getMonth()+1; 
        var date=now.getDate(); 
        var hour=now.getHours(); 
        var minute=now.getMinutes(); 
        var second=now.getSeconds(); 
        return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
    }, 
      export1(){
            //excel数据导出
            require.ensure([], () => {
            const {
                export_json_to_excel
            } = require('../../assets/js/Export2Excel');
            const tHeader = ['城市','区县', '城镇', '详细地址', '用户名','手机号', '重量', '预约上门时间','创建时间','状态','用户成交总价','回收总价'];
            const filterVal = ['city','country', 'town', 'detail', 'contactName','contactMobile', 'weight', 'doorTime', 'createTime','type','buyprice','sellprice'];



            RequestGet("/order/findAllDownLoad",this.page).then(response => {
						if(response.code == '0000'){
                                
                                const list = response.data;

                                for(var i =0 ;i<list.length;i++){
                                    list[i].weight = isWeight(list[i].weight);
                                    list[i].type = isOrderState(list[i].type);
                                   list[i].createTime = moment(list[i].createTime).format("YYYY-MM-DD HH:mm:ss");
                                   list[i].doorTime = moment(list[i].doorTime).format("YYYY-MM-DD HH:mm:ss");
                                    //list[i].createTime = this.formatDate1(list[i].createTime);
                                    //list[i].doorTime = this.formatDate1(list[i].doorTime);
                                   
                                }

                                const data = this.formatJson(filterVal, list);
                                export_json_to_excel(tHeader, data, '列表excel');
                            }
                        
            }).catch(error => {
                            this.$router.push({ path: '/login' });
                            
            })  


            
        })


      },
       formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
       },
      deleteItem(){

      },
      showRelationPanel(index, rows){

               this.dialogFormVisible= true;
               this.carName = rows.carName+"("+rows.carMobile+")";
        
                this.residentId = rows.id;
               
                this.loadRooms();
      },
      /**
        * 加载住户房间信息
        */
      

      loadRooms(){
          
         RequestGet("/order/findDetail",{orderId:this.residentId}).then(response => {
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
         
         this.dialogPrice = true;
         this.orderId = rows.id;
         this.sellPrice = rows.sellprice;


    },  
    updateRoom2(rows){
        this.dialogPrice2 = true;
        this.orderDetailId = rows.id;
        // alert(rows.id);
        this.sellPrice2 = rows.sellWeight;

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
      open3(){
          
            var person = {
                id:this.orderId,
                sellprice:this.sellPrice,
                type:"50"
            }

           RequestPost("/order/updatesell",person).then(response => {
						
						//this.logining = false; 
            if(response.code=='0000'){
                this.$message({
                    message: response.message,
                    type: 'success'
                });  
                this.dialogPrice = false;
            }else{
                this.$message({
                    message: response.message,
                    type: 'error'
                });
                this.dialogPrice = false;
            }
            this.loadData();
        }).catch(error => {
        this.$router.push({ path: '/login' });
        })
          




      },
      open4(){
          
            var person = {
                id:this.orderDetailId,
                sellWeight:this.sellPrice2
            }

           RequestPost("/order/updateFinishPrice",person).then(response => {
						
						//this.logining = false; 
            if(response.code=='0000'){
                this.$message({
                    message: response.message,
                    type: 'success'
                });  
                this.dialogPrice2 = false;
                this.loadRooms();
            }else{
                this.$message({
                    message: response.message,
                    type: 'error'
                });
                this.dialogPrice2 = false;
            }
            //this.loadData();
        }).catch(error => {
        this.$router.push({ path: '/login' });
        })
          




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

		RequestGet("/order/findAll",this.page).then(response => {
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
            criteria:''
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
        dialogPrice:false, //显示结算界面
        sellPrice:0,
        dialogPrice2:false, //显示最终重量界面
        sellPrice2:0,
        orderId:"",
        orderDetailId:"",
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
        carName:"",
       
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
