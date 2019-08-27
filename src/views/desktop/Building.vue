<template>

<el-row :gutter="24" style="margin-top:20px">
  <el-col :span="4">
      <div class=" bg-purple">
            <el-tree
		  	:data="tree"
		  	:props="defaultProps"
		  	show-checkbox
		  	node-key="id"
		  	:check-strictly="true"
			:highlight-current="true"	
		  	default-expand-all
		  	:expand-on-click-node="false"
		  	:render-content="renderContent"
		  	ref="tree"
		  	@check-change="checkChange"
		  	@node-click="nodeClick"
		  	>
              </el-tree>

      </div>
  </el-col>
  <el-col :span="20">
      <div class="grid-content bg-purple">
          <el-col :span="24"  style="padding-bottom: 0px;">
			<el-form :inline="true" style="text-align:right">
				
				<el-form-item  >
					<el-button type="primary" v-on:click="showAddPanel">新增</el-button>
				</el-form-item>
               
				
			</el-form>
		</el-col>
          <el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;">
		
			
			<el-table-column prop="buildingNo" label="楼栋编号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="buildingName" label="楼栋名称" width="150" sortable>
			</el-table-column>
			<el-table-column prop="unitName" label="单元名称" width="150" sortable>
			</el-table-column>
            <el-table-column prop="floorNumber" label="层数" width="150" sortable>
			</el-table-column>
            <el-table-column prop="roomNumber" label="层户数" width="150" sortable>
			</el-table-column>
			
			<el-table-column  label="状态" min-width="120">
				<template slot-scope="scope">{{ state(scope.row.state)}}</template>
			</el-table-column>
            
			
			<el-table-column label="操作" min-width="250">
				<template scope="scope">
				
                <!-- <el-button size="small" type="primary" @click="showRelationPanel(scope.$index,scope.row)">住房信息</el-button>
                <el-button size="small" type="danger" @click="deleteRow(scope.$index,scope.row)">删除</el-button> -->
                <el-button size="small" type="warning" v-if="scope.row.state==='10'"   @click="updateState(scope.row,'20')" >禁用</el-button>
                <el-button size="small" type="success" v-if="scope.row.state==='20'" @click="updateState(scope.row,'10')" >启用</el-button>
                <!--<el-button size="small" type="info" v-if="scope.row.state==='30'"  @click="updateState(scope.row,'10')">授权</el-button> -->
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

        <el-dialog   title="新增" :visible.sync="dialogFormVisible" >
			<el-form ref="subData" :model="subData" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;">
                    
                    <el-form-item label="楼栋名称">
                        <el-input type="number"  v-model="subData.buildingNo"  placeholder="请输入楼栋名称 例如：1"></el-input>
                    </el-form-item>
                    <el-form-item label="单元名称">
                        <el-input type="number" v-model="subData.unitName"  placeholder="请输入单元名称 例如：1"></el-input>
                    </el-form-item>
                     <el-form-item label="楼层数">
                        <el-input type="number" v-model="subData.floorNumber"  placeholder="请输入楼层数, 1-50"></el-input>
                    </el-form-item>
                     <el-form-item label="层户数">
                        <el-input type="number" v-model="subData.roomNumber"  placeholder="请输入层户数, 1-10"></el-input>
                    </el-form-item>
                   
			</el-form>	
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="open()">确 定</el-button>
			</div>
        </el-dialog>
      
      
      
      
      
      </div>
    </el-col>
</el-row>

</template>

<style lang="scss" scoped>
    .page-container {
        font-size: 24px;
        text-align: center;
        color: rgb(192, 204, 218);
    }
    .el-tree {
        cursor: default;
        background: #fff;
         border:none;
    }
