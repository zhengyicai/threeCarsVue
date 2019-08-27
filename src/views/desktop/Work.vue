<template>

<el-row :gutter="24" style="margin-top:20px">
  
  <el-col :span="24">
      <div class="grid-content bg-purple">
         
          <el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;">
		
			
			<el-table-column prop="userName" label="工程商名称" width="150" sortable>
			</el-table-column>
			<el-table-column prop="loginName" label="登录名" width="150" sortable>
			</el-table-column>
            <el-table-column prop="connect" label="联系人" width="250" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="手机号" width="250" sortable>
			</el-table-column>
            <el-table-column prop="address" label="联系地址" width="250" sortable>
			</el-table-column>
            <el-table-column prop="code" label="厂商编号" width="150" sortable>
			</el-table-column>
			<el-table-column  label="创建时间" min-width="150">
				<template slot-scope="scope">{{ scope.row.createTime | moment('YYYY-MM-DD') }}</template>
			</el-table-column>
			
         
			<el-table-column  label="状态" min-width="120">
				<template slot-scope="scope">{{ state(scope.row.state)}}</template>
			</el-table-column>

            <el-table-column prop="remark" label="备注" width="150" sortable>
			</el-table-column>
			
			
			<el-table-column label="操作" min-width="150">
				<template scope="scope">
				 <el-button size="small" type="primary"  @click="edit(scope.$index,scope.row)">编辑</el-button>
			     <!-- <el-button size="small" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button> -->
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
                      <el-input v-bind:disabled="isEdit" v-model="subData.userName"  placeholder="请输入用户名"></el-input>
                    </el-form-item>    
                    <el-form-item label="*登录名">
                        <el-input v-model="subData.loginName"  placeholder="请输入登录名"></el-input>
                    </el-form-item>
                    <el-form-item label="*密码">
                      <el-input v-bind:disabled="isEdit" v-model="subData.password"  placeholder="请输入密码"></el-input>
                    </el-form-item>
                     <!-- <el-form-item label="*代理商编号">
                      <el-input type="number" v-bind:disabled="isEdit" v-model="subData.code"  placeholder="请输入代理商编号"></el-input>
                    </el-form-item> -->
                     <el-form-item label="手机号">
                        <el-input v-model="subData.mobile"  placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="状态">
                        <el-radio-group v-model="subData.roleId">
                            <el-radio :label="item.id" :key="item.id" v-for="item in roles">{{item.roleName}}</el-radio>
                        </el-radio-group>
                    </el-form-item> -->
                    <el-form-item label="备注">
                        <el-input v-model="subData.remark"  placeholder="请输入备注"></el-input>
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
            state: '10',
            code:'',
            remark:''
        };

    },
     edit(index, rows){
            this.isEdit = true;
            this.dialogFormVisible = true;
		    this.formtitle ="修改账户";   
            this.subData = rows;
            this.subData.password = "******";
        //alert("asdf");


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
    open(){
       
        if(this.formtitle == '新增账户'){
              
              if(this.communityId ==''){
                  this.$message({
                    message: "请选择代理商",
                    type: 'error'
                  });
              }
              this.subData.parentId =this.communityId;  //admin
              this.subData.roleId='8fd0882be71e11e8987f5254003ad144';
              this.subData.roleName='工程商管理员';
              this.subData.code=sessionStorage.getItem("code");
            
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
        
       
        RequestGet("/user/findAllWorkChild",{ parentId:this.communityId}).then(response => {
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
        form:{},
        subData:{},
        isEdit:true, //是否禁用
        dialogFormVisible:false,
        roles:[],
        formtitle:"",
        datalist:[],
       
       
      };
    }
  }
</script>