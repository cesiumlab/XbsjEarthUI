<template>
  <Window
    :width="450"
    :height="300"
    @cancel="show=false"
    v-show="show"
    :footervisible="false"
  >
    <div class="xbsj-custom-top">
      <tabs value="name1">
        <!-- <TabPane label="标签一" name="name1">标签一的内容</TabPane>
        <TabPane label="标签二" name="name2">标签二的内容</TabPane>
        <TabPane label="标签三" name="name3">标签三的内容</TabPane> -->
      </tabs>
    </div>
  </Window>
</template>
<script>

export default {
  data() {
    return {
      show: false
    }
  }
}
</script>