<template> 
 <div class="block">   
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
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" style="text-align:right" >
				
			
				
				<el-form-item  style="text-align:right">
					<el-button type="primary" @click="export1()">导出数据</el-button>
				</el-form-item>
		
			</el-form>
		</el-col>
        
		<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%; margin-top:20px">
		
			
			<el-table-column prop="time1" label="日期" width="150" sortable>
			</el-table-column>
			<!-- <el-table-column prop="goods1" label="杂纸" width="250" sortable>
			</el-table-column>
				<el-table-column prop="goods2" label="纯花纸（如啤酒箱等）" width="250" sortable>
			</el-table-column>
				<el-table-column prop="goods3" label="价格" width="250" sortable>
			</el-table-column>
    	<el-table-column prop="goods4" label="纯黄纸（如快递箱等）" width="250" sortable>
			</el-table-column> -->


      <el-table-column :prop="a.remark" :label="a.name" :value="a" :key="a"  v-for=" a in options1" width="250" sortable>
			</el-table-column>


     
            
			
			
			<!-- <el-table-column label="操作" min-width="250"> -->
				<!-- <template scope="scope">
				 <el-button size="small" type="primary"  @click="edit(scope.$index,scope.row)">编辑</el-button>
				
                <el-button size="small" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
                 <el-button size="small" type="primary" @click="showRelationPanel(scope.$index,scope.row)">详情</el-button>
				</template> -->
			<!-- </el-table-column> -->
		<!-- </el-table> -->
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
                    <el-form-item label="*商品名">
                      <el-input v-model="subData.name"  placeholder="请输入商品名"></el-input>
                    </el-form-item>    
                    <el-form-item label="*价格">
                        <el-input v-model="subData.price"  placeholder="请输入价格"></el-input>
                    </el-form-item>
                    

                   
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

         <el-dialog   title="修改记录" :visible.sync="dialogFormVisible1" width="85%" >
             
			 <el-table  style="width: 100%" :data="addressList">
                        <el-table-column
                            prop="name"
                            label="商品名称"
                            width="160">
                        </el-table-column>
                        <el-table-column
                            prop="price"
                            label="商品价格"
                            width="160">
                        </el-table-column>
                       	<el-table-column  label="修改时间" min-width="180">
                          <template slot-scope="scope">{{ scope.row.createTime | moment('YYYY-MM-DD  HH:mm:ss') }}</template>
                        </el-table-column>
                        
                       
                        </el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible1 = false">取 消</el-button>
				<el-button  type="primary" @click="open1()">确 定</el-button>
			</div>
        </el-dialog>

		 

  </div>
