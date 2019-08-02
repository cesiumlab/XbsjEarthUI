<template>
  <div class="hu-color-picker" :class="{light: isLightTheme}" :style="{width: totalWidth + 'px'}">
    <div class="color-set">
      <div ref="saturation" class="saturation" @mousedown="selectSaturation">
        <canvas ref="canvasSaturation"/>
        <div :style="slideSaturationStyle" class="slide"/>
      </div>
      <div ref="hue" class="hue" @mousedown="selectHue">
        <canvas ref="canvasHue"/>
        <div :style="slideHueStyle" class="slide"/>
      </div>
      <div ref="alpha" class="alpha" @mousedown="selectAlpha">
        <canvas ref="canvasAlpha"/>
        <div :style="slideAlphaStyle" class="slide"/>
      </div>
    </div>
    <div :style="{height: selectedColorHeight + 'px'}" class="color-show">
      <div class="show">
        <canvas ref="canvasColor"/>
        <div :style="{background: rgba.toRgbaString()}" class="color"/>
      </div>
      <svg
        v-if="!suckerHide && !isSucking"
        :class="{active: isOpenSucker}"
        class="sucker"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-12 -12 48 48"
        @click="openSucker"
      >
        <path
          d="M13.1,8.2l5.6,5.6c0.4,0.4,0.5,1.1,0.1,1.5s-1.1,0.5-1.5,0.1c0,0-0.1,0-0.1-0.1l-1.4-1.4l-7.7,7.7C7.9,21.9,7.6,22,7.3,22H3.1C2.5,22,2,21.5,2,20.9l0,0v-4.2c0-0.3,0.1-0.6,0.3-0.8l5.8-5.8C8.5,9.7,9.2,9.6,9.7,10s0.5,1.1,0.1,1.5c0,0,0,0.1-0.1,0.1l-5.5,5.5v2.7h2.7l7.4-7.4L8.7,6.8c-0.5-0.4-0.5-1-0.1-1.5s1.1-0.5,1.5-0.1c0,0,0.1,0,0.1,0.1l1.4,1.4l3.5-3.5c1.6-1.6,4.1-1.6,5.8-0.1c1.6,1.6,1.6,4.1,0.1,5.8L20.9,9l-3.6,3.6c-0.4,0.4-1.1,0.5-1.5,0.1"
        ></path>
      </svg>
      <svg
        v-if="!suckerHide && isSucking"
        class="sucker"
        viewBox="-16 -16 68 68"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#9099a4"
      >
        <g fill="none" fill-rule="evenodd">
          <g transform="translate(1 1)" stroke-width="4">
            <circle stroke-opacity="0.5" cx="18" cy="18" r="18"></circle>
            <path d="M36 18c0-9.94-8.06-18-18-18">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="1s"
                repeatCount="indefinite"
              ></animateTransform>
            </path>
          </g>
        </g>
      </svg>
    </div>
    <div class="color-type">
      <div class="name">HEX</div>
      <input
        v-model="modelHex"
        :style="{width: totalWidth - 60 + 'px'}"
        class="value"
        @input="inputColor"
      >
    </div>
    <div class="color-type">
      <div class="name">RGBA</div>
      <input
        v-model="modelRgba"
        :style="{width: totalWidth - 60 + 'px'}"
        class="value"
        @input="inputColor"
      >
    </div>
    <!-- <div class="color-type">
            <div class="name">HSV</div>
            <div class="value">{{ `${[h, s, v].join(',')}` }}</div>
    </div>-->
    <ul class="colors">
      <li v-for="item in colorsDefault" :key="item" class="item" @click="selectColor(item)">
        <div :style="{background: `url(${imgAlphaBase64})`}" class="alpha"/>
        <div :style="{background: item}" class="color"/>
      </li>
    </ul>
    <ul v-if="colorsHistory.length" class="colors history">
      <li v-for="item in colorsHistory" :key="item" class="item" @click="selectColor(item)">
        <div :style="{background: `url(${imgAlphaBase64})`}" class="alpha"/>
        <div :style="{background: item}" class="color"/>
      </li>
    </ul>
    <!-- <button>取消</button>
    <button>确定</button>-->
  </div>
