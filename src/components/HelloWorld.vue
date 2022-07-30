<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VS Code</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>See <code>README.md</code> for more information.</p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank"> Vite Docs </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
  </p>

  <el-button type="button" @click="count++">count is: {{ count }}</el-button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
  <el-select v-model="selectVal">
    <el-option
      v-for="item in selectOptions"
      :key="item.id"
      :value="item.value"
      :label="item.label"
    />
  </el-select>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectVal = ref('')
const selectOptions = [
  { value: 0, label: 'n0', id: 0 },
  { value: 1, label: 'n1', id: 1 },
  { value: 2, label: 'n2', id: 2 },
  { value: 3, label: 'n3', id: 3 },
  { value: 4, label: 'n4', id: 4 }
]

defineProps<{ msg: string }>()
const count = ref(0)
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
