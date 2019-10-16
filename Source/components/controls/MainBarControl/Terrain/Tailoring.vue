<template>
  <div class="xbsj-mainbar-popup popup" ref="tailoring">
    <div class="row">
      <div>
        <button :class="{coloron:creating}" @click="creating = !creating">{{lang.redraw}}</button>
        <button
          :class="{coloron:editing,notallowe:positions.length<6}"
          @click="editing = !editing"
        >{{lang.edit}}</button>
      </div>
      <div class="tailoringrow">
        <label class="tailoringlabel">{{lang.borehole}}:</label>
        <XbsjSwitch v-model="innerDiscard" :value="innerDiscard"></XbsjSwitch>
      </div>
    </div>
  </div>
</template>

<script>
import languagejs from "./index_locale";
export default {
  data() {
    return {
      langs: languagejs,
      innerDiscard: false,
      creating: false,
      editing: false,
      positions: []
    };
  },
  mounted() {
    this.bind("innerDiscard");
    this.bind("creating");
    this.bind("editing");
    this.bind("positions");
    console.log(this.positions);
  },
  methods: {
    bind(prp) {
      this._viewUnbinds = this._viewUnbinds || [];
      this._viewUnbinds.push(
        XE.MVVM.bind(this, prp, this.$root.$earth.terrainEffect.restrict, prp)
      );
    }
  },
  beforeDestroy() {
    this._viewUnbinds.forEach(u => u());
    this._viewUnbinds.length = 0;
  }
};
</script>


<style scoped>
.notallowe {
  cursor: not-allowed;
  background-color: #777777 !important;
  pointer-events: none;
}
.coloron {
  color: #1fffff !important;
}
.popup {
  width: 347px;
  height: 128px;
}
.popup button {
  height: 28px;
  border: 1px solid #666666;
  background-color: rgba(0, 0, 0, 0.5);
  color: #dddddd;
  margin-bottom: 10px;
  width: 70px;
  border-radius: 5px;
  cursor: pointer;
}
.label {
  display: inline-block;
  width: 30px;
  text-align: right;
}
.ramp {
  display: inline-block;
}
.row {
  margin-bottom: 4px;
  margin-bottom: 4px;
}
.tailoringrow {
  margin-top: 10px;
}
.tailoringlabel {
  display: inline-block;
  /* width: 60px; */
  text-align: right;
  margin-right: 5px;
  vertical-align: top;
  line-height: 29px;
}
</style>