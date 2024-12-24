<template>
  <page-container title="成绩管理模块" class="container">
    <template #extra>
      <el-button type="primary" @click="onAddScore">添加成绩</el-button>
      <el-button type="success" @click="onUpdateScore">修改成绩</el-button>
    </template>

    <el-form
      inline
      :model="queryForm"
      label-width="100px"
      @submit.prevent="queryScores"
    >
      <el-form-item label="学生 ID">
        <el-input
          v-model.number="queryForm.studentId"
          placeholder="请输入学生 ID"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="queryScores"
          >查询成绩</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="danger" plain @click="deleteScores"
          >删除成绩</el-button
        >
      </el-form-item>
    </el-form>

    <div v-if="scores.length">
      <h3>学生成绩</h3>
      <el-table v-if="scores.length > 0" :data="scores" style="width: 100%">
        <el-table-column prop="courseId" label="课程 ID" width="120" />
        <el-table-column prop="courseName" label="课程名称" />
        <el-table-column prop="score" label="成绩" width="120" />
      </el-table>

      <div class="boxBottom">
        <div v-if="totalScore !== null">
          <p>学生总分: {{ totalScore }}</p>
        </div>

        <div v-if="averageScore !== null">
          <p>学生平均分: {{ averageScore }}</p>
        </div>
        <el-button
          color="#5976ba"
          :dark="isDark"
          plain
          type="info"
          @click="getTotalScore"
          v-if="scores.length"
          >获取总分</el-button
        >
        <el-button
          color="#dd7694"
          :dark="isDark"
          plain
          type="info"
          @click="getAverageScore"
          v-if="scores.length"
          >获取平均分</el-button
        >
      </div>
    </div>
    <!-- 暂无数据提示 -->
    <div v-else class="no-data">
      <el-empty description="暂无结果"></el-empty>
    </div>
    <el-dialog title="添加成绩" v-model="isAddDialogVisible">
      <el-form :model="scoreForm" label-width="100px">
        <el-form-item label="学生 ID">
          <el-input
            v-model.number="scoreForm.studentId"
            placeholder="请输入学生 ID"
          />
        </el-form-item>
        <el-form-item label="课程 ID">
          <el-input
            v-model.number="scoreForm.courseId"
            placeholder="请输入课程 ID"
          />
        </el-form-item>
        <el-form-item label="课程名称">
          <el-input
            v-model="scoreForm.courseName"
            placeholder="请输入课程名称"
          />
        </el-form-item>
        <el-form-item label="成绩">
          <el-input-number
            v-model.number="scoreForm.score"
            :min="0"
            :max="100"
            placeholder="请输入成绩"
          />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="isAddDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addScore">提交</el-button>
      </template>
    </el-dialog>

    <el-dialog title="修改成绩" v-model="isUpdateDialogVisible">
      <el-form :model="scoreForm" label-width="100px">
        <el-form-item label="学生 ID">
          <el-input
            v-model.number="scoreForm.studentId"
            placeholder="请输入学生 ID"
            disabled
          />
        </el-form-item>
        <el-form-item label="课程 ID">
          <el-input
            v-model.number="scoreForm.courseId"
            placeholder="请输入课程 ID"
          />
        </el-form-item>
        <el-form-item label="课程名称">
          <el-input
            v-model="scoreForm.courseName"
            placeholder="请输入课程名称"
          />
        </el-form-item>
        <el-form-item label="成绩">
          <el-input-number
            v-model.number="scoreForm.score"
            :min="0"
            :max="100"
            placeholder="请输入成绩"
          />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="isUpdateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateScore">提交</el-button>
      </template>
    </el-dialog>
  </page-container>
</template>
  
  <script setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
import PageContainer from "@/components/PageContainer.vue";

const queryForm = reactive({ studentId: null });
const scores = ref([]);
const isAddDialogVisible = ref(false);
const isUpdateDialogVisible = ref(false);
const scoreForm = reactive({
  studentId: null,
  courseId: null,
  courseName: "",
  score: null,
});

const queryScores = () => {
  axios
    .get(`/api/scores/${queryForm.studentId}`)
    .then((response) => {
      averageScore.value = null;
      totalScore.value = null;
      if (
        !response.data ||
        (Array.isArray(response.data) && response.data.length === 0)
      ) {
        // 数据为空时的处理
        scores.value = []; // 确保清空之前的内容
        ElMessage.warning("暂无结果！");
      } else {
        // 数据存在时的处理
        scores.value = response.data;
        ElMessage.success("成绩查询成功！");
      }
    })
    .catch(() => {
      ElMessage.error("成绩查询失败，请检查学生 ID！");
    });
};

const deleteScores = () => {
  axios
    .delete(`/api/scores/${queryForm.studentId}`)
    .then(() => {
      scores.value = [];
      ElMessage.success("成绩删除成功！");
    })
    .catch(() => {
      ElMessage.error("成绩删除失败，请检查学生 ID！");
    });
};

const addScore = () => {
  axios
    .post(`/api/scores`, scoreForm)
    .then(() => {
      ElMessage.success("成绩添加成功！");
      isAddDialogVisible.value = false;
      queryScores();
    })
    .catch(() => {
      ElMessage.error("成绩添加失败！");
    });
};

const updateScore = () => {
  axios
    .put(`/api/scores`, scoreForm)
    .then(() => {
      ElMessage.success("成绩修改成功！");
      isUpdateDialogVisible.value = false;
      queryScores();
    })
    .catch(() => {
      ElMessage.error("成绩修改失败！");
    });
};

const onAddScore = () => {
  Object.assign(scoreForm, {
    studentId: null,
    courseId: null,
    courseName: "",
    score: null,
  });
  isAddDialogVisible.value = true;
};

const onUpdateScore = () => {
  if (!queryForm.studentId || scores.value.length === 0) {
    ElMessage.error("请先查询学生成绩后再进行修改操作！");
    return;
  }
  Object.assign(scoreForm, scores.value[0]); // 默认选择第一条成绩进行修改
  isUpdateDialogVisible.value = true;
};
const totalScore = ref(null);
const averageScore = ref(null);
const getTotalScore = () => {
  axios
    .get(`/api/students/${queryForm.studentId}/totalScore`)
    .then((response) => {
      totalScore.value = response.data;
      ElMessage.success("总分获取成功！");
    })
    .catch(() => {
      ElMessage.error("总分获取失败！");
    });
};
const getAverageScore = () => {
  axios
    .get(`/api/students/${queryForm.studentId}/averageScore`)
    .then((response) => {
      averageScore.value = response.data;
      ElMessage.success("平均分获取成功！");
    })
    .catch(() => {
      ElMessage.error("平均分获取失败！");
    });
};
</script>
  
<style scoped>
.boxBottom {
  float: right;
  margin: 18px 0;
}
p {
  margin-left: 10px;
  color: #909399;
  font-size: 15px;
}
</style>
  