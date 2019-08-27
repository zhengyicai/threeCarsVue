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
        <!-- <el-col :span="4" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				
				<el-form-item  style="text-align:right">
					<el-button type="primary" @click="add()">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col> -->
      
        
		<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;">
		
			
			<el-table-column prop="name" label="用户名" width="150" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="手机号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="communityName" label="所属小区" width="150" sortable>
			</el-table-column>
            <el-table-column prop="buildingName" label="楼栋" width="150" sortable>
			</el-table-column>
            <el-table-column prop="unitName" label="单元" width="150" sortable>
			</el-table-column>
            <el-table-column prop="roomName" label="房间" width="150" sortable>
			</el-table-column>
            <el-table-column prop="isTrue" label="是否默认" width="150" sortable>
                <template slot-scope="scope">{{ scope.row.isTrue =='10'?'是':'否'}}</template>
			</el-table-column>

			<el-table-column  label="状态" min-width="120">
				<template slot-scope="scope">{{ scope.row.owner =='10'?'正常':'待授权'}}</template>
			</el-table-column>
            <el-table-column prop="remark" label="留言" width="170" sortable>
			</el-table-column>
			
			
			<el-table-column label="操作" min-width="250">
				<template scope="scope">
				 <el-button size="small" type="danger" @click="deleteRow(scope.$index,scope.row)">删除</el-button>
                 <el-button size="small" type="success" v-if="scope.row.owner==='20'" @click="updateState(scope.row,'10')" >授权</el-button>
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
                    owner:state
                }

                RequestPost("/resident/authUpdate",opt).then(response => {
                            
                          
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

            RequestPost("/resident/authDelete",rows).then(response => {
						
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

		RequestGet("/resident/authList",this.page).then(response => {
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