</template>

<script>
import imgSucker from "../../images/sucker.png";

export default {
  props: {
    color: {
      type: String,
      default: "#000000"
    },
    theme: {
      type: String,
      default: "dark"
    },
    suckerHide: {
      type: Boolean,
      default: true
    },
    suckerCanvas: {
      type: null, // HTMLCanvasElement
      default: null
    },
    suckerArea: {
      type: Array,
      default: () => []
    },
    colorsDefault: {
      type: Array,
      default: () => [
        "#000000",
        "#FFFFFF",
        "#FF1900",
        "#F47365",
        "#FFB243",
        "#FFE623",
        "#6EFF2A",
        "#1BC7B1",
        "#00BEFF",
        "#2E81FF",
        "#5D61FF",
        "#FF89CF",
        "#FC3CAD",
        "#BF3DCE",
        "#8E00A7",
        "rgba(0,0,0,0)"
      ]
    },
    colorsHistoryKey: {
      type: String,
      default: "vue-colorpicker-history"
    }
  },
  data() {
    return {
      slideSaturationStyle: {},
      slideHueStyle: {},
      slideAlphaStyle: {},
      hueWidth: 15,
      hueHeight: 152,
      alphaSize: 5,
      selectedColorHeight: 30,
      isOpenSucker: false, // 是否处于吸管状态
      suckerPreview: null, // 吸管旁边的预览颜色
      isSucking: false, // 是否处于吸管等待状态
      imgAlphaBase64: "", // 用来作背景的马赛克图片
      modelRgba: "",
      modelHex: "",
      r: 0,
      g: 0,
      b: 0,
      a: 1,
      h: 0,
      s: 0,
      v: 0,
      colorsHistory:
        JSON.parse(localStorage.getItem(this.colorsHistoryKey)) || [],
      colorSelected: "" // 改变了颜色才有值
    };
  },
  computed: {
    isLightTheme() {
      return this.theme === "light";
    },
    totalWidth() {
      return this.hueHeight + (this.hueWidth + 8) * 2;
    },
    rgba() {
      return {
        r: this.r,
        g: this.g,
        b: this.b,
        a: this.a,
        toRgbString: () => `rgb(${[this.r, this.g, this.b].join(",")})`,
        toRgbaStringShort: () =>
          `${[this.r, this.g, this.b, this.a].join(",")}`,
        toRgbaString: () => `rgba(${this.rgba.toRgbaStringShort()})`,
        toHexString: () => this.rgb2hex(this.rgba, true)
      };
    },
    hsv() {
      return {
        h: this.h,
        s: this.s,
        v: this.v
      };
    }
  },
  watch: {
    rgba() {
      this.$emit("changeColor", {
        rgba: this.rgba,
        hsv: this.hsv
      });
    },
    suckerCanvas(newVal) {
      this.isSucking = false;
      this.suckColor(newVal);
      newVal.style.cursor = `url(${imgSucker}) 0 32, default`;
    }
  },
  created() {
    this.setColorValue(this.color);
    this.setColorPos();
    this.modelHex = this.rgba.toHexString();
    this.modelRgba = this.rgba.toRgbaStringShort();
    this.imgAlphaBase64 = this.createAlphaSquare(4).toDataURL();
  },
  mounted() {
    this.renderHue(this.$refs.canvasHue, this.hueWidth, this.hueHeight);
    this.renderSaturation(
      this.$refs.canvasSaturation,
      this.rgba.toRgbString(),
      this.hueHeight
    );
    this.renderAlpha(
      this.$refs.canvasAlpha,
      this.hueWidth,
      this.hueHeight,
      this.alphaSize,
      this.rgba.toRgbString()
    );
    this.renderColor(
      this.$refs.canvasColor,
      this.totalWidth - this.selectedColorHeight,
      this.selectedColorHeight,
      this.alphaSize
    );
  },
  destroyed() {
    this.setcolorsHistory(this.colorSelected);
  },
  methods: {
    keydownHandler(e) {
      if (e.keyCode === 27) {
        // esc
        this.isOpenSucker = !this.isOpenSucker;
        this.isSucking = false;
        this.$emit("openSucker", this.isOpenSucker);
        document.removeEventListener("keydown", this.keydownHandler);
        document.removeEventListener("mousemove", this.mousemoveHandler);
        document.removeEventListener("mouseup", this.mousemoveHandler);
        if (this.suckerPreview) {
          document.body.removeChild(this.suckerPreview);
          this.suckerPreview = null;
        }
      }
    },
    mousemoveHandler(e) {
      const { clientX, clientY } = e;
      const {
        top: domTop,
        left: domLeft,
        width,
        height
      } = this.suckerCanvas.getBoundingClientRect();
      const x = clientX - domLeft;
      const y = clientY - domTop;
      const ctx = this.suckerCanvas.getContext("2d");
      const imgData = ctx.getImageData(
        Math.min(x, width - 1),
        Math.min(y, height - 1),
        1,
        1
      );
      let [r, g, b, a] = imgData.data;
      a = parseFloat((a / 255).toFixed(2));
      const style = this.suckerPreview.style;
      Object.assign(style, {
        position: "absolute",
        left: clientX + 20 + "px",
        top: clientY - 36 + "px",
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        border: "2px solid #fff",
        boxShadow: "0 0 8px 0 rgba(0, 0, 0, 0.16)",
        background: `rgba(${[r, g, b, a].join(",")})`,
        zIndex: 95 // 吸管的小圆圈预览色的层级不能超过颜色选择器
      });
      if (
        clientX >= this.suckerArea[0] &&
        clientY >= this.suckerArea[1] &&
        clientX <= this.suckerArea[2] &&
        clientY <= this.suckerArea[3]
      ) {
        style.display = "";
      } else {
        style.display = "none";
      }
    },
    openSucker() {
      // 和上面的代码一样，所以直接调用同一个方法
      this.keydownHandler({ keyCode: 27 });

      if (this.isOpenSucker) {
        this.isSucking = true;
        document.addEventListener("keydown", this.keydownHandler);
      }
    },
    inputColor(e) {
      this.setColorValue(e.target.value);
      this.setColorPos();
      this.renderSaturation(
        this.$refs.canvasSaturation,
        this.rgba.toRgbString(),
        this.hueHeight
      );
      this.renderAlpha(
        this.$refs.canvasAlpha,
        this.hueWidth,
        this.hueHeight,
        this.alphaSize,
        this.rgba.toRgbString()
      );
      this.colorSelected = this.rgba.toRgbaString();
    },
    setcolorsHistory(color) {
      if (!color) {
        return;
      }
      const colors = this.colorsHistory;
      const index = colors.indexOf(color);
      if (index >= 0) {
        colors.splice(index, 1);
      }
      if (colors.length >= 8) {
        colors.length = 7;
      }
      colors.unshift(color);
      this.colorsHistory = colors;
      localStorage.setItem(this.colorsHistoryKey, JSON.stringify(colors));
    },
    setColorValue(color) {
      let rgba = { r: 0, g: 0, b: 0, a: 1 };
      if (/#/.test(color)) {
        rgba = this.hex2rgba(color);
      } else if (/rgb/.test(color)) {
        rgba = this.rgb2rgba(color);
      } else if (Object.prototype.toString.call(color) === "[object Object]") {
        rgba = color;
      }
      const { r, g, b, a } = rgba;
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a || a === 0 ? a : 1;
      const { h, s, v } = this.rgb2hsv(this.rgba);
      this.h = h;
      this.s = s;
      this.v = v;
    },
    setColorPos() {
      this.slideSaturationStyle = {
        left: this.s * this.hueHeight - 5 + "px",
        top: (1 - this.v) * this.hueHeight - 5 + "px"
      };
      this.slideHueStyle = {
        top: (1 - this.h / 360) * this.hueHeight - 2 + "px"
      };
      this.slideAlphaStyle = {
        top: this.a * this.hueHeight - 2 + "px"
      };
    },
    selectColor(color) {
      this.setColorValue(color);
      this.setColorPos();
      this.renderSaturation(
        this.$refs.canvasSaturation,
        this.rgba.toRgbString(),
        this.hueHeight
      );
      this.renderAlpha(
        this.$refs.canvasAlpha,
        this.hueWidth,
        this.hueHeight,
        this.alphaSize,
        this.rgba.toRgbString()
      );
      this.modelHex = this.rgba.toHexString();
      this.modelRgba = this.rgba.toRgbaStringShort();
      this.colorSelected = this.rgba.toRgbaString();
    },
    selectSaturation(e) {
      e.preventDefault();
      e.stopPropagation();
      const {
        top: saturationTop,
        left: saturationLeft
      } = this.$refs.saturation.getBoundingClientRect();
      const ctx = e.target.getContext("2d");

      const mousemove = e => {
        let x = e.clientX - saturationLeft;
        let y = e.clientY - saturationTop;

        if (x < 0) {
          x = 0;
        }
        if (y < 0) {
          y = 0;
        }
        if (x > this.hueHeight) {
          x = this.hueHeight;
        }
        if (y > this.hueHeight) {
          y = this.hueHeight;
        }

        this.slideSaturationStyle = {
          left: x - 5 + "px",
          top: y - 5 + "px"
        };
        // 如果用最大值，选择的像素会是空的，空的默认是黑色
        const imgData = ctx.getImageData(
          Math.min(x, this.hueHeight - 1),
          Math.min(y, this.hueHeight - 1),
          1,
          1
        );
        const [r, g, b] = imgData.data;
        this.setColorValue({ r, g, b });
        this.renderAlpha(
          this.$refs.canvasAlpha,
          this.hueWidth,
          this.hueHeight,
          this.alphaSize,
          this.rgba.toRgbString()
        );
        this.modelHex = this.rgba.toHexString();
        this.modelRgba = this.rgba.toRgbaStringShort();
      };

      mousemove(e);

      const mouseup = () => {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
        this.colorSelected = this.rgba.toRgbaString();
      };

      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    },
    selectHue(e) {
      e.preventDefault();
      e.stopPropagation();
      const { top: hueTop } = this.$refs.hue.getBoundingClientRect();
      const ctx = e.target.getContext("2d");

      const mousemove = e => {
        let y = e.clientY - hueTop;

        if (y < 0) {
          y = 0;
        }
        if (y > this.hueHeight) {
          y = this.hueHeight;
        }

        this.slideHueStyle = {
          top: y - 2 + "px"
        };
        this.slideSaturationStyle = {
          left: this.hueHeight - 5 + "px",
          top: 0 - 5 + "px"
        };
        // 如果用最大值，选择的像素会是空的，空的默认是黑色
        const imgData = ctx.getImageData(
          0,
          Math.min(y, this.hueHeight - 1),
          1,
          1
        );
        const [r, g, b] = imgData.data;
        this.setColorValue({ r, g, b });
        this.renderSaturation(
          this.$refs.canvasSaturation,
          this.rgba.toRgbString(),
          this.hueHeight
        );
        this.renderAlpha(
          this.$refs.canvasAlpha,
          this.hueWidth,
          this.hueHeight,
          this.alphaSize,
          this.rgba.toRgbString()
        );
        this.modelHex = this.rgba.toHexString();
        this.modelRgba = this.rgba.toRgbaStringShort();
        this.colorSelected = this.rgba.toRgbaString();
      };

      mousemove(e);

      const mouseup = () => {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
      };

      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    },
    selectAlpha(e) {
      e.preventDefault();
      e.stopPropagation();
      const { top: hueTop } = this.$refs.alpha.getBoundingClientRect();

      const mousemove = e => {
        let y = e.clientY - hueTop;

        if (y < 0) {
          y = 0;
        }
        if (y > this.hueHeight) {
          y = this.hueHeight;
        }

        this.slideAlphaStyle = {
          top: y - 2 + "px"
        };

        this.a = parseFloat((y / this.hueHeight).toFixed(2));
        this.modelHex = this.rgba.toHexString();
        this.modelRgba = this.rgba.toRgbaStringShort();
        this.colorSelected = this.rgba.toRgbaString();
      };

      mousemove(e);

      const mouseup = () => {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
      };

      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    },
    suckColor(dom) {
      if (dom && dom.tagName !== "CANVAS") {
        return;
      }

      this.suckerPreview = document.createElement("div");
      document.body.appendChild(this.suckerPreview);

      document.addEventListener("mousemove", this.mousemoveHandler);
      document.addEventListener("mouseup", this.mousemoveHandler);

      dom.addEventListener("click", e => {
        const { clientX, clientY } = e;
        const { top, left, width, height } = dom.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;
        const ctx = dom.getContext("2d");
        const imgData = ctx.getImageData(
          Math.min(x, width - 1),
          Math.min(y, height - 1),
          1,
          1
        );
        let [r, g, b, a] = imgData.data;
        a = parseFloat((a / 255).toFixed(2));
        this.setColorValue({ r, g, b, a });
        this.setColorPos();
        this.renderSaturation(
          this.$refs.canvasSaturation,
          this.rgba.toRgbString(),
          this.hueHeight
        );
        this.renderAlpha(
          this.$refs.canvasAlpha,
          this.hueWidth,
          this.hueHeight,
          this.alphaSize,
          this.rgba.toRgbString()
        );
        this.modelHex = this.rgba.toHexString();
        this.modelRgba = this.rgba.toRgbaStringShort();
        this.colorSelected = this.rgba.toRgbaString();
      });
    },
    renderSaturation(canvas, color, size) {
      const ctx = canvas.getContext("2d");
      canvas.width = size;
      canvas.height = size;

      ctx.fillStyle = color;
      ctx.fillRect(0, 0, size, size);

      this.createLinearGradient(
        "l",
        ctx,
        size,
        size,
        "#FFFFFF",
        "rgba(255,255,255,0)"
      );
      this.createLinearGradient(
        "p",
        ctx,
        size,
        size,
        "rgba(0,0,0,0)",
        "#000000"
      );
    },
    renderHue(canvas, width, height) {
      const ctx = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#FF0000"); // 红
      gradient.addColorStop(0.17 * 1, "#FF00FF"); // 紫
      gradient.addColorStop(0.17 * 2, "#0000FF"); // 蓝
      gradient.addColorStop(0.17 * 3, "#00FFFF"); // 青
      gradient.addColorStop(0.17 * 4, "#00FF00"); // 绿
      gradient.addColorStop(0.17 * 5, "#FFFF00"); // 黄
      gradient.addColorStop(1, "#FF0000"); // 红
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    },
    renderAlpha(canvas, width, height, size, color) {
      const canvasSquare = this.createAlphaSquare(size);

      const ctx = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = ctx.createPattern(canvasSquare, "repeat");
      ctx.fillRect(0, 0, width, height);

      this.createLinearGradient(
        "p",
        ctx,
        width,
        height,
        "rgba(255,255,255,0)",
        color
      );
    },
    renderColor(canvas, width, height, size) {
      const canvasSquare = this.createAlphaSquare(size);

      const ctx = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = ctx.createPattern(canvasSquare, "repeat");
      ctx.fillRect(0, 0, width, height);
    },
    createAlphaSquare(size) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const doubleSize = size * 2;
      canvas.width = doubleSize;
      canvas.height = doubleSize;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, doubleSize, doubleSize);
      ctx.fillStyle = "#ccd5db";
      ctx.fillRect(0, 0, size, size);
      ctx.fillRect(size, size, size, size);

      return canvas;
    },
    createLinearGradient(direction, ctx, width, height, color1, color2) {
      // l 横向 p 纵向
      const isL = direction === "l";
      const gradient = ctx.createLinearGradient(
        0,
        0,
        isL ? width : 0,
        isL ? 0 : height
      );
      gradient.addColorStop(0.01, color1);
      gradient.addColorStop(0.99, color2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    },
    rgb2hex({ r, g, b }, toUpper) {
      const change = val => ("0" + Number(val).toString(16)).slice(-2);
      const color = `#${change(r)}${change(g)}${change(b)}`;
      return toUpper ? color.toUpperCase() : color;
    },
    hex2rgba(hex) {
      hex = hex.slice(1);
      const change = val => parseInt(val, 16) || 0; // 避免NaN的情况
      return {
        r: change(hex.slice(0, 2)),
        g: change(hex.slice(2, 4)),
        b: change(hex.slice(4, 6)),
        a: 1
      };
    },
    rgb2rgba(rgba) {
      if (typeof rgba === "string") {
        rgba = (/rgba?\((.*?)\)/.exec(rgba) || ["", "0,0,0,1"])[1].split(",");
        return {
          r: Number(rgba[0]) || 0,
          g: Number(rgba[1]) || 0,
          b: Number(rgba[2]) || 0,
          a: Number(rgba[3] ? rgba[3] : 1) // 避免为0的情况
        };
      } else {
        return rgba;
      }
    },
    rgb2hsv({ r, g, b }) {
      r = r / 255;
      g = g / 255;
      b = b / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      let h = 0;
      if (max === min) {
        h = 0;
      } else if (max === r) {
        if (g >= b) {
          h = (60 * (g - b)) / delta;
        } else {
          h = (60 * (g - b)) / delta + 360;
        }
      } else if (max === g) {
        h = (60 * (b - r)) / delta + 120;
      } else if (max === b) {
        h = (60 * (r - g)) / delta + 240;
      }
      h = Math.floor(h);
      let s = parseFloat((max === 0 ? 0 : 1 - min / max).toFixed(2));
      let v = parseFloat(max.toFixed(2));
      return { h, s, v };
    }
  }
};
</script>

<style lang="scss" scoped>
.hu-color-picker {
  padding: 0px;
  background: #1d2024;
  border-radius: 4px;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.16);
  z-index: 1;
  &.light {
    background: #f7f8f9;
    .color-show {
      .sucker {
        background: #eceef0;
      }
    }
    .color-type {
      .name {
        background: #e7e8e9;
      }
      .value {
        color: #666;
        background: #eceef0;
      }
    }
    .colors.history {
      border-top: 1px solid #eee;
    }
  }
  canvas {
    vertical-align: top;
  }
  .color-set {
    display: flex;
    .saturation {
      position: relative;
      cursor: pointer;
      .slide {
        position: absolute;
        left: 100px;
        top: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 1px solid #fff;
        box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.3);
        pointer-events: none;
      }
    }
    .hue {
      position: relative;
      margin-left: 8px;
      cursor: pointer;
      .slide {
        position: absolute;
        left: 0;
        top: 100px;
        width: 100%;
        height: 4px;
        background: #fff;
        box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3);
        pointer-events: none;
      }
    }
    .alpha {
      position: relative;
      margin-left: 8px;
      cursor: pointer;
      .slide {
        position: absolute;
        left: 0;
        top: 100px;
        width: 100%;
        height: 4px;
        background: #fff;
        box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3);
        pointer-events: none;
      }
    }
  }
  .color-show {
    margin-top: 8px;
    display: flex;
    .show {
      position: relative;
      flex: 1;
      .color {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .sucker {
      width: 30px;
      fill: #9099a4;
      background: #2e333a;
      cursor: pointer;
      transition: all 0.3s;
      &:hover,
      &.active {
        fill: #1593ff;
      }
    }
  }
  .color-type {
    margin-top: 8px;
    font-size: 12px;
    .name {
      width: 60px;
      height: 30px;
      float: left;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #999;
      background: #252930;
    }
    .value {
      height: 30px;
      padding: 0 12px;
      border: 0;
      color: #fff;
      background: #2e333a;
      box-sizing: border-box;
    }
  }
  .colors {
    padding: 0;
    margin: 0;
    &.history {
      margin-top: 10px;
      border-top: 1px solid #2e333a;
    }
    .item {
      position: relative;
      width: 16px;
      height: 16px;
      margin: 10px 0 0 10px;
      border-radius: 3px;
      box-sizing: border-box;
      vertical-align: top;
      display: inline-block;
      transition: all 0.1s;
      cursor: pointer;
      &:nth-child(8n + 1) {
        margin-left: 0;
      }
      &:hover {
        transform: scale(1.4);
      }
      .alpha {
        height: 100%;
        border-radius: 4px; // 大一像素，否则四个角会看到白点
      }
      .color {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 3px;
      }
    }
  }
}
</style>
