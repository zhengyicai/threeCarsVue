<template>

<el-row :gutter="24" style="margin-top:20px">
  <el-col :span="4">
      <div class=" bg-purple">
           <el-tree :data="tree"  :props="defaultProps" :check-strictly="true"
			:highlight-current="true"	 @node-click="handleNodeClick"></el-tree> 

            <!-- <el-tree
		  	:data="tree"
		  	:props="defaultProps"
		  	
		  	node-key="id"
		  	:check-strictly="true"
			:highlight-current="true"	
		  	
		  	:expand-on-click-node="false"
		  	:render-content="renderContent"
		  	ref="tree"
		  	@check-change="checkChange"
		  	@node-click="handleNodeClick"
		  	>
              </el-tree> -->

      </div>
  </el-col>
  <el-col :span="20">
      <div class="grid-content bg-purple">
          
          <el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;">
		
			
			<el-table-column prop="roomNo" label="房间编号" width="220" sortable>
			</el-table-column>
			<el-table-column prop="roomName" label="房间名称" width="220" sortable>
			</el-table-column>
			
			<el-table-column  label="状态" min-width="150">
				<template slot-scope="scope">{{ state(scope.row.state)}}</template>
			</el-table-column>
            
			
			<el-table-column label="操作" min-width="250">
				<template scope="scope">
				
                <!-- <el-button size="small" type="primary" @click="showRelationPanel(scope.$index,scope.row)">住房信息</el-button>
                <el-button size="small" type="danger" @click="deleteRow(scope.$index,scope.row)">删除</el-button> -->
                 <el-button size="small" type="warning"   @click="updateState(scope.row)" >编辑</el-button>
                 <el-button size="small" type="primary"   @click="updateRoom(scope.row)">房卡管理</el-button>
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

        <el-dialog   title="修改房间名称" :visible.sync="dialogFormVisible" >
			<el-form ref="subData" :model="subData" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;">
                    
                    <el-form-item label="房间名称">
                        <el-input type="number" v-model="subData.roomName"  placeholder="请输入楼栋名称 例如：1"></el-input>
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


        <el-dialog   title="房卡管理" :visible.sync="dialogFormVisibleRoom" >
			<el-form ref="subData" :model="subData1" label-width="100px" @submit.prevent="onSubmit" style="margin:0px;">
                    
                 
                 
                <el-form-item label="卡号1">
                        <el-input style="width:60%" v-bind:disabled="oneSum" v-model="one" type="number" placeholder="请输入10位数的卡号"></el-input>
                        <el-button type="primary" v-bind:disabled="oneId==''"  style="font-size:12px" @click="query(one,oneId)" >查看设备</el-button>
                </el-form-item>
                <el-form-item label="卡号2">
                        <el-input style="width:60%" v-bind:disabled="twoSum" v-model="two"  placeholder="请输入10位数的卡号"></el-input>
                         <el-button type="primary" v-bind:disabled="twoId==''"  style="font-size:12px" @click="query(two,twoId)" >查看设备</el-button>
                </el-form-item>
                <el-form-item label="卡号3">
                        <el-input style="width:60%"  v-bind:disabled="threeSum" v-model="three"  placeholder="请输入10位数的卡号"></el-input>
                         <el-button type="primary" v-bind:disabled="threeId==''" style="font-size:12px" @click="query(three,threeId)" >查看设备</el-button>
                </el-form-item>
                <el-form-item label="卡号4">
                        <el-input style="width:60%"  v-bind:disabled="fourSum" v-model="four"  placeholder="请输入10位数的卡号"></el-input>
                         <el-button type="primary" v-bind:disabled="fourId==''" style="font-size:12px"   @click="query(four,fourId)">查看设备</el-button>
                </el-form-item>
                <el-form-item label="卡号5">
                        <el-input style="width:60%" v-bind:disabled="freeSum" v-model="free"  placeholder="请输入10位数的卡号"></el-input>
                         <el-button type="primary" v-bind:disabled="freeId==''" style="font-size:12px"  @click="query(free,freeId)">查看设备</el-button>
                </el-form-item>
               
                   
			</el-form>	
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleRoom = false">取 消</el-button>
				<el-button  type="primary" @click="open1()">确 定</el-button>
			</div>
        </el-dialog>



        <el-dialog   title="设备管理" :visible.sync="dialogFormVisibleRoomDevice" >
            卡号:{{roomNo}}
            <!-- {{roomId}} -->
			
                
                <!-- <el-form-item label="设备号" v-for="item in items" :key="item.id" >
                        <el-button disabled="disabled" style="width:50%">{{one}}</el-button>
                        
                        <el-button type="primary" style="font-size:12px" @click="query()" >已打卡</el-button>
                </el-form-item> -->
                <el-table :data="equlist" border style="width: 100%">
                        <el-table-column prop="equId" label="设备号" width="200">
                        </el-table-column>
                      
                     <el-table-column  label="状态" min-width="100">
                
			            	<template slot-scope="scope"><span class="span" v-if="scope.row.state=='10'">已发卡</span> <span class="span" v-if="scope.row.state=='20'">未发卡</span></template>
			        </el-table-column>
                        
                    </el-table>
                <!-- <el-form-item label="设备号2">
                        <el-button disabled="disabled" style="width:50%">{{one}}</el-button>
                        <el-button type="danger" style="font-size:12px" @click="query()" >未发卡</el-button>
                </el-form-item> -->
             
			
			<!-- <div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleRoomDevice = false">取 消</el-button>
				<el-button type="primary" @click="open1()">确 定</el-button>
			</div> -->
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
     checkChange(item, node, self){
        // this.$refs.tree.setCheckedKeys([item.id]);
      
      
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
        

        if(this.subData.roomName.trim() =="" ||  this.subData.roomName ==null){
                this.$message({
                    message: "房间名称不能为空",
                    type: 'error'
                });
                return;
        }
        RequestPost("/room/update",this.subData).then(response => {
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
                    //this.communityId = this.subData.communityId;
                    this.loadCommunityData();
        }).catch(error => {
        this.$router.push({ path: '/login' });
        })

    },
     open1(){
         
         if(this.validate() == false){
            return;
         }
        
        this.subData1.cardNos = this.one+","+this.two+","+this.three+","+this.four+","+this.free;  
        this.subData1.oldcardNos = this.oneOld+","+this.twoOld+","+this.threeOld+","+this.fourOld+","+this.freeOld;  
        RequestPost("/room/addCard",this.subData1).then(response => {
                    if(response.code=='0000'){
                        this.$message({
                            message: response.message,
                            type: 'success'
                        });  
                        this.dialogFormVisibleRoom = false;
                        this.subData1.oldcardNos="";
                    }else{
                        this.$message({
                            message: response.message,
                            type: 'error'
                        });
                    }
                    //this.loadData();
                    //this.communityId = this.subData.communityId;
                    this.loadCommunityData();
        }).catch(error => {
        this.$router.push({ path: '/login' });
        })

    },
    updateState(rows){
         this.dialogFormVisible = true;
         this.subData = rows;
          

           


      },
    updateRoom(rows){
         this.dialogFormVisibleRoom = true;
         this.subData1 = {};
         this.subData = rows;
         this.one = "";
         this.two = "";
         this.three = "";
         this.four = "";
         this.free = "";

         this.oneId = "";
         this.twoId = "";
         this.threeId = "";
         this.fourId = "";
         this.freeId = "";


         this.oneOld = "";
         this.twoOld = "";
         this.threeOld = "";
         this.foureOld = "";
         this.freeOld = "";


        this.oneSum = false;
        this.twoSum = false;
        this.threeSum = false;
        this.fourSum = false;
        this.freeSum = false;

         this.subData1.buildingId = rows.buildingId;
         this.subData1.communityId = rows.communityId;
         this.subData1.roomId  = rows.id;
         this.subData1.unitId = rows.unitId;


         RequestGet("/room/findCards",{roomId:rows.id}).then(response => {
                    if(response.code=='0000'){
                          if(response.data.length>0){
                              for(var i = 0 ;i<response.data.length;i++){
                                  if(i ==0){
                                      this.one = response.data[i].cardNo+"";
                                      this.oneOld = response.data[i].cardNo+"";
                                      this.oneId= response.data[i].id;
                                      if( parseInt(response.data[i].countSum)>0){
                                          this.oneSum = true;
                                      }else{
                                          this.oneSum = false;
                                      }
                                  }else if(i ==1){
                                      this.two = response.data[i].cardNo+"";
                                      this.twoId= response.data[i].id;
                                      this.twoOld = response.data[i].cardNo+"";

                                      if( parseInt(response.data[i].countSum)>0){
                                          this.twoSum = true;
                                      }else{
                                          this.twoSum = false;
                                      }
                                  }else if(i ==2){
                                      this.three = response.data[i].cardNo+"";
                                      this.threeId= response.data[i].id;
                                      this.threeOld = response.data[i].cardNo+"";

                                      if( parseInt(response.data[i].countSum)>0){
                                          this.threeSum = true;
                                      }else{
                                          this.threeSum = false;
                                      }
                                  }else if(i ==3){
                                      this.four = response.data[i].cardNo+"";
                                      this.fourId= response.data[i].id;
                                      this.fourOld = response.data[i].cardNo+"";

                                       if( parseInt(response.data[i].countSum)>0){
                                          this.fourSum = true;
                                      }else{
                                          this.fourSum = false;
                                      }
                                  }else if(i ==4){
                                      this.free = response.data[i].cardNo+"";
                                      this.freeId= response.data[i].id;
                                      this.freeOld = response.data[i].cardNo+"";

                                       if( parseInt(response.data[i].countSum)>0){
                                          this.freeSum = true;
                                      }else{
                                          this.freeSum = false;
                                      }
                                      
                                  }
                              }
                          }
                          


                    }else{
                        this.$message({
                            message: response.message,
                            type: 'error'
                        });
                    }
                    //this.loadData();
                    //this.communityId = this.subData.communityId;
                    this.loadCommunityData();
        }).catch(error => {
        this.$router.push({ path: '/login' });
        })
         

    },  
    query(roomNo,id){
        this.dialogFormVisibleRoomDevice = true;
        this.roomNo =  roomNo;
        this.roomId  = id;
        this.equlist=[];    

        RequestGet("/room/findCardEquipment",{
               cardId:id
            }).then(response => {
                    if(response.code == '0000'){
                                
                         this.equlist  = response.data;
                    }     
					
		}).catch(error => {
						 this.$router.push({ path: '/login' });
						
        })  




    },
    addCard(){
         this.dialogFormVisible = true;   
    },
    
    /**
    * 加载楼栋数据
    */
    loadCommunityData(){
        
            
        RequestGet("/room/findRooms",{
                buildingId:this.buildingId,
                unitId:this.unitId
            }).then(response => {
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

        console.log(data.parentId);
        if(data.parentId !=undefined && data.parentId !="" && data.parentId !=null){
                this.buildingId = data.parentId;
                this.unitId = data.id;
                this.loadCommunityData();
        }
         this.loadCommunityData();
       
       
    },
     /**
    * 加载小区树型数据
    */
    loadTreeData(){
        RequestGet("/room/findTree").then(response => {
            if(response.code == '0000'){
                //alert( response.data);
                
                var item = [];

                if(response.data.length>0){
                     for(var i= 0 ;i<response.data.length;i++){
                            var person ={
                                    label: response.data[i].value,
                                    id: response.data[i].id,
                                    children:response.data[i].children
                            };

                            if(i==0){
                                this.communityId = response.data[i].id;
                                 this.loadCommunityData();
                            }

                            if(person.children) 
                           
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
    validate(){
        
        if(this.one.trim()!="" && (parseInt(this.one.trim())>2147483647 ||parseInt(this.one.trim())<1)  ){
            this.$message({
                message: "卡号1输入有误",
                type: 'error'
            });
            return false;
        }

        if(this.two.trim()!="" && (parseInt(this.two.trim())>2147483647 ||parseInt(this.two.trim())<1) ){
            this.$message({
                message: "卡号2输入有误",
                type: 'error'
            });
            return false;
        }
        if(this.three.trim()!="" && (parseInt(this.three.trim())>2147483647 ||parseInt(this.three.trim())<1)){
            this.$message({
                message: "卡号3输入有误",
                type: 'error'
            });
            return false;
        }
        if(this.four.trim()!="" && (parseInt(this.four.trim())>2147483647 ||parseInt(this.four.trim())<1)){
            this.$message({
                message: "卡号4输入有误",
                type: 'error'
            });
            return false;
        }
        if(this.free.trim()!="" && (parseInt(this.free.trim())>2147483647 ||parseInt(this.free.trim())<1)){
            this.$message({
                message: "卡号5输入有误",
                type: 'error'
            });
            return false;
        }

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
        buildingId:'',
        unitId:"",
        dialogFormVisible:false,
        dialogFormVisibleRoom:false,
        dialogFormVisibleRoomDevice:false,
        subData:{},
        subData1:{
            buildingId:"",
            communityId:"",
            roomId:"",
            cardNos:"",
            unitId:"",
            oldcardNos:""

        },
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
        equlist:[],
       
      };
    }
  }
</script>