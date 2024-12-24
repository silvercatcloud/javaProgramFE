<template>
  <div class="add-student">
    <el-drawer
      v-model="isAddStudentVisible"
      title="添加学生"
      direction="rtl"
      size="40%"
      :before-close="onClose"
    >
      <el-form
        :model="studentForm"
        :rules="rules"
        ref="studentFormRef"
        label-width="100px" 
      >
        <el-form-item label="学生 ID" prop="id">
          <el-input
            v-model.number="studentForm.id"
            placeholder="请输入学生 ID"
          ></el-input>
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="studentForm.name"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-select v-model="studentForm.gender" placeholder="请选择性别">
            <el-option label="男" value="Male"></el-option>
            <el-option label="女" value="Female"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="年龄" prop="age">
          <el-input-number
            v-model.number="studentForm.age"
            :min="1"
            placeholder="请输入年龄"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="专业" prop="major">
          <el-input
            v-model="studentForm.major"
            placeholder="请输入专业"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import {defineEmits, toRefs} from 'vue'
const emit = defineEmits(['closeTeleport'])
const isDialogVisible = ref(true);
const isAddStudentVisible = ref(true)
const studentForm = ref({
  id: null,
  name: '',
  gender: '',
  age: null,
  major: '',
});

const rules = {
  id: [{ required: true, message: '学生 ID 是必填项', trigger: 'blur' }],
  name: [{ required: true, message: '姓名是必填项', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  age: [
    {
      required: true,
      type: 'number',
      message: '请输入有效的年龄',
      trigger: 'blur',
    },
  ],
  major: [{ required: true, message: '专业是必填项', trigger: 'blur' }],
};

const studentFormRef = ref(null);

const submitForm = () => {
  studentFormRef.value.validate((valid) => {
    if (valid) {
      axios
        .post('/api/students', studentForm.value)
        .then(() => {
          ElMessage.success('学生添加成功！');
          resetForm();
          isAddStudentVisible.value=false;
        })
        .catch((error) => {
          console.error('请求失败', error);
          ElMessage.error('学生添加失败，请重试！');
        });
    } else {
      ElMessage.warning('请检查表单内容是否完整！');
    }
  });
};

const resetForm = () => {
  studentFormRef.value.resetFields();
};

const onClose = () => {
  isDialogVisible.value = false;
  emit('close'); // 触发父组件的关闭事件
};

const open = async () => {
  isAddStudentVisible.value = true
  console.log('dada~');
}
defineExpose({
  open,
})
</script>

<style scoped>
.add-student {
  max-width: 600px;
  margin: 20px auto;
}
</style>
