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
		
			
			<el-table-column prop="title" label="推送标题" width="300" sortable>
			</el-table-column>
      <el-table-column prop="content" label="推送内容" width="300" sortable>
			</el-table-column>
      <el-table-column  label="推送类型" min-width="120">
				<template slot-scope="scope">{{ isNoticeState(scope.row.type)}}</template>
			</el-table-column>
  

       <el-table-column  label="所属项目" min-width="250">
				<template slot-scope="scope">{{  scope.row.communityId ==""?"--": scope.row.province+ scope.row.city+ scope.row.area+ scope.row.address}}</template>
			</el-table-column>

      
			
			<el-table-column  label="创建时间" min-width="120">
				<template slot-scope="scope">{{ scope.row.createTime | moment('YYYY-MM-DD') }}</template>
			</el-table-column>
			
            <el-table-column prop="remark" label="备注" width="180" sortable>
			</el-table-column>
			<el-table-column  label="状态" min-width="120">
				<template slot-scope="scope">{{ state(scope.row.state)}}</template>
			</el-table-column>
            
			
			
			<el-table-column label="操作" min-width="150">
				<template scope="scope">
				 
				<!--<el-button size="small" type="primary"  v-if='scope.row.sysUserId=="" ||  scope.row.sysUserId ==null' @click="addAdmin(scope.$index,scope.row)">新增物业</el-button>
				<el-button size="small" type="warning"  v-if='scope.row.sysUserId!="" ||  scope.row.sysUserId !=null' @click="editAdmin(scope.$index,scope.row)">修改物业</el-button> -->
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
                    <el-form-item label="*标题">
                      <el-input v-model="subData.title"  placeholder="请输入标题"></el-input>
                    </el-form-item>    

                     <el-form-item label="*内容">
                      <el-input v-model="subData.content"  placeholder="请输入内容"></el-input>
                    </el-form-item>    
                     <el-form-item label="状态">
                        <el-radio-group v-model="subData.type">
                          <el-radio label="10">全量</el-radio>
                          <el-radio label="20">项目推送</el-radio>
                        </el-radio-group>
			        	</el-form-item>

                    <el-form-item label="选择项目" v-if="subData.type=='20'">
                      <el-select v-model="subData.communityId" placeholder="选择项目">
                        <el-option :label="item.province+item.city+item.area+ item.address" :key="item.id" :value="item.id" v-for="item in communitys">{{item.province+item.city+item.area+ item.address}}</el-option>
                      </el-select>
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
  import {isNoticeState} from '../../api/format';
  
	import { PageSize } from '../../api/api';
	import moment from 'moment';
  	export default {
	  
    methods: {
	  dateFormat,	
	  timeFormat,
    state,	
    isNoticeState,
      handleSizeChange(val) {
		console.log(`每页 ${val} 条`);
		

      },
      handleCurrentChange(val) {
		console.log(`当前页: ${val}`);
		this.pageNumber = val;

		
		this.page.pageNumber = val;
		/**
		 * 1.get 请求传推送，必须是json前面加一个params
		 * 2.post传推送不需要在json对象传值前面带params
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
        this.loadCommunity();
          this.dialogFormVisible = true;
          this.formtitle ="新增推送";   
          this.subData = {}; 
           this.communityId = ''; 
           this.buildingId = '';
           this.unitNo = '';
           
            this.isEdit = true;
            this.subData = {
                title: '',
                communityId: '',
                userId: sessionStorage.getItem("userId"),
                type: '10',
                state: '10'
            };


      },
    
       edit(index, rows){
            this.dialogFormVisible = true;
		    this.formtitle ="修改推送";   
             this.subData = rows;
        //alert("asdf");


      },
      open(){
          if(this.formtitle == '新增推送'){

           if(this.subData.title.trim().length ==0 || this.subData.title == null){
                this.$message({
                  type: 'error',
                  message: "请输入标题"
                });
                return false;
            }

            if(this.subData.content.trim().length ==0 || this.subData.content == null){
                this.$message({
                  type: 'error',
                  message: "请输入内容"
                });
                return false;
            }

              RequestPost("/sysPush/add",this.subData).then(response => {
						
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

            if(this.subData.title.trim().length ==0 || this.subData.title == null){
                this.$message({
                  type: 'error',
                  message: "请输入标题"
                });
                return false;
            }


            if(this.subData.content.trim().length ==0 || this.subData.content == null){
                this.$message({
                  type: 'error',
                  message: "请输入内容"
                });
                return false;
            }

              RequestPost("/sysPush/update",this.subData).then(response => {
						
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

            RequestPost("/sysPush/delete",rows).then(response => {
						
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

          RequestGet("/sysPush/findAll",this.page).then(response => {
                  if(response.code == '0000'){
                      this.datalist = response.data;
                      this.total = response.page.totalCount; 
                      this.totalsize  = response.page.pageSize;
                  }
                
          }).catch(error => {
                  this.$router.push({ path: '/login' });
                  
          })  
              
                  
        
        },
      
        loadCommunity(){

        RequestGet("/sysNotice/findAllCom").then(response => {
                if(response.code == '0000'){
                    this.communitys = response.data;
                    
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
		
		listLoading: false,
		form:{},
        subData:{},
        isEdit:true, //是否禁用
        dialogFormVisible:false,
        communitys:[],
        buildings:[],
        units:[],
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
