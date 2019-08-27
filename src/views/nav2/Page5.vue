<template> 
 <div class="block">   
		<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;">
		
			
			<el-table-column prop="communityNo" label="小区编号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="communityName" label="小区名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="province" label="省份" width="120" sortable>
			</el-table-column>
			<el-table-column prop="city" label="城市" width="120" sortable>
			</el-table-column>
			<el-table-column prop="area" label="区县" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="address" label="地址" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="state" label="状态" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="userName" label="物业员用户名" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="userStatus" label="物业员状态" min-width="120" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
				<el-button size="small" @click="edit(scope.$index,scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination
			@current-change="handleCurrentChange"
			:current-page="currentPage"
			:page-size="totalsize" 
			layout="total, prev, pager, next, jumper"
			:total="total" 
		>
		</el-pagination>

		 <el-dialog   title="详细信息" :visible.sync="dialogFormVisible" >
			<el-form ref="form" :model="form" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;">
				<el-form-item label="小区编号">
					<el-input v-model="form.communityNo"></el-input>
				</el-form-item>
				<el-form-item label="省" >
					<el-select v-model="form.province" placeholder="请选择省份" @change="selectProvince(form.province)">
						<el-option :label="item.name" :key="item.code" :value="item.code" v-for="item in provinces">{{item.name}}</el-option>
						
					</el-select>
				</el-form-item>
				<el-form-item label="市">
					<el-select v-model="form.city" placeholder="请选择市" @change="selectCity(form.city)">
						<el-option :label="item.name" :key="item.code" :value="item.code" v-for="item in citys">{{item.name}}</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="区">
					<el-select v-model="form.area" placeholder="请选择区" @change="selectArea(form.area)">
						<el-option :label="item.name" :key="item.code" :value="item.code" v-for="item in areas">{{item.name}}</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="地址">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
					<el-form-item label="状态">
					<el-radio-group v-model="form.state">
						<el-radio label="10">正常</el-radio>
						<el-radio label="20">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="物业员用户名">
					<el-input v-model="form.userName"></el-input>
				</el-form-item>
				<el-form-item label="物业员状态">
					<el-radio-group v-model="form.userStatus">
						<el-radio label="10">正常</el-radio>
						<el-radio label="20">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="open2()">确 定</el-button>
			</div>
        </el-dialog>

  </div>
</template>
<script>
	//2
	import { url } from '../../api/api';
  	export default {
	  
    methods: {
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
		this.$axios.get(url+'/community/findAll', {params:this.page}).then(response => {
			 			if(response.data.code == '0000'){
								 this.datalist = response.data.data;
								 this.total = response.data.page.totalCount;
								 this.totalsize  = response.data.page.pageSize;
						 }
                 
                }).catch(error => {
                  console.log(error)
        })


	  },
	  deleteRow(index, rows) {
       this.$confirm('是否确认删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
            this.dialogFormVisible = false;
            
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
      },
      edit(index,rows){
        this.dialogFormVisible = true;   
		this.form = rows;
		//console.log(this.form);
      },
      add(){
        this.dialogFormVisible = true;   
        
      },
      getUsers(){

      },
      open2() {
            this.$confirm('是否修改该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
          this.dialogFormVisible = false;
			this.$message({
				type: 'success',
				message: response.data.message
			});		

			//修改文件勿删除
			// this.$axios.post(url+'/community/update', this.form).then(response => {
			// 				if(response.data.code == '0000'){
			// 					this.$message({
			// 						type: 'success',
			// 						message: '修改成功!'
			// 					});
			// 				}else{
			// 					this.$message({
			// 						type: 'error',
			// 						message: response.data.message
			// 					});
			// 				}
					
			// 		}).catch(error => {
			// 		console.log(error)
			// })


            this.dialogFormVisible = false;
            
            }).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消修改'
					});          
            });
	  },
	/**
    * 加载省份
    */
   //二
    loadProvince(){
		var page = {
			 parentCode:'100000'
		}
		this.$axios.get(url+'/community/findCitys', {params:page}).then(response => {
			 			if(response.data.code == '0000'){
								this.provinces = response.data.data;
								//console.log(this.provinces);
								for(let opt in this.provinces){
									if(!this.form.provinceCode){
										this.form.provinceCode = this.provinces[opt].code;
										this.form.province = this.provinces[opt].name;
										this.loadCity(this.form.provinceCode);
									}
									break;
								}
								
						 }
                 
                }).catch(error => {
                  console.log(error)
        })	


    },

    /**
    * 加载城市
    */
   //三
    loadCity(provinceCode){
		var data = {
		
                parentCode:provinceCode
            
		}
		this.$axios.get(url+'/community/findCitys', {params:data}).then(response => {
			 			if(response.data.code == '0000'){
								this.citys = response.data.data;
								//console.log(this.citys);	
								for(let opt in this.citys){
								if(!this.form.cityCode){
									this.form.cityCode = this.citys[opt].code;
									this.form.city = this.citys[opt].name;
									this.loadArea(this.form.cityCode);
								}
								break;
							}							
						 }
                }).catch(error => {
                  console.log(error)
        })
       
    },

    /**
    * 加载区县
    */

    //四
    loadArea(cityCode){
		var data = {
			
                parentCode:cityCode
           
		}
		
		this.$axios.get(url+'/community/findCitys', {params:data}).then(response => {
			 			if(response.data.code == '0000'){
								this.areas = response.data.data;
								//console.log(this.areas);	
								 for(let opt in this.areas){
									if(!this.form.areaCode){
										this.form.areaCode = this.areas[opt].code;
										this.form.area = this.areas[opt].name;
									}
									break;
								}							
						 }
                }).catch(error => {
                  console.log(error)
        })
	},
	/**
    * 改变省份
	* 五
    */
    selectProvince(obj){
        this.form.province = obj;
        this.form.cityCode=null;
		this.form.areaCode=null;
        this.loadCity(obj);
    },

    /**
    * 改变城市
	* 六
    */
    selectCity(obj){
        this.form.city = obj;
		this.form.areaCode=null;
		this.form.area=null;
        this.loadArea(obj);
    },

    /**
    * 改变区县
	* 七
    */
    selectArea(obj){
        this.form.area = obj;
    },
	},
	//1
	created:function(){
		//3
		 this.page.pageNumber = 1;
		 this.$axios.get(url+'/community/findAll', {params:this.page}).then(response => {
			 			if(response.data.code == '0000'){
								 this.datalist = response.data.data;
								 this.total = response.data.page.totalCount; 
								 this.totalsize  = response.data.page.pageSize;
						 }
                 
                }).catch(error => {
                  console.log(error)
		});
		//一
		this.loadProvince();
	},
    data() {
      return {
		total:0,     //数据的总数量
		totalsize:0,  //总的页数 = 总数量/每页显示的条数
		currentPage: 1,
		pageNumber:1,
		datalist:[],
		page:{
			pageSize:1,    //当前选中页
			pageNumber:this.pageNumber  //每页显示的条数
		},
		listLoading: false,
		form:{},
		dialogFormVisible:false,
		provinces:[], //获取省份
		citys:[], //获取市
		areas:[], //获取区

      };
    }
  }
</script>
<style>
	.el-dialog--small {
		 width: 30%; 
	}
</style>
