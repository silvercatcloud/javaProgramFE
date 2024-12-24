<script setup>
import {
  Menu as IconMenu,
  Setting,
  Document
} from '@element-plus/icons-vue'
</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <el-col>
          <h5 class="mb-2">学生成绩管理后台</h5>
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            router
          >
            <el-menu-item index="/students">
              <el-icon><icon-menu /></el-icon>
              <span>学生查询</span>
            </el-menu-item>
            <el-menu-item index="/score">
              <el-icon><document /></el-icon>
              <span>成绩查询</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-aside>
      <el-container>
        <el-header></el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.mb-2{
font-size: 18px;
color:#333;
text-align: center;
}
</style>