</style>
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
      
    
	
	loadData(){

	
        this.loadTreeData();
        
						
	
    },


    showAddPanel(){
           this.dialogFormVisible  = true;
           this.subData ={
            "communityId":this.communityId,
            "unitNumber":1,
            "floorNumber":1,
            "roomNumber":1,
            "buildingNo":"",   
            "unitName":""
        }


    },
    open(){
        if(this.valuidate2() == false){
            return;
        }
        RequestPost("/building/createRoom",this.subData).then(response => {
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
                    //this.loadData();
                    this.communityId = this.subData.communityId;
                    this.loadCommunityData();
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
                    id:rows.id,
                    state:state
                }

                RequestPost("/building/updateState",opt).then(response => {
                            
                          
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
                    //this.communityId = this.subData.communityId;
                    this.loadCommunityData();
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
    
    /**
    * 加载楼栋数据
    */
    loadCommunityData(){
        
            
        RequestGet("/building/findBuilding",{ communityId:this.communityId}).then(response => {
                    if(response.code == '0000'){
                                this.datalist = response.data;
                                this.total = response.page.totalCount; 
                                this.totalsize  = response.page.pageSize;
                    }
					
		}).catch(error => {
						 this.$router.push({ path: '/login' });
						
        })  


    },

    handleNodeClick(data) {
        this.communityId = data.id;
        if(this.communityId!=""){
             this.loadCommunityData();
        }
       
    },
     checkChange(item, node, self){
        if (node==true) {//点击未选中复选框
            this.editCheckId = item.id;
            this.$refs.tree.setCheckedKeys([item.id]);
             this.communityId = item.id;
         if(this.communityId!=""){
             this.loadCommunityData();
        }
        } else {
            if (this.editCheckId == item.id) {//点击已选中复选框，保证至少一个选中
                this.$refs.tree.setCheckedKeys([item.id]);
            }
        }
      
    },	
    nodeClick(item, node, self){
        this.editCheckId = item.id;
        this.$refs.tree.setCheckedKeys([item.id]);
         this.communityId = item.id;
       
        if(this.communityId!=""){
             this.loadCommunityData();
        }
    },	
     /**
    * 加载小区树型数据
    */
    loadTreeData(){
        RequestGet("/building/findTree").then(response => {
            if(response.code == '0000'){
                //alert( response.data);
                
                var item = [];

                if(response.data.length>0){
                     for(var i= 0 ;i<response.data.length;i++){
                            var person ={
                                    label: response.data[i].value,
                                    id: response.data[i].id
                            };

                            if(i==0){
                                this.$refs.tree.setCheckedKeys([this.communityId]);//预先选中id为1的节点;
                                 this.loadCommunityData();
                            }
                           
                           item.push(person);

                    }
                }
               

                this.tree = [{
                    label: '小区管理',
                    children: item,
                    id:''
                }];
                   //this.tree[0].children = response.data; 
                    //tree = response.data;
            }
					
		}).catch(error => {
			 this.$router.push({ path: '/login' });
						
		})  
        
    },


    loadTreeLoadData(){
        RequestGet("/building/findTree").then(response => {
            if(response.code == '0000'){
                //alert( response.data);
                
                var item = [];

                if(response.data.length>0){
                     for(var i= 0 ;i<response.data.length;i++){
                            var person ={
                                    label: response.data[i].value,
                                    id: response.data[i].id
                            };

                            if(i==0){
                                this.communityId = response.data[i].id;
                                 this.$refs.tree.setCheckedKeys([this.communityId]);//预先选中id为1的节点;
                                 this.loadCommunityData();

                            }
                           
                           item.push(person);

                    }
                }
               

                this.tree = [{
                    label: '小区管理',
                    children: item,
                    id:''
                }];
                   //this.tree[0].children = response.data; 
                    //tree = response.data;
            }
					
		}).catch(error => {
			 this.$router.push({ path: '/login' });
						
		})  
        
    },
    valuidate2(){
		  if(this.subData.buildingNo =="" ||this.subData.buildingNo.trim() =="" || this.subData.buildingNo == null){
				this.$message({
					type: 'error',
					message: "楼栋名称不能为空"
				});          
				return false;
		  }
		  if(this.subData.unitName =="" ||this.subData.unitName.trim() =="" || this.subData.unitName == null){
				this.$message({
					type: 'error',
					message: "单元名称不能为空"
				});          
				return false;
		  }	

		  if(this.subData.floorNumber<1 || this.subData.floorNumber>50){
				this.$message({
					type: 'error',
					message: "楼层数的范围为1-50"
				});          
				return false;
		  }	

		   if(this.subData.roomNumber<1 || this.subData.roomNumber>10){
				this.$message({
					type: 'error',
					message: "层户数的范围为1-10"
				});          
				return false;
		  }	

	},	
    
  



	},
	//1
	created:function(){
		//3
		this.loadTreeLoadData();
		
	
	},
    data() {
      return {
		total:0,     //数据的总数量
		totalsize:0,  //总的页数 = 总数量/每页显示的条数
        currentPage:1,
        listLoading: false,
        communityId:'',
        dialogFormVisible:false,
        subData:{},
		page:{
			pageSize:PageSize,   //一页显示的条数
            criteria:''
        },
        tree: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
     

        datalist:[],
       
       
      };
    }
  }
</script>