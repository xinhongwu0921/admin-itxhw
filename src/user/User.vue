<template>
    <div class="user">
      <el-row>
        <el-col :span="24">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!--组件绑定原生事件需要加.native修饰符-->
          <el-input placeholder="请输入内容" class="search-input" v-model="query" @keydown.native.enter="initList">

            <el-button slot="append" icon="el-icon-search" @click="initList"></el-button>

          </el-input>
          <el-button type="success" plain @click="addDialogTableVisible=true">添加用户</el-button>
        </el-col>
      </el-row>



      <el-table
        v-loading="loading"
        class="margin20"
        :data="userList"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column label="用户状态" width="50px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state" @change="changeUserState(scope.row)"
              >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              plain
              size="mini"
              @click="showEdit( scope.row)">
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              size="mini"
              @click="showDelete( scope.row)">
            </el-button>
            <el-button
              type="warning"
              icon="el-icon-check"
              plain
              size="mini"
              @click="showGrantRole( scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div>
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="4"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>

      <!--添加用户的弹框-->
      <el-dialog title="添加用户" :visible.sync="addDialogTableVisible">
        <el-form :model="addForm" :rules="rules" ref="addUserForm">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-input v-model="addForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="addForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="addForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserSubmit('addUserForm')" >确 定</el-button>
        </div>
      </el-dialog>

      <!--编辑用户的弹框-->
      <el-dialog title="用户信息修改" :visible.sync="editDialogTableVisible">
        <el-form :model="editForm" :rules="rules" ref="editUserForm">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-input v-model="editForm.username" auto-complete="off" disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="editForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserSubmit('editUserForm')" >确 定</el-button>
        </div>
      </el-dialog>

      <!--角色分配的弹框-->
      <el-dialog title="角色分配" :visible.sync="roleDialogFormVisible">
        <el-form :model="roleForm">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-tag type="info">{{roleForm.username}}</el-tag>
            <!--<el-input v-model="roleForm.name" auto-complete="off"></el-input>-->
          </el-form-item>
          <el-form-item label="角色" :label-width="formLabelWidth">
            <el-select v-model="roleId" placeholder="请选择用户角色">
              <el-option v-for="(role,index) in roleList" :key="index" :label="role.roleName" :value="role.id"></el-option>

            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="roleDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="grantUserSubmit">确 定</el-button>
        </div>
      </el-dialog>

    </div>

</template>

<script>
  import {getUserList,changeUserState,addUser,getUserById,editUser,deleteUser,getRoleList,grantUserRole } from '@/api'
    export default {
        name: "user",
      data() {
        return {
          loading:true,
          userList:[],
          value2:true,
          query:'',
          total:0,
          pagesize:4,
          pagenum:1,
          addDialogTableVisible:false,
          dialogFormVisible:false,
          editDialogTableVisible:false,
          editDialogFormVisible:false,
          roleDialogFormVisible:false,
          roleList: [],
          roleId: '',
          formLabelWidth: '120px',
          addForm:{
            username:"",
            password:'',
            email:'',
            mobile:''
          },
          editForm:{
            username:"",
            email:'',
            mobile:''
          },
          roleForm:{

          },
          // 添加用户的表单验证
          rules: {
            username: [
              { required: true, message: '请输入用户名', trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' }
            ],
            email: [
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
            ],
            mobile: [
              { required: true, message: '电话不能为空' }
            ]
          }
        }
      },
      created(){
          this.initList()
      },
      methods: {
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
          this.pagesize=val
          this.initList()
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.pagenum=val
          this.initList()
        },
        // 显示编辑用户对话框
        showEdit (row) {
          console.log(row);
          this.editDialogTableVisible = true
          getUserById(row.id).then(res => {
            if (res.meta.status === 200) {
              this.editForm.username = res.data.username
              this.editForm.email = res.data.email
              this.editForm.mobile = res.data.mobile
              this.editForm.id = res.data.id
            }
          })
        },
        // 编辑用户提交
        editUserSubmit (formName) {
          this.$refs[formName].validate(valide => {
            if (valide) {
              editUser(this.editForm).then(res => {
                if (res.meta.status === 200) {
                  this.$message({
                    type: 'success',
                    message: '编辑成功'
                  })
                  this.editDialogTableVisible = false
                  this.initList()
                }
              })
            }
          })
        },
        //显示删除弹框
        showDelete(row){
          this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteUser(row.id).then(res=>{
              if(res.meta.status===200){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.initList()
              }
            })

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        handleEdit(index, row) {
          console.log(index, row);
          console.log(row);

        },
        //显示角色分配框
        showGrantRole(row){

          this.roleForm = row
          this.roleDialogFormVisible=true
          getRoleList().then(res => {
            console.log(res)
            if (res.meta.status === 200) {
              this.roleList = res.data
            }
          })
        },

        // 分配角色
        grantUserSubmit () {
          if (!this.roleId) {
            this.$message({
              type: 'warning',
              message: '角色不能为空，请选择！'
            })
          } else {
            grantUserRole({id: this.roleForm.id, rid: this.roleId}).then(res => {
              if (res.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '设置角色成功'
                })
                this.roleDialogFormVisible = false
              } else {
                this.$message({
                  type: 'error',
                  message: res.meta.msg
                })
              }
            })
          }
        },
        initList(){
          this.loading=true
         getUserList({params:{query:this.query,pagenum:this.pagenum,pagesize:this.pagesize}}).then(res=>{
           console.log(res)
           if(res.meta.status===200){
             this.userList=res.data.users
             this.total=res.data.total
           }else{
             this.$message({
               type: 'warning',
               message: res.meta.msg
             })
           }

         })
          this.loading=false
        },
        changeUserState(row){
          changeUserState({uid:row.id,type:row.mg_state}).then(res=>{
            if(res.meta.status===200){
              this.$message({
                type:"success",
                message:"修改用户状态成功"
              })
            }else{
              this.$message({
                type: 'warning',
                message: res.meta.msg
              })
            }
          })
        },
        // 添加用户
        addUserSubmit (formName) {
          this.$refs[formName].validate(valide => {
            if (valide) {
              // 执行添加用户方法
              addUser(this.addForm).then(res => {
                console.log(res)
                if (res.meta.status === 201) {
                  this.$message({
                    type: 'success',
                    message: '创建用户成功'
                  })
                }
                this.addDialogTableVisible = false
                this.initList()
              })
            }
          })
        },
      },



    }
</script>

<style lang="scss" scoped>
  .user {
    .margin20{
      margin: 20px 0;
    }
  .search-input {
    width: 300px;
  }
  .page {
    padding: 5px 0;
    background-color: #D3DCE6;
  }
  }
</style>