</template>
<script>
	//2
	import { RequestPost, fileUrls } from '../../api/api';
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
		 * 1.get 请求传商品，必须是json前面加一个params
		 * 2.post传商品不需要在json对象传值前面带params
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
           this.dialogFormVisible = true;
		   this.formtitle ="新增商品";   
		   this.subData = {}; 
           this.communityId = ''; 
           this.buildingId = '';
           this.unitNo = '';
            //this.loadCommunitys();
            this.isEdit = true;
            this.subData = {
                name: '',
                price: '',
                state: '10'
            };


      },
    
       edit(index, rows){
            this.dialogFormVisible = true;
		         this.formtitle ="修改商品";   
             this.subData = rows;
        //alert("asdf");


      },
       showRelationPanel(index, rows){

               this.dialogFormVisible1= true;
            
                this.residentId = rows.id;
               
                this.loadRooms();
      }, /**
        * 加载住户房间信息
        */
      

      loadRooms(){
          
         RequestGet("/goods/detailFindAll",{id:this.residentId}).then(response => {
            if(response.code == '0000'){
                    
                    
                        this.dialogFormVisible1 = true;    
                        this.addressList = response.data;
                    
            }
					
        }).catch(error => {
                        this.$router.push({ path: '/login' });
                        
        })
      },
      open1(){
           this.dialogFormVisible1 = false;    
      },

      export1(){
            //excel数据导出
            require.ensure([], () => {
            const {
                export_json_to_excel
            } = require('../../assets/js/Export2Excel');



          
            const tHeader = this.tHeader1;
            const filterVal = this.filterVal1;
          //  alert(tHeader);
          //  alert(filterVal);

           
           
            
           

            




            RequestGet("/order/orderDetailSumMouthFindAll").then(response => {
						if(response.code == '0000'){
                                
                                const list = response.data;

                                // for(var i =0 ;i<list.length;i++){
                                //     list[i].weight = isWeight(list[i].weight);
                                //     list[i].type = isOrderState(list[i].type);
                                //    list[i].createTime = moment(list[i].createTime).format("YYYY-MM-DD HH:mm:ss");
                                //    list[i].doorTime = moment(list[i].doorTime).format("YYYY-MM-DD HH:mm:ss");
                                //     //list[i].createTime = this.formatDate1(list[i].createTime);
                                //     //list[i].doorTime = this.formatDate1(list[i].doorTime);
                                   
                                // }

                                const data = this.formatJson(filterVal, list);

                              //  alert(data);
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

      open(){
         if(this.validate1() == false){
					  return;
				  }


          if(this.formtitle == '新增商品'){
              RequestPost("/goods/add",this.subData).then(response => {
						//this.logining = false; 
						if(response.code=='0000'){
							this.$message({
								message: response.message,
								type: 'success'
							});  
							this.dialogFormVisible1 = false;
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
              RequestPost("/goods/update",this.subData).then(response => {
						
						//this.logining = false; 
						if(response.code=='0000'){
							this.$message({
								message: response.message,
								type: 'success'
							});  
							this.dialogFormVisible1 = false;
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

            RequestPost("/goods/delete",rows).then(response => {
						
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

      validate1(){  //新增（修改）项目
	
	
          
            if(this.subData.name.trim().length ==0 || this.subData.name == null){
                this.$message({
                  type: 'error',
                  message: "请输入商品名"
                });
                return false;
            }
            if(this.subData.price.trim().length ==0 || this.subData.price == null){
                this.$message({
                  type: 'error',
                  message: "请输入价格"
                });
                return false;
            }
         
      },
     

	
	loadData(){

		RequestGet("/order/orderDetailSumFindAll",this.page).then(response => {
						if(response.code == '0000'){
								 this.datalist = response.data;
								 this.total = response.page.totalCount; 
								 this.totalsize  = response.page.pageSize;
						 }
					
		}).catch(error => {
						 this.$router.push({ path: '/login' });
						
    })  
    
    RequestGet("/goods/goodsList").then(response => {
						if(response.code == '0000'){
                 this.options1 = response.data;
                 this.tHeader1 = [];
                 this.filterVal1 = [];

                  this.tHeader1.push("日期");
                 this.filterVal1.push("time1");
                  for(var i = 0;i<response.data.length;i++){
                      //this.tHeader1[i] = response.data[i].name;
                      this.tHeader1.push(response.data[i].name);
                      this.filterVal1.push(response.data[i].remark);

                  }
                  //alert(this.tHeader1);


						 }
					
		}).catch(error => {
						 this.$router.push({ path: '/login' });
						
		})  
        
						
	
	},

  
    
    /**
    * 选择设备类型
    */
    selectEquType(){
        if(this.subData.equipmentType === '30'){
            this.isEdit = false;
        }else{
            this.isEdit = true;
        }
    },

    // /**
    // * 选择小区
    // */
    selectCommunity(selectIdx){
        
        this.communityId = selectIdx;
        this.subData.communityId = selectIdx;
        this.buildingId = '';
        this.subData.buildingId = "";
        this.buildings = [];
        this.unitNo = '';
        this.loadBuildings();
    },

    // /**
    // * 选择楼栋
    // */
    selectBuild(selectIdx){
        //this.buildingId = this.buildings[selectIdx].value;
        this.buildingId = selectIdx;
        this.subData.buildingId = this.buildingId;
        this.subData.unitName = '';
        this.units = [];
        this.unitNo = '';
        this.loadUnits();
    },

    // /**
    // * 选择单元
    // */
    selectUnit(selectIdx){
        this.unitNo = selectIdx;
        this.subData.unitName = this.unitNo;
    },

    /**
    * 加载小区
    */
    loadCommunitys(){

        RequestGet("/equipment/findCommunitys").then(response => {
          
						if(response.code == '0000'){
								this.communitys = response.data;
                                
                                
						 }
					
        }).catch(error => {
                this.$router.push({ path: '/login' });
						
		})  
      
    },

    /**
    * 加载楼栋
    */
    loadBuildings(){

        RequestGet("/equipment/findBuildings",{
                communityId:this.communityId
            }).then(response => {
          
						if(response.code == '0000'){
								 this.buildings = response.data;
                                 if(this.buildings.length>0){
                                     this.subData.buildingId = this.buildings[0].value;
                                 }
                                 
                                // for(let obj in this.buildings){
                                //     this.selectBuild(0);
                                //     break;
                                // }
						 }
					
        }).catch(error => {
                this.$router.push({ path: '/login' });
						
		})  
       
    },

    // /**
    // * 加载单元
    // */
    loadUnits(){

         RequestGet("/equipment/findUnits",{
                buildingId:this.buildingId
            }).then(response => {
          
						if(response.code == '0000'){
								  this.units = response.data;
                                   if(this.units.length>0){
                                     this.subData.unitName = this.units[0].value;
                                 }
                                // for(let obj in this.buildings){
                                //     this.selectBuild(0);
                                //     break;
                                // }
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
    datalist:[],
    tHeader1:[],
    filterVal1:[],
    listLoading: false,
    dialogFormVisible1:false,
		form:{},
        subData:{},
        isEdit:true, //是否禁用
        dialogFormVisible:false,
        communitys:[],
        buildings:[],
        units:[],
        addressList:[],
        communityId:"",
        buildingId:"",
        unitNo:"",
        formtitle:"",
        options: [{
          value: '10',
          label: '管理机'
        }, {
          value: '20',
          label: '围墙机'
        }, {
          value: '30',
          label: '单元门口机'
        }],
        options1: [{name:'',remark:''}],

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
