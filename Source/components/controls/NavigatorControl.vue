<template>
  <div
    v-show="show"
    :style="style"
  ></div>
</template>

<script>
export default {
  data: function() {
    return {
      show: true,
      left: undefined,
      top: 20,
      right: 20,
      bottom: undefined,
    };
  },
  computed: {
      style: function () {
          return {
            width: 100 + 'px',
            height: 100 + 'px',
            background: 'grey',
            position: 'absolute',
            left: typeof this.left === 'undefined' ? undefined : this.left + 'px',
            top: typeof this.top === 'undefined' ? undefined : this.top + 'px',
            right: typeof this.right === 'undefined' ? undefined : this.right + 'px',
            bottom: typeof this.bottom === 'undefined' ? undefined : this.bottom + 'px',
          }
      },
  }
};
</script>

<style>
</style>
