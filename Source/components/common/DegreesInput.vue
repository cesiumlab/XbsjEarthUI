<template>
  <input v-model.number="degreesValue" :disabled="disabled">
</template>

<script>
function vtxfEqual(left, right) {
  return Cesium.Math.equalsEpsilon(left, right, Cesium.Math.EPSILON7);
}

export default {
  props: ["value", "disabled"],
  data() {
    return {
      degreesValue: Cesium.Math.toDegrees(this.value)
    };
  },
  watch: {
    value(v) {
      const d = Cesium.Math.toDegrees(v);
      if (!vtxfEqual(d, this.degreesValue)) {
        // 懒惰显示，避免界面元素突然变化
        this.degreesValue = d;
      }
    },
    degreesValue(v) {
      const r = Cesium.Math.toRadians(v);
      if (!vtxfEqual(r, this.value)) {
        this.$emit("input", r);
      }
    }
  }
};
</script>
<style scoped>
input {
  display: inline-block;
  background-color: rgba(0, 0, 0, 0.5);
  color: #ccc;
  border: none;
  padding: 3px 5px;
  font-weight: bold;
  width: 180px;
}
input:disabled {
  background-color: #f3f3f3;
  opacity: 1;
  cursor: not-allowed;
  color: #ccc;
}
</style>