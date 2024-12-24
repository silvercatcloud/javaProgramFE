<template>
  <page-container title="学生管理模块">
    <template #extra>
      <el-button type="primary" @click="onAddStudent">添加学生</el-button>
    </template>
    <el-form inline :model="queryForm" label-width="100px">
      <el-form-item label="学生 ID">
        <el-input
          v-model.number="queryForm.id"
          placeholder="请输入学生 ID"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="queryStudent"
          >查询学生</el-button
        >
      </el-form-item>
    </el-form>

    <div v-if="student">
      <h3>学生信息</h3>
      <el-descriptions :border="true" column="2">
        <el-descriptions-item label="ID">{{ student.id }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{
          student.name
        }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{
          student.gender
        }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{
          student.age
        }}</el-descriptions-item>
        <el-descriptions-item label="专业">{{
          student.major
        }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <el-form
      v-if="student"
      :model="studentUp"
      :rules="updateRules"
      ref="updateFormRef"
      label-width="100px"
    >
      <h3>更新学生信息</h3>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="studentUp.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="studentUp.gender" placeholder="请选择性别">
          <el-option label="男" value="Male"></el-option>
          <el-option label="女" value="Female"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number
          v-model.number="studentUp.age"
          :min="1"
          placeholder="请输入年龄"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-input v-model="studentUp.major" placeholder="请输入专业"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateStudent">更新信息</el-button>
        <el-button type="danger" @click="deleteStudent">删除学生</el-button>
      </el-form-item>
    </el-form>
    <AddStudent
      ref="addStudentRef"
      v-if="isAddStudentVisible"
      @close="isAddStudentVisible = false"
    ></AddStudent>
  </page-container>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
import PageContainer from "@/components/PageContainer.vue";
import AddStudent from "@/components/AddStudent.vue";
const isAddStudentVisible = ref(false);
const addStudentRef = ref();
const student = ref(null);

const studentUp =ref({
  id: null,
  name: '',
  gender: '',
  age: null,
  major: '',
})
const updateRules = {
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }],
  age: [
    {
      required: true,
      type: "number",
      message: "请输入有效的年龄",
      trigger: "blur",
    },
  ],
  major: [{ required: true, message: "专业是必填项", trigger: "blur" }],
};

const onAddStudent = () => {
  isAddStudentVisible.value = true;
  addStudentRef.value.open();
};

const queryForm = reactive({
  id: null,
});

const queryStudent = () => {
  axios
    .get(`/api/students/${queryForm.id}`)
    .then((response) => {
      if (!response.data) {
        // 数据为空时的处理  
        ElMessage.warning("暂无结果！");
        student.value=null;
      }
      else {
      student.value = response.data;
      studentUp.value.id = student.value.id;
      ElMessage.success("学生信息查询成功！");
      }
    })
    .catch(() => {
      ElMessage.error("学生信息查询失败，请检查学生 ID！");
    });
};
const updateFormRef = ref(null);
const updateStudent = () => {
  updateFormRef.value.validate((valid) => {
    if (valid) {
      axios
        .put("/api/students", studentUp.value)
        .then(() => {
          ElMessage.success("学生信息更新成功！");
          queryStudent();
        })
        .catch(() => {
          ElMessage.error("学生信息更新失败！");
        });
    }
  });
};
const deleteStudent=()=>{
        axios.delete(`/api/students/${student.value.id}`)
          .then(() => {
            ElMessage.success('学生删除成功！');
            student.value.id = null;
            queryStudent();
          })
          .catch(() => {
            ElMessage.error('学生删除失败！');
          });
      };
</script>

<style scoped>
</style>