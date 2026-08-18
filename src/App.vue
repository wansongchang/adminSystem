<template>
  <div id="app">
    <router-view />
    <theme-picker />
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker"

export default {
  name: "App",
  components: { ThemePicker }
}
console.log('time', Date.now())
</script>
<style scoped>
#app .theme-picker {
  display: none;
}
</style>
