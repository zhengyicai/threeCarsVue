<template> 
 <div class="block">   
	 	<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item style="width:300px">
					<el-input v-model="page.criteria"  @keyup.enter.native="query"  placeholder="请输入手机号" style="width:300px"></el-input>
				</el-form-item>
				<el-form-item  >
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
                <el-form-item  >
					<el-button type="success" v-on:click="querySys">查看物业开锁记录</el-button>
				</el-form-item>
				
				
			</el-form>
		</el-col>
       
      
        
		<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="communityName" label="小区名字" width="200" sortable>
			</el-table-column>
            <el-table-column prop="userName" label="用户名" width="200" sortable>
			</el-table-column>
          

            <el-table-column  label="(用户/物业)手机号" min-width="200" sortable>
                            <template slot-scope="scope">{{scope.row.mobile}}{{scope.row.mobile1}}</template>    
			</el-table-column>

			 <el-table-column   label="用户房号" min-width="200" sortable>
                          
							<template slot-scope="scope"   >
								<span v-if="scope.row.mobile!='' && scope.row.mobile!=null ">{{scope.row.roomNo.substring(6,8)}}栋{{scope.row.roomNo.substring(8,10)}}单元{{scope.row.roomNo.substring(10,14)}}房间</span>
								<span v-if="scope.row.mobile==null ">物业</span>
							</template>    
							
			</el-table-column>


            <el-table-column prop="roomNo" label="用户编号" width="200" sortable>
			</el-table-column>


            
            <el-table-column  label="开锁时间" min-width="200">
				<template slot-scope="scope">{{ scope.row.createTime | moment('YYYY-MM-DD HH:mm:ss') }}</template>
			</el-table-column>
			<!-- <el-table-column prop="equipmentId" label="设备编号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="equipmentName" label="设备名称" width="150" sortable>
			</el-table-column>
			<el-table-column prop="communityName" label="所属小区" width="150" sortable>
			</el-table-column>
			<el-table-column prop="buildingName" label="楼栋" width="150" sortable>
			</el-table-column>
            <el-table-column prop="equId" label="序列号" width="150" sortable>
			</el-table-column> -->
			<!-- <el-table-column  label="状态" min-width="150" sortable>
                            <template slot-scope="state">{{scope.row.state}}</template>    
			</el-table-column>
			<el-table-column  label="创建时间" min-width="120">
				<template slot-scope="scope">{{ scope.row.createTime | moment('YYYY-MM-DD') }}</template>
			</el-table-column> -->
            
          
			
			<el-table-column label="操作" min-width="100">
				
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
			this.page.sysUserId = "";
            this.loadData();
        },
		/**
		* 查询
		*/
		querySys(){
			this.page.sysUserId =  sessionStorage.getItem("userId");
			this.loadData();
		},

      
     
      getUsers(){},


      
	 
     

	
	loadData(){

		RequestGet("/equipment/lockFindAll",this.page).then(response => {
						if(response.code == '0000'){
                           // alert("asdf");
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
			sysUserId:'',
			communityId:sessionStorage.getItem("communityId")
		},
		datalist:[],
		
		listLoading: false,
        form:{},
        communityNo:"",
        subData:{},
        isEdit:true, //是否禁用
        dialogFormVisible:false,
        communitys:[],
        buildings:[],
        units:[],
        communityId:"",
        buildingId:"",
        unitNo:"",
        formtitle:""
        

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
