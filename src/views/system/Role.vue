<template>
    <div class="block" >
        
        <el-row :gutter="12" >
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" style="text-align:right" >
                   
                    
                    <el-form-item>
                        <el-button type="primary" @click="saveRole()">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="6">
                <el-card header="角色">
                      <el-radio-group v-model="roleId"  @change="selectItem()">
                            <el-radio :label="item.id"  :key="item.id" v-for="item in roles" style="width:300px;margin-left:0px;margin-bottom:20px">{{item.roleName}}</el-radio><br/>
                       </el-radio-group>
                </el-card>
            </el-col>
            <el-col :span="18" style="font-size:14px;">
                <el-card header="功能">
                        <table :label="m.id" :key="m.id"  v-for=" m in parentMenuData">
                        <tr style="height:40px">
                            <th style="text-align:left">
                                <label  >
                                    <input type="checkbox" v-model="m.selected" @click="isSelected(m.id,m.selected)" :value="m.id"/>{{m.resName}}
                                </label>
                            </th>
                        </tr>
                        <tr style="height:40px">
                            <td>
                                <label :label="node.id" :key="node.id" v-for=" node of getChilderMenu(m.id)">
                                    <input type="checkbox" v-model="node.selected" @click="checkNode(m)" :value="node.id"/>{{node.resName}}
                                </label>
                            </td>
                        </tr>
                    </table>
                </el-card>
            </el-col>
            
        </el-row>
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
           alert("asdf");

      },
    
       edit(index, rows){
            this.isEdit = true;
            this.dialogFormVisible = true;
		    this.formtitle ="修改账户";   
            this.subData = rows;
            this.subData.password = "******";
        //alert("asdf");


      },
      /**
        * 加载角色
        */
    loadRoles(){
            RequestGet("/user/findRoles").then(response => {
                    if(response.code == '0000'){
                            this.roles = response.data;
                            
                        for(let obj in this.roles){
                            this.roleId = this.roles[obj].id;
                            console.log(this.roleId);
                            this.loadMenus();
                            break;
                        }
                    }else{
                        this.$message({
                            message: response.message,
                            type: 'error'
                        });
                    }
                
            }).catch(error => {
                            this.$router.push({ path: '/login' });
                            
            })  
    
    },
         /**
    * 加载菜单
    */
    loadMenus(){
         RequestGet("/role/findMenus",{roleId:this.roleId}).then(response => {
                        if(response.code == '0000'){
                                this.menuDatas = response.data;
                                this.parentMenuData = this.getParentMenu();
                        }else{
                            this.$message({
                                message: response.message,
                                type: 'error'
                            });
                        }
                    
                }).catch(error => {
                                this.$router.push({ path: '/login' });
                                
                })  
     
    },
    /**
    * 获取父菜单集合
    */
    getParentMenu(){
        return this.getChilderMenu(this.getRootId());
    },
    /**
    * 根据父id查找子菜单
    */
    getChilderMenu(pid){
        let lis = [];
        for(var o in this.menuDatas){
            if(this.menuDatas[o].parentId===pid){
                lis.push(this.menuDatas[o]);
            }
        }
        return lis;
    },
    /**
    * 获取根菜单编号
    */
    getRootId(){
        for(var o in this.menuDatas){
            if(this.menuDatas[o].parentId==='0'){
                return this.menuDatas[o].id;
            }
        }
        return null;
    },
    isSelected(id,selected){
        for(var o in this.menuDatas){
            if(this.menuDatas[o].parentId===id){
                this.menuDatas[o].selected = !selected;
            }
        }
    },
    /**
    * 点击子功能，让父功能选中
    */
    checkNode(pmenu){
        pmenu.selected = true;
    },

    /**
    * 选中角色
    */
    selectItem(){
        this.loadMenus();
    },


    open(){
          if(this.formtitle == '新增账户'){
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
	 /**
    * 保存角色权限
    */
    saveRole(){
        let subData={
            roleId:this.roleId+'',
            lis:[{
                resourceId:this.getRootId()
            }]
        };
        for(let o in this.menuDatas){
            if(this.menuDatas[o].selected && this.menuDatas[o].parentId!='0'){
                subData.lis.push({resourceId:this.menuDatas[o].id});
            }
        }

        RequestPost("/role/saveRolePerm",subData).then(response => {
						
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
						this.loadMenus();
        }).catch(error => {
        this.$router.push({ path: '/login' });
        })
        
    },
	loadData(){

		// RequestGet("/user/findAll",this.page).then(response => {
		// 				if(response.code == '0000'){
		// 						 this.datalist = response.data;
		// 						 this.total = response.page.totalCount; 
		// 						 this.totalsize  = response.page.pageSize;
		// 				 }
					
		// }).catch(error => {
		// 				 this.$router.push({ path: '/login' });
						
		// })  
        
						
	
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
			pageSize:PageSize,   //一页显示的条数
            criteria:''
		},
		datalist:[],
		
		listLoading: false,
		form:{},
        subData:{},
        isEdit:true, //是否禁用
        dialogFormVisible:false,
        roles:[],
        formtitle:"",
        roles:[],
        menuDatas:[],
        parentMenuData:[],
        roleId:'',
      };
    }
  }
</script>
<style lang="scss" scoped>
    .page-container {
        font-size: 24px;
        text-align: center;
        color: rgb(192, 204, 218);
    }
</style>