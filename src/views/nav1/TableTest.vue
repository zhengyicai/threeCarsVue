<template>
    <div>
        <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" >
				<el-form-item>
					<el-input  placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="add()">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
        
        <el-table :data="tableData" border style="width: 100%">
            
            <el-table-column
            prop="communityNo"
            label="小区编号"
            :width="formcolWidth">
            </el-table-column>
            <el-table-column
            prop="communityName"
            label="小区名称"
            width="120">
            </el-table-column>
            <el-table-column
            prop="province"
            label="省份"
            width="120">
            </el-table-column>
            <el-table-column
            prop="city"
            label="城市"
            width="200">
            </el-table-column>
            <el-table-column
            prop="area"
            label="区县"
            width="120">
            </el-table-column>
            <el-table-column
            prop="address"
            label="地址"
            width="120">
            </el-table-column>
            <el-table-column
            prop="createTime"
           
            label="创建时间"
            width="120">
            </el-table-column>
            <el-table-column
            prop="state"
            label="状态"
            :formatter="formatterColumn"
            width="120" >
            </el-table-column>
            <el-table-column
            prop="sysUserId"
            label="物业员用户名"
            width="120">
            </el-table-column>
             <el-table-column
            prop="userStatus"
            label="物业员状态"
            width="120">
            </el-table-column>






            <el-table-column label="操作">
            <template slot-scope="scope">
                
                <el-button size="small" @click="edit(scope.$index,scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <!--编辑界面-->
                <!-- <el-dialog title="详细信息" :visible.sync="dialogFormVisible">
                    <el-form :model="form" :label-width="formLabelWidth">
                        <el-form-item label="姓名">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="省份">
                            <el-input v-model="form.province"></el-input>
                        </el-form-item>
                        <el-form-item label="市区">
                            <el-input v-model="form.city"></el-input>
                        </el-form-item>
                        <el-form-item label="地址">
                            <el-input v-model="form.address"></el-input>
                        </el-form-item>
                        <el-form-item label="邮编">
                            <el-input v-model="form.zip"></el-input>
                        </el-form-item>
                        <el-form-item label="日期">
                            <el-input v-model="form.date"></el-input>
                        </el-form-item>
                       
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="open2()">确 定</el-button>
                    </div>
                    </el-dialog> -->
            </div>    


</template>


<script>
  import { url } from '../../api/api';
  export default {
    methods: {
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
            this.$message({
                type: 'success',
                message: '修改成功!'
            });
            this.dialogFormVisible = false;
            
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消修改'
            });          
            });
      },
      formatterColumn(row, column) {
            switch(row.state){
                
                case "10":
                return '审核通过';
                break;

                case "20":
                return '待审核';
                break;

                default:
                return '未知';
            }
        },

    },
    created:function(){
           this.$axios.get(url+'/community/findAll').then(response => {
                 this.tableData = response.data.data;
                 console.log(this.tableData );
                }).catch(error => {
                  console.log(error)
          })
    },
    data() {
      return {
        tableData: [],
        formcolWidth:'120px',
        dialogFormVisible: false
      }
    }
  }
</script>