<template>
  <div>
    <input
      class="inputstyle"
      type="text"
      @keyup.enter="handleEnter"
      @blur="handleBlur"
      :autofocus="autofocus"
      :value="currentValue"
      ref="input"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  watch: {
    value(val) {
      this.setCurrentValue(val);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.input.focus();
    });
  },
  methods: {
    setCurrentValue(val) {
      this.$emit("input", val);
    },
    handleEnter(event) {
      this.$emit("on-enter", event);
    },
    handleBlur(event) {
      this.$emit("on-blur", event);
    }
  }
};
</script> 

<style scoped>
.inputstyle {
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  padding-left: 5px;
}
.inputstyle:focus {
  outline: 1px solid rgba(31, 255, 255, 1);
}
</style>