<template>
  <div v-show="show" class="timelineBox">
    <button class="left" @click="setStart()"></button>
    <button class="right" @click="setStop()"></button>
    <div ref="timelineContainer" class="cesium-viewer-timelineContainer">
      <div ref="topDiv" class="cesium-timeline-main">
        <span
          class="startAndStop"
          :style="{left:startPosition-1+'px'}"
          v-show="clockRange=='UNBOUNDED'"
        ></span>
        <span
          class="startAndStop"
          :style="{left:stopPosition+1+'px'}"
          v-show="clockRange=='UNBOUNDED'"
        ></span>
        <div ref="bar" class="cesium-timeline-bar">
          <div>
            <span
              class="cesium-timeline-ticTiny"
              v-for="ticTiny in ticTinys"
              :key="ticTiny+Math.random()"
              :style="{left: ticTiny+'px'}"
            ></span>
          </div>
          <div>
            <span
              class="cesium-timeline-ticSub"
              v-for="ticSub in ticSubs"
              :key="ticSub+Math.random()"
              :style="{left: ticSub+'px'}"
            ></span>
          </div>
          <div>
            <span
              class="cesium-timeline-ticMain"
              v-for="ticMain in ticMains"
              :key="ticMain+Math.random()"
              :style="{left: ticMain+'px'}"
            ></span>
          </div>
          <div>
            <span
              class="cesium-timeline-ticLabel"
              v-for="ticLabel in ticLabels"
              :key="ticLabel[1]"
              :style="{left: ticLabel[0]+'px'}"
            >{{ticLabel[1]}}</span>
          </div>
          <span
            class="cesium-timeline-icon16"
            :style="{left: icon16+'px'}"
            style="bottom:0;background-position: 0 0;"
          ></span>
        </div>
        <div ref="trackContainer" class="cesium-timeline-trackContainer">
          <canvas ref="track" class="cesium-timeline-tracks" width="10" height="1"></canvas>
        </div>
        <div ref="needle" class="cesium-timeline-needle"></div>
        <span ref="ruler" class="cesium-timeline-ruler"></span>
      </div>
    </div>

    <div class="animationBox">
      <div>
        <button
          class="clockstepbutton"
          :class="{clockstepbuttonactive:clockStep == 'SYSTEM_CLOCK'}"
          @click="multiplier=1; clockStep = 'SYSTEM_CLOCK'"
        ></button>
      </div>
      <div ref="animation" class="animationContainer">
        <div style="position:relative;width:152px;margin-left:20px;">
          <span class="sliderline" @click="multiplier=0"></span>
          <span class="sliderreduce" @click="multiplier--">-</span>
          <span class="slideradd" @click="multiplier++">+</span>
          <XbsjSlider
            :min="-6.648"
            :max="6.648"
            :step="0.01"
            :show-tip="showTip"
            v-model.number="multiplierScale"
            @on-input="changeMultiplier(multiplierScale)"
          ></XbsjSlider>
        </div>
        <span
          style="display:inline-block;width:64px;line-height:32px;margin-left:6px;"
        >{{multiplier}}x</span>
        <div class="backbtn" :class="{backbtnactive:status=='backPlay'}" @click="backPlay()">
          <span></span>
        </div>
        <div class="suspendbtn" :class="{suspendbtnactive:status=='pause'}" @click="pause()">
          <span></span>
        </div>
        <div class="playbtn" :class="{playbtnactive:status=='play'}" @click="play()">
          <span></span>
        </div>
        <span style="display:inline-block;line-height:32px;margin-left:20px;">{{currentString}}</span>
      </div>
      <div class="button-group">
        <button v-show="clockRange=='LOOP_STOP'" class="loop" @click="clampedClick"></button>
        <button v-show="clockRange=='CLAMPED'" class="clamped" @click="unboundedClick"></button>
        <button v-show="clockRange=='UNBOUNDED'" class="unbounded" @click="loopClick"></button>
      </div>
    </div>
  </div>
</template>

<script>
Date.prototype.format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }

  return fmt;
};
let [
  ClockRange,
  defined,
  destroyObject,
  DeveloperError,
  JulianDate,
  getElement,
  TimelineHighlightRange,
  TimelineTrack
] = [
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined
];

var timelineWheelDelta = 1e12;

var timelineMouseMode = {
  none: 0,
  scrub: 1,
  slide: 2,
  zoom: 3,
  touchOnly: 4
};
var timelineTouchMode = {
  none: 0,
  scrub: 1,
  slideZoom: 2,
  singleTap: 3,
  ignore: 4
};

var timelineTicScales = [
  0.001,
  0.002,
  0.005,
  0.01,
  0.02,
  0.05,
  0.1,
  0.25,
  0.5,
  1.0,
  2.0,
  5.0,
  10.0,
  15.0,
  30.0,
  60.0, // 1min
  120.0, // 2min
  300.0, // 5min
  600.0, // 10min
  900.0, // 15min
  1800.0, // 30min
  3600.0, // 1hr
  7200.0, // 2hr
  14400.0, // 4hr
  21600.0, // 6hr
  43200.0, // 12hr
  86400.0, // 24hr
  172800.0, // 2days
  345600.0, // 4days
  604800.0, // 7days
  1296000.0, // 15days
  2592000.0, // 30days
  5184000.0, // 60days
  7776000.0, // 90days
  15552000.0, // 180days
  31536000.0, // 365days
  63072000.0, // 2years
  126144000.0, // 4years
  157680000.0, // 5years
  315360000.0, // 10years
  630720000.0, // 20years
  1261440000.0, // 40years
  1576800000.0, // 50years
  3153600000.0, // 100years
  6307200000.0, // 200years
  12614400000.0, // 400years
  15768000000.0, // 500years
  31536000000.0 // 1000years
];

//var timelineMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let timelineMonthNames = [
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二"
];

export default {
  data() {
    return {
      show: true,
      showTip: "never",
      start: "",
      current: "",
      stop: "",
      //_storeStatus: undefined,

      shouldAnimate: true,
      multiplier: 1,
      multiplierScale: 3,
      showType: "local",
      clockRange: "",
      clockStep: "",
      startTime: { dayNumber: 2440587, secondsOfDay: 43210 },
      stopTime: { dayNumber: 2440587, secondsOfDay: 43210 },
      currentTime: { dayNumber: 2440587, secondsOfDay: 43210 },

      storeStart: { dayNumber: 2440587, secondsOfDay: 43210 },
      storeStop: { dayNumber: 2440587, secondsOfDay: 43210 },
      ticTinys: [],
      ticSubs: [],
      ticMains: [],
      ticLabels: [],
      icon16: "",

      startPosition: 0,
      stopPosition: 0,
      langs: {
        zh: {
          loop: "时间段内无限循环",
          clamped: "时间段内循环一次",
          unbounded: "无限制循环"
        },
        eb: {
          loop: "Infinite cycle in time period",
          clamped: "Once in a time period",
          unbounded: "Unlimited circulation"
        }
      },
      lang: undefined
    };
  },
  created() {
    this._timezoom = new Date().getTimezoneOffset() / 60;
  },
  mounted() {
    this._earth = this.$root.$earth;
    this._clock = this._earth.clock;

    this.startTime = Cesium.JulianDate.fromDate(new Date());
    this.stopTime = Cesium.JulianDate.addHours(
      this.startTime,
      1,
      new Cesium.JulianDate()
    );
    this.currentTime = Cesium.JulianDate.clone(
      this.startTime,
      new Cesium.JulianDate()
    );

    //下面是从timeLine.js挪过来的代码
    this.smallestTicInPixels = 7.0;
    [
      ClockRange,
      defined,
      destroyObject,
      DeveloperError,
      JulianDate,
      getElement,
      TimelineHighlightRange,
      TimelineTrack
    ] = [
      Cesium.ClockRange,
      Cesium.defined,
      Cesium.destroyObject,
      Cesium.DeveloperError,
      Cesium.JulianDate,
      Cesium.getElement,
      Cesium.TimelineHighlightRange,
      Cesium.TimelineTrack
    ];

    this.container = this.$refs.timelineContainer;

    this._topDiv = this.$refs.topDiv;

    this._endJulian = undefined;
    this._epochJulian = undefined;
    this._lastXPos = undefined;
    this._scrubElement = undefined;
    this._startJulian = new Cesium.JulianDate();
    this._timeBarSecondsSpan = undefined;
    this._scrubJulian = JulianDate.clone(
      this._clock.currentTime,
      this._scrubJulian
    );
    this._mainTicSpan = -1;
    this._mouseMode = timelineMouseMode.none;
    this._touchMode = timelineTouchMode.none;
    this._touchState = {
      centerX: 0,
      spanX: 0
    };
    this._mouseX = 0;
    this._timelineDrag = 0;
    this._timelineDragLocation = undefined;
    this._lastHeight = undefined;
    this._lastWidth = undefined;

    // this._topDiv.innerHTML = '<div class="cesium-timeline-bar"></div><div class="cesium-timeline-trackContainer">' +
    //                             '<canvas class="cesium-timeline-tracks" width="10" height="1">' +
    //                             '</canvas></div><div class="cesium-timeline-needle"></div><span class="cesium-timeline-ruler"></span>';
    this._timeBarEle = this.$refs.bar; //this._topDiv.childNodes[0];
    this._trackContainer = this.$refs.trackContainer; //this._topDiv.childNodes[1];
    this._trackListEle = this.$refs.track; //this._topDiv.childNodes[1].childNodes[0];
    this._needleEle = this.$refs.needle; //this._topDiv.childNodes[2];
    this._rulerEle = this.$refs.ruler; //this._topDiv.childNodes[3];
    this._context = this._trackListEle.getContext("2d");

    this._trackList = [];
    this._highlightRanges = [];

    this.zoomTo(this._clock.startTime, this._clock.stopTime);

    this._onMouseDown = createMouseDownCallback(this);
    this._onMouseUp = createMouseUpCallback(this);
    this._onMouseMove = createMouseMoveCallback(this);
    this._onMouseWheel = createMouseWheelCallback(this);
    this._onTouchStart = createTouchStartCallback(this);
    this._onTouchMove = createTouchMoveCallback(this);
    this._onTouchEnd = createTouchEndCallback(this);

    var timeBarEle = this._timeBarEle;
    document.addEventListener("mouseup", this._onMouseUp, false);
    document.addEventListener("mousemove", this._onMouseMove, false);
    timeBarEle.addEventListener("mousedown", this._onMouseDown, false);
    timeBarEle.addEventListener("DOMMouseScroll", this._onMouseWheel, false); // Mozilla mouse wheel
    timeBarEle.addEventListener("mousewheel", this._onMouseWheel, false);
    timeBarEle.addEventListener("touchstart", this._onTouchStart, false);
    timeBarEle.addEventListener("touchmove", this._onTouchMove, false);
    timeBarEle.addEventListener("touchend", this._onTouchEnd, false);
    timeBarEle.addEventListener("touchcancel", this._onTouchEnd, false);
    this._topDiv.addEventListener(
      "settime",
      this.onTimelineScrubfunction,
      false
    );

    this._topDiv.oncontextmenu = function() {
      return false;
    };

    this._resize = this.resize.bind(this);
    window.addEventListener("resize", this._resize);
    this.updateFromClock();

    let map = [
      "startTime",
      "stopTime",
      "currentTime",
      "shouldAnimate",
      "multiplier",
      "showType",
      "clockRange",
      "clockStep"
    ];
    this._unbind = map.map(e => {
      return XE.MVVM.bind(this, e, this._clock, e);
    });
  },
  methods: {
    changeMultiplier(val) {
      let value = Math.abs(val);

      this.unchangeMultiplier = true;
      this.multiplier = (
        //(value % 1.0 == 0 ? 0.1 : value % 1.0) * Math.pow(10, Math.floor(value))
        (value % 1.0 == 0 ? 0.1 : value % 1.0 + 0.11) * Math.pow(10, Math.floor(value))
      ).toFixed(2);
      if (val < 0) {
        this.multiplier = -this.multiplier;
      }
      setTimeout( ()=>{
        this.unchangeMultiplier = false;
      },20)
    },
    setStart() {
      //将当前时间设置为timeline的起始时间
      this.startTime = Cesium.JulianDate.clone(
        this.currentTime,
        this.startTime
      );
      this.currentTime = Cesium.JulianDate.addSeconds(
        this.currentTime,
        0.001,
        this.currentTime
      );
    },
    setStop() {
      this.stopTime = Cesium.JulianDate.clone(this.currentTime, this.stopTime);
      this.currentTime = Cesium.JulianDate.addSeconds(
        this.currentTime,
        0.001,
        this.currentTime
      );
    },
    loopClick() {
      this.clockRange = "LOOP_STOP";
      this.$root.$earthUI.promptInfo(this.lang.loop);
    },
    unboundedClick() {
      this.clockRange = "UNBOUNDED";
      this.$root.$earthUI.promptInfo(this.lang.unbounded);
    },
    clampedClick() {
      this.clockRange = "CLAMPED";
      this.$root.$earthUI.promptInfo(this.lang.clamped);
    },
    changeStart(str) {
      if (new Date(str).getTime() < new Date(this.stop).getTime()) {
        Cesium.JulianDate.fromDate(new Date(str), this.startTime);
      } else {
        console.log("开始时间必须小于结束时间");
      }
    },
    changeCurrent(str) {
      if (
        new Date(str).getTime() < new Date(this.stop).getTime() &&
        new Date(str).getTime() > new Date(this.start).getTime()
      ) {
        Cesium.JulianDate.fromDate(new Date(str), this.currentTime);
      } else {
        console.log("当前时间必须小于结束时间并且大于开始时间");
      }
    },
    changeStop(str) {
      if (new Date(str).getTime() > new Date(this.start).getTime()) {
        Cesium.JulianDate.fromDate(new Date(str), this.stopTime);
      } else {
        console.log("结束时间必须大于开始时间");
      }
    },
    normalPlay() {
      // this.shouldAnimate = true;
      // this.multiplier = 1;
      this.clockStep = "SYSTEM_CLOCK";
    },
    backPlay() {
      this.shouldAnimate = true;
      this.multiplier = -Math.abs(this.multiplier);
      this.clockStep = "SYSTEM_CLOCK_MULTIPLIER";
    },
    pause() {
      this.shouldAnimate = false;
      this.clockStep = "SYSTEM_CLOCK_MULTIPLIER";
    },
    play() {
      this.shouldAnimate = true;
      this.multiplier = Math.abs(this.multiplier);
      this.clockStep = "SYSTEM_CLOCK_MULTIPLIER";
    },
    // setCurrent(){

    //     let value = this.$refs.now.value;
    //     let startTimestamp = (Cesium.JulianDate.toDate( this.startTime)).getTime();
    //     let stopTimestamp = (Cesium.JulianDate.toDate( this.stopTime)).getTime();
    //     let currentTimestamp = startTimestamp + (stopTimestamp - startTimestamp) * Number(value);
    //     //clock.setCurrentTime(new Date( currentTimestamp));
    //     Cesium.JulianDate.fromDate( new Date( currentTimestamp), this.currentTime);
    //     //Cesium.JulianDate.fromDate( new Date(this._currentTimestamp), clock.currentTime);
    // },
    changeShowType() {
      //展示UTC/当地时间
      this.showType = this.showType == "local" ? "UTC" : "local";
      //派发事件给TimelineControl
    },
    getDateFromJulian(julian, showType) {
      if (showType == "local") {
        return Cesium.JulianDate.toDate(julian);
      } else {
        return Cesium.JulianDate.toDate(
          Cesium.JulianDate.addHours(
            julian,
            this._timezoom || -8,
            new Cesium.JulianDate()
          )
        );
      }
    },
    resize() {
      this.zoomTo(this._clock.startTime, this._clock.stopTime);
      var width = this.container.clientWidth;
      var height = this.container.clientHeight;

      if (width === this._lastWidth && height === this._lastHeight) {
        return;
      }

      this._trackContainer.style.height = height + "px";

      var trackListHeight = 1;
      this._trackList.forEach(function(track) {
        trackListHeight += track.height;
      });
      this._trackListEle.style.height = trackListHeight.toString() + "px";
      this._trackListEle.width = this._trackListEle.clientWidth;
      this._trackListEle.height = trackListHeight;
      this._makeTics();

      this._lastXPos = undefined;
      this._lastWidth = width;
      this._lastHeight = height;
    },

    addEventListener(type, listener, useCapture) {
      this._topDiv.addEventListener(type, listener, useCapture);
    },

    removeEventListener(type, listener, useCapture) {
      this._topDiv.removeEventListener(type, listener, useCapture);
    },

    isDestroyed() {
      return false;
    },

    destroy() {
      this._clock.onTick.removeEventListener(this.updateFromClock, this);

      document.removeEventListener("mouseup", this._onMouseUp, false);
      document.removeEventListener("mousemove", this._onMouseMove, false);

      var timeBarEle = this._timeBarEle;
      timeBarEle.removeEventListener("mousedown", this._onMouseDown, false);
      timeBarEle.removeEventListener(
        "DOMMouseScroll",
        this._onMouseWheel,
        false
      ); // Mozilla mouse wheel
      timeBarEle.removeEventListener("mousewheel", this._onMouseWheel, false);
      timeBarEle.removeEventListener("touchstart", this._onTouchStart, false);
      timeBarEle.removeEventListener("touchmove", this._onTouchMove, false);
      timeBarEle.removeEventListener("touchend", this._onTouchEnd, false);
      timeBarEle.removeEventListener("touchcancel", this._onTouchEnd, false);
      this._topDiv.removeEventListener(
        "settime",
        this.onTimelineScrubfunction,
        false
      );

      window.removeEventListener("resize", this._resize);

      this.container.removeChild(this._topDiv);
      destroyObject(this);
    },

    addHighlightRange(color, heightInPx, base) {
      var newHighlightRange = new TimelineHighlightRange(
        color,
        heightInPx,
        base
      );
      this._highlightRanges.push(newHighlightRange);
      this.resize();
      return newHighlightRange;
    },

    addTrack(interval, heightInPx, color, backgroundColor) {
      var newTrack = new TimelineTrack(
        interval,
        heightInPx,
        color,
        backgroundColor
      );
      this._trackList.push(newTrack);
      this._lastHeight = undefined;
      this.resize();
      return newTrack;
    },

    zoomTo(startTime, stopTime) {
      //>>includeStart('debug', pragmas.debug);
      if (!defined(startTime)) {
        throw new DeveloperError("startTime is required.");
      }
      if (!defined(stopTime)) {
        throw new DeveloperError("stopTime is required");
      }
      if (JulianDate.lessThanOrEquals(stopTime, startTime)) {
        throw new DeveloperError("Start time must come before end time.");
      }
      //>>includeEnd('debug');

      this._startJulian = Cesium.JulianDate.clone(startTime, this._startJulian);
      this._endJulian = Cesium.JulianDate.clone(stopTime, this._endJulian);
      this._timeBarSecondsSpan = JulianDate.secondsDifference(
        stopTime,
        startTime
      );

      // If clock is not unbounded, clamp timeline range to clock.
      if (this._clock && this._clock.clockRange !== "UNBOUNDED") {
        var clockStart = this._clock.startTime;
        var clockEnd = this._clock.stopTime;
        var clockSpan = JulianDate.secondsDifference(clockEnd, clockStart);
        var startOffset = JulianDate.secondsDifference(
          clockStart,
          this._startJulian
        );
        var endOffset = JulianDate.secondsDifference(clockEnd, this._endJulian);

        if (this._timeBarSecondsSpan >= clockSpan) {
          // if new duration longer than clock range duration, clamp to full range.
          this._timeBarSecondsSpan = clockSpan;
          this._startJulian = Cesium.JulianDate.clone(
            this._clock.startTime,
            this._startJulian
          );
          this._endJulian = Cesium.JulianDate.clone(
            this._clock.stopTime,
            this._endJulian
          );
        } else if (startOffset > 0) {
          // if timeline start is before clock start, shift right
          this._endJulian = JulianDate.addSeconds(
            this._endJulian,
            startOffset,
            this._endJulian
          );
          this._startJulian = Cesium.JulianDate.clone(
            clockStart,
            this._startJulian
          );
          this._timeBarSecondsSpan = JulianDate.secondsDifference(
            this._endJulian,
            this._startJulian
          );
        } else if (endOffset < 0) {
          // if timeline end is after clock end, shift left
          this._startJulian = JulianDate.addSeconds(
            this._startJulian,
            endOffset,
            this._startJulian
          );
          this._endJulian = Cesium.JulianDate.clone(clockEnd, this._endJulian);
          this._timeBarSecondsSpan = JulianDate.secondsDifference(
            this._endJulian,
            this._startJulian
          );
        }
      }

      this._makeTics();

      var evt = document.createEvent("Event");
      evt.initEvent("setzoom", true, true);
      evt.startJulian = this._startJulian;
      evt.endJulian = this._endJulian;
      evt.epochJulian = this._epochJulian;
      evt.totalSpan = this._timeBarSecondsSpan;
      evt.mainTicSpan = this._mainTicSpan;
      this._topDiv.dispatchEvent(evt);

      //重新计算startPosition和stopPosition的位置
      let seconds = JulianDate.secondsDifference(
        this._endJulian,
        this._startJulian
      );
      let second1 = JulianDate.secondsDifference(
        this.startTime,
        this._startJulian
      );
      let second2 = JulianDate.secondsDifference(
        this.stopTime,
        this._startJulian
      );
      this.startPosition = (second1 * this._topDiv.clientWidth) / seconds;
      this.stopPosition = (second2 * this._topDiv.clientWidth) / seconds;
      let xPos = Math.round(
        (seconds * this._topDiv.clientWidth) / this._timeBarSecondsSpan
      );
    },

    zoomFrom(amount) {
      var centerSec = JulianDate.secondsDifference(
        this._scrubJulian,
        this._startJulian
      );
      if (amount > 1 || centerSec < 0 || centerSec > this._timeBarSecondsSpan) {
        centerSec = this._timeBarSecondsSpan * 0.5;
      } else {
        centerSec += centerSec - this._timeBarSecondsSpan * 0.5;
      }
      var centerSecFlip = this._timeBarSecondsSpan - centerSec;
      this.zoomTo(
        JulianDate.addSeconds(
          this._startJulian,
          centerSec - centerSec * amount,
          new JulianDate()
        ),
        JulianDate.addSeconds(
          this._endJulian,
          centerSecFlip * amount - centerSecFlip,
          new JulianDate()
        )
      );
    },

    twoDigits(num) {
      return num < 10 ? "0" + num.toString() : num.toString();
    },

    makeLabel(time) {
      let t = time;
      if (this.showType == "local") {
        t = Cesium.JulianDate.addHours(
          time,
          -this._timezoom,
          new Cesium.JulianDate()
        );
      }
      var gregorian = JulianDate.toGregorianDate(t);
      var millisecond = gregorian.millisecond;
      // let millisecondString = " "+this._clock.showType;

      // if ((millisecond > 0) && (this._timeBarSecondsSpan < 3600)) {
      //     millisecondString = Math.floor(millisecond).toString();
      //     while (millisecondString.length < 3) {
      //         millisecondString = '0' + millisecondString;
      //     }
      //     millisecondString = '.' + millisecondString;
      // }

      //return gregorian.year + ' ' + timelineMonthNames[gregorian.month - 1] + '月 ' + gregorian.day + '日 ' + twoDigits(gregorian.hour) +':' + twoDigits(gregorian.minute) + ':' + twoDigits(gregorian.second) + millisecondString;
      if (this.showType == "UTC") {
        for (let k in gregorian) {
          if (gregorian[k] < 10) {
            gregorian[k] = "0" + gregorian[k];
          }
        }
        return `${gregorian.year}-${gregorian.month}-${gregorian.day}  ${gregorian.hour}:${gregorian.minute}:${gregorian.second}`; //  ${millisecondString}`
      } else {
        return `${gregorian.year}年${gregorian.month}月${gregorian.day}日  ${gregorian.hour}时${gregorian.minute}分${gregorian.second}秒`; //  ${millisecondString}`
      }
    },

    _makeTics() {
      var timeBar = this._timeBarEle;

      var seconds = JulianDate.secondsDifference(
        this._scrubJulian,
        this._startJulian
      );
      var xPos = Math.round(
        (seconds * this._topDiv.clientWidth) / this._timeBarSecondsSpan
      );
      var scrubX = xPos - 8,
        tic;
      var widget = this;

      this._needleEle.style.left = xPos.toString() + "px";

      var tics = "";

      var minimumDuration = 0.01;
      var maximumDuration = 31536000000.0; // ~1000 years
      var epsilon = 1e-10;

      // If time step size is known, enter it here...
      var minSize = 0;

      var duration = this._timeBarSecondsSpan;
      if (duration < minimumDuration) {
        duration = minimumDuration;
        this._timeBarSecondsSpan = minimumDuration;
        this._endJulian = JulianDate.addSeconds(
          this._startJulian,
          minimumDuration,
          new JulianDate()
        );
      } else if (duration > maximumDuration) {
        duration = maximumDuration;
        this._timeBarSecondsSpan = maximumDuration;
        this._endJulian = JulianDate.addSeconds(
          this._startJulian,
          maximumDuration,
          new JulianDate()
        );
      }

      var timeBarWidth = this._timeBarEle.clientWidth;
      if (timeBarWidth < 10) {
        timeBarWidth = 10;
      }
      var startJulian = this._startJulian;

      // epsilonTime: a small fraction of one pixel width of the timeline, measured in seconds.
      var epsilonTime = Math.min((duration / timeBarWidth) * 1e-5, 0.4);

      // epochJulian: a nearby time to be considered "zero seconds", should be a round-ish number by human standards.
      var epochJulian;
      var gregorianDate = JulianDate.toGregorianDate(startJulian);
      if (duration > 315360000) {
        // 3650+ days visible, epoch is start of the first visible century.
        epochJulian = JulianDate.fromDate(
          new Date(Date.UTC(Math.floor(gregorianDate.year / 100) * 100, 0))
        );
      } else if (duration > 31536000) {
        // 365+ days visible, epoch is start of the first visible decade.
        epochJulian = JulianDate.fromDate(
          new Date(Date.UTC(Math.floor(gregorianDate.year / 10) * 10, 0))
        );
      } else if (duration > 86400) {
        // 1+ day(s) visible, epoch is start of the year.
        epochJulian = JulianDate.fromDate(
          new Date(Date.UTC(gregorianDate.year, 0))
        );
      } else {
        // Less than a day on timeline, epoch is midnight of the visible day.
        epochJulian = JulianDate.fromDate(
          new Date(
            Date.UTC(gregorianDate.year, gregorianDate.month, gregorianDate.day)
          )
        );
      }

      // startTime: Seconds offset of the left side of the timeline from epochJulian.
      var startTime = JulianDate.secondsDifference(
        this._startJulian,
        JulianDate.addSeconds(epochJulian, epsilonTime, new JulianDate())
      );
      // endTime: Seconds offset of the right side of the timeline from epochJulian.
      var endTime = startTime + duration;
      this._epochJulian = epochJulian;

      function getStartTic(ticScale) {
        return Math.floor(startTime / ticScale) * ticScale;
      }

      function getNextTic(tic, ticScale) {
        return Math.ceil(tic / ticScale + 0.5) * ticScale;
      }

      function getAlpha(time) {
        return (time - startTime) / duration;
      }

      function remainder(x, y) {
        //return x % y;
        return x - y * Math.round(x / y);
      }

      // Width in pixels of a typical label, plus padding
      this._rulerEle.innerHTML = this.makeLabel(
        JulianDate.addSeconds(
          this._endJulian,
          -minimumDuration,
          new JulianDate()
        )
      );
      var sampleWidth = this._rulerEle.offsetWidth + 20;
      if (sampleWidth < 30) {
        // Workaround an apparent IE bug with measuring the width after going full-screen from inside an iframe.
        sampleWidth = 180;
      }

      var origMinSize = minSize;
      minSize -= epsilon;

      var renderState = {
        startTime: startTime,
        startJulian: startJulian,
        epochJulian: epochJulian,
        duration: duration,
        timeBarWidth: timeBarWidth,
        getAlpha: getAlpha
      };
      this._highlightRanges.forEach(function(highlightRange) {
        tics += highlightRange.render(renderState);
      });

      // Calculate tic mark label spacing in the TimeBar.
      var mainTic = 0.0,
        subTic = 0.0,
        tinyTic = 0.0;
      // Ideal labeled tic as percentage of zoom interval
      var idealTic = sampleWidth / timeBarWidth;
      if (idealTic > 1.0) {
        // Clamp to width of window, for thin windows.
        idealTic = 1.0;
      }
      // Ideal labeled tic size in seconds
      idealTic *= this._timeBarSecondsSpan;
      var ticIndex = -1,
        smallestIndex = -1;

      var i,
        ticScaleLen = timelineTicScales.length;
      for (i = 0; i < ticScaleLen; ++i) {
        var sc = timelineTicScales[i];
        ++ticIndex;
        mainTic = sc;
        // Find acceptable main tic size not smaller than ideal size.
        if (sc > idealTic && sc > minSize) {
          break;
        }
        if (
          smallestIndex < 0 &&
          timeBarWidth * (sc / this._timeBarSecondsSpan) >=
            this.smallestTicInPixels
        ) {
          smallestIndex = ticIndex;
        }
      }
      if (ticIndex > 0) {
        while (ticIndex > 0) {
          // Compute sub-tic size that evenly divides main tic.
          --ticIndex;
          if (
            Math.abs(remainder(mainTic, timelineTicScales[ticIndex])) < 0.00001
          ) {
            if (timelineTicScales[ticIndex] >= minSize) {
              subTic = timelineTicScales[ticIndex];
            }
            break;
          }
        }

        if (smallestIndex >= 0) {
          while (smallestIndex < ticIndex) {
            // Compute tiny tic size that evenly divides sub-tic.
            if (
              Math.abs(remainder(subTic, timelineTicScales[smallestIndex])) <
                0.00001 &&
              timelineTicScales[smallestIndex] >= minSize
            ) {
              tinyTic = timelineTicScales[smallestIndex];
              break;
            }
            ++smallestIndex;
          }
        }
      }

      minSize = origMinSize;
      if (
        minSize > epsilon &&
        tinyTic < 0.00001 &&
        Math.abs(minSize - mainTic) > epsilon
      ) {
        tinyTic = minSize;
        if (minSize <= mainTic + epsilon) {
          subTic = 0.0;
        }
      }

      var lastTextLeft = -999999,
        textWidth;
      if (timeBarWidth * (tinyTic / this._timeBarSecondsSpan) >= 3.0) {
        //先清空
        this.ticTinys.length = 0;
        for (
          tic = getStartTic(tinyTic);
          tic <= endTime;
          tic = getNextTic(tic, tinyTic)
        ) {
          tics +=
            '<span class="cesium-timeline-ticTiny" style="left: ' +
            Math.round(timeBarWidth * getAlpha(tic)).toString() +
            'px;"></span>';
          //再新增
          this.ticTinys.push(
            Math.round(timeBarWidth * getAlpha(tic)).toString()
          );
        }
      }
      if (timeBarWidth * (subTic / this._timeBarSecondsSpan) >= 3.0) {
        this.ticSubs.length = 0;
        for (
          tic = getStartTic(subTic);
          tic <= endTime;
          tic = getNextTic(tic, subTic)
        ) {
          tics +=
            '<span class="cesium-timeline-ticSub" style="left: ' +
            Math.round(timeBarWidth * getAlpha(tic)).toString() +
            'px;"></span>';

          this.ticSubs.push(
            Math.round(timeBarWidth * getAlpha(tic)).toString()
          );
        }
      }
      if (timeBarWidth * (mainTic / this._timeBarSecondsSpan) >= 2.0) {
        this.ticMains.length = [];
        this.ticLabels.length = [];

        this._mainTicSpan = mainTic;
        endTime += mainTic;
        tic = getStartTic(mainTic);
        var leapSecond = JulianDate.computeTaiMinusUtc(epochJulian);
        while (tic <= endTime) {
          var ticTime = JulianDate.addSeconds(
            startJulian,
            tic - startTime,
            new JulianDate()
          );
          if (mainTic > 2.1) {
            var ticLeap = JulianDate.computeTaiMinusUtc(ticTime);
            if (Math.abs(ticLeap - leapSecond) > 0.1) {
              tic += ticLeap - leapSecond;
              ticTime = JulianDate.addSeconds(
                startJulian,
                tic - startTime,
                new JulianDate()
              );
            }
          }
          var ticLeft = Math.round(timeBarWidth * getAlpha(tic));
          var ticLabel = this.makeLabel(ticTime);
          this._rulerEle.innerHTML = ticLabel;
          textWidth = this._rulerEle.offsetWidth;
          if (textWidth < 10) {
            // IE iframe fullscreen sampleWidth workaround, continued.
            textWidth = sampleWidth;
          }
          var labelLeft = ticLeft - (textWidth / 2 - 1);
          if (labelLeft > lastTextLeft) {
            lastTextLeft = labelLeft + textWidth + 5;
            tics +=
              '<span class="cesium-timeline-ticMain" style="left: ' +
              ticLeft.toString() +
              'px;"></span>' +
              '<span class="cesium-timeline-ticLabel" style="left: ' +
              labelLeft.toString() +
              'px;">' +
              ticLabel +
              "</span>";
            this.ticMains.push(ticLeft.toString());
            this.ticLabels.push([labelLeft.toString(), ticLabel]);
          } else {
            tics +=
              '<span class="cesium-timeline-ticSub" style="left: ' +
              ticLeft.toString() +
              'px;"></span>';
            this.ticSubs.push(ticLeft.toString());
          }
          tic = getNextTic(tic, mainTic);
        }
      } else {
        this._mainTicSpan = -1;
      }

      tics +=
        '<span class="cesium-timeline-icon16" style="left:' +
        scrubX +
        'px;bottom:0;background-position: 0 0;"></span>';
      this.icon16 = scrubX;
      //timeBar.innerHTML = tics;
      this._scrubElement = timeBar.lastChild;

      // Clear track canvas.
      this._context.clearRect(
        0,
        0,
        this._trackListEle.width,
        this._trackListEle.height
      );

      renderState.y = 0;
      this._trackList.forEach(function(track) {
        track.render(widget._context, renderState);
        renderState.y += track.height;
      });
    },

    updateFromClock() {
      this._scrubJulian = JulianDate.clone(
        this._clock.currentTime,
        this._scrubJulian
      );
      var scrubElement = this._scrubElement;
      if (defined(this._scrubElement)) {
        var seconds = JulianDate.secondsDifference(
          this._scrubJulian,
          this._startJulian
        );
        var xPos = Math.round(
          (seconds * this._topDiv.clientWidth) / this._timeBarSecondsSpan
        );

        if (this._lastXPos !== xPos) {
          this._lastXPos = xPos;

          scrubElement.style.left = xPos - 8 + "px";
          this._needleEle.style.left = xPos + "px";
        }
      }
      if (defined(this._timelineDragLocation)) {
        this._setTimeBarTime(
          this._timelineDragLocation,
          (this._timelineDragLocation * this._timeBarSecondsSpan) /
            this._topDiv.clientWidth
        );
        this.zoomTo(
          JulianDate.addSeconds(
            this._startJulian,
            this._timelineDrag,
            new JulianDate()
          ),
          JulianDate.addSeconds(
            this._endJulian,
            this._timelineDrag,
            new JulianDate()
          )
        );
      }
    },

    onTimelineScrubfunction(e) {
      this._clock.currentTime = e.timeJulian;
      this._clock.shouldAnimate = false;
    },
    /**
     * @private
     */
    _setTimeBarTime(xPos, seconds) {
      xPos = Math.round(xPos);
      this._scrubJulian = JulianDate.addSeconds(
        this._startJulian,
        seconds,
        this._scrubJulian
      );
      if (this._scrubElement) {
        var scrubX = xPos - 8;
        this._scrubElement.style.left = scrubX.toString() + "px";
        this._needleEle.style.left = xPos.toString() + "px";
      }
      if (this._storeStatus == "start") {
        this.storeStart = Cesium.JulianDate.clone(
          this._scrubJulian,
          this.storeStart
        );
      } else if (this._storeStatus == "stop") {
        this.storeStop = Cesium.JulianDate.clone(
          this._scrubJulian,
          this.storeStop
        );
      } else {
        var evt = document.createEvent("Event");
        evt.initEvent("settime", true, true);
        evt.clientX = xPos;
        evt.timeSeconds = seconds;
        evt.timeJulian = this._scrubJulian;
        evt.clock = this._clock;
        this._topDiv.dispatchEvent(evt);
      }
    }
  },
  watch: {
    multiplier(val, oldVal) {
      if (val == oldVal) return;
      //根据multiplier反算出multiplierScale
      //首先得到multiplier有多少个0
      if( this.unchangeMultiplier) return;
      let value = Math.abs(val);
      let length = value.toFixed(2).length;
      let va = value;
      let i;
      for (i = length; i >= 0; i--) {
        if (va < 1) {
          break;
        }
        va = va / 10;
      }
      length = length - i;

      let v = ((value - 0.11) / Math.pow(10, length)).toFixed(2);
      this.multiplierScale = Number(length) + Number(v);
      if (val < 0) this.multiplierScale = -this.multiplierScale;
    },
    currentTime(val) {
      //执行回调，修改timeLine中的当前时间
      this.updateFromClock();
    },
    startTime() {
      this.zoomTo(this.startTime, this.stopTime);
      this._secondsBetStartAndStop = Cesium.JulianDate.secondsDifference(
        this.stopTime,
        this.startTime
      );
    },
    stopTime() {
      this.zoomTo(this.startTime, this.stopTime);
      this._secondsBetStartAndStop = Cesium.JulianDate.secondsDifference(
        this.stopTime,
        this.startTime
      );
    },
    showType() {
      this._makeTics();
    }
  },
  computed: {
    status() {
      if (
        this.shouldAnimate &&
        this.multiplier > 0 &&
        this.clockStep != "SYSTEM_CLOCK"
      ) {
        return "play";
      } else if (
        this.shouldAnimate &&
        this.multiplier < 0 &&
        this.clockStep != "SYSTEM_CLOCK"
      ) {
        return "backPlay";
      } else if (this.clockStep != "SYSTEM_CLOCK") {
        return "pause";
      }
    },
    now() {
      let current = Cesium.JulianDate.toDate(this.currentTime).getTime();
      let start = Cesium.JulianDate.toDate(this.startTime).getTime();
      let stop = Cesium.JulianDate.toDate(this.stopTime).getTime();
      return (current - start) / (stop - start);
    },
    //timeLine上的时间应该是多个，这里只展示开始和结束
    startString() {
      this.start = this.getDateFromJulian(this.startTime, this.showType).format(
        "yyyy-MM-ddThh:mm:ss"
      );
      return this.getDateFromJulian(this.startTime, this.showType).format(
        "yyyy-MM-dd hh:mm:ss"
      );
    },
    stopString() {
      this.stop = this.getDateFromJulian(this.stopTime, this.showType).format(
        "yyyy-MM-ddThh:mm:ss"
      );
      return this.getDateFromJulian(this.stopTime, this.showType).format(
        "yyyy-MM-dd hh:mm:ss"
      );
    },
    currentString() {
      this.current = this.getDateFromJulian(
        this.currentTime,
        this.showType
      ).format("yyyy-MM-ddThh:mm:ss");
      return this.getDateFromJulian(this.currentTime, this.showType).format(
        "yyyy-MM-dd hh:mm:ss"
      );
    }
  },
  beforeDestroy() {
    this.destroy();
    this._unbind.map(unbind => {
      unbind();
      return null;
    });
  }
};

function createMouseDownCallback(timeline) {
  return function(e) {
    if (timeline._mouseMode !== timelineMouseMode.touchOnly) {
      if (e.button === 0) {
        timeline._mouseMode = timelineMouseMode.scrub;
        if (timeline._scrubElement) {
          timeline._scrubElement.style.backgroundPosition = "-16px 0";
        }
        timeline._onMouseMove(e);
      } else {
        timeline._mouseX = e.clientX;
        if (e.button === 2) {
          timeline._mouseMode = timelineMouseMode.zoom;
        } else {
          timeline._mouseMode = timelineMouseMode.slide;
        }
      }
    }
    e.preventDefault();
  };
}

function createMouseUpCallback(timeline) {
  return function(e) {
    timeline._mouseMode = timelineMouseMode.none;
    if (timeline._scrubElement) {
      timeline._scrubElement.style.backgroundPosition = "0 0";
    }
    timeline._timelineDrag = 0;
    timeline._timelineDragLocation = undefined;
  };
}

function createMouseMoveCallback(timeline) {
  return function(e) {
    var dx;
    if (timeline._mouseMode === timelineMouseMode.scrub) {
      e.preventDefault();
      var x = e.clientX - timeline._topDiv.getBoundingClientRect().left;

      if (x < 0) {
        timeline._timelineDragLocation = 0;
        timeline._timelineDrag = -0.01 * timeline._timeBarSecondsSpan;
      } else if (x > timeline._topDiv.clientWidth) {
        timeline._timelineDragLocation = timeline._topDiv.clientWidth;
        timeline._timelineDrag = 0.01 * timeline._timeBarSecondsSpan;
      } else {
        timeline._timelineDragLocation = undefined;
        timeline._setTimeBarTime(
          x,
          (x * timeline._timeBarSecondsSpan) / timeline._topDiv.clientWidth
        );
      }
    } else if (timeline._mouseMode === timelineMouseMode.slide) {
      dx = timeline._mouseX - e.clientX;
      timeline._mouseX = e.clientX;
      if (dx !== 0) {
        var dsec =
          (dx * timeline._timeBarSecondsSpan) / timeline._topDiv.clientWidth;
        timeline.zoomTo(
          JulianDate.addSeconds(timeline._startJulian, dsec, new JulianDate()),
          JulianDate.addSeconds(timeline._endJulian, dsec, new JulianDate())
        );
      }
    } else if (timeline._mouseMode === timelineMouseMode.zoom) {
      dx = timeline._mouseX - e.clientX;
      timeline._mouseX = e.clientX;
      if (dx !== 0) {
        timeline.zoomFrom(Math.pow(1.01, dx));
      }
    }
  };
}

function createMouseWheelCallback(timeline) {
  return function(e) {
    var dy = e.wheelDeltaY || e.wheelDelta || -e.detail;
    timelineWheelDelta = Math.max(
      Math.min(Math.abs(dy), timelineWheelDelta),
      1
    );
    dy /= timelineWheelDelta;
    timeline.zoomFrom(Math.pow(1.05, -dy));
  };
}

function createTouchStartCallback(timeline) {
  return function(e) {
    var len = e.touches.length,
      seconds,
      xPos,
      leftX = timeline._topDiv.getBoundingClientRect().left;
    e.preventDefault();
    timeline._mouseMode = timelineMouseMode.touchOnly;
    if (len === 1) {
      seconds = JulianDate.secondsDifference(
        timeline._scrubJulian,
        timeline._startJulian
      );
      xPos = Math.round(
        (seconds * timeline._topDiv.clientWidth) /
          timeline._timeBarSecondsSpan +
          leftX
      );
      if (Math.abs(e.touches[0].clientX - xPos) < 50) {
        timeline._touchMode = timelineTouchMode.scrub;
        if (timeline._scrubElement) {
          timeline._scrubElement.style.backgroundPosition =
            len === 1 ? "-16px 0" : "0 0";
        }
      } else {
        timeline._touchMode = timelineTouchMode.singleTap;
        timeline._touchState.centerX = e.touches[0].clientX - leftX;
      }
    } else if (len === 2) {
      timeline._touchMode = timelineTouchMode.slideZoom;
      timeline._touchState.centerX =
        (e.touches[0].clientX + e.touches[1].clientX) * 0.5 - leftX;
      timeline._touchState.spanX = Math.abs(
        e.touches[0].clientX - e.touches[1].clientX
      );
    } else {
      timeline._touchMode = timelineTouchMode.ignore;
    }
  };
}

function createTouchEndCallback(timeline) {
  return function(e) {
    var len = e.touches.length,
      leftX = timeline._topDiv.getBoundingClientRect().left;
    if (timeline._touchMode === timelineTouchMode.singleTap) {
      timeline._touchMode = timelineTouchMode.scrub;
      timeline._onTouchMove(e);
    } else if (timeline._touchMode === timelineTouchMode.scrub) {
      timeline._onTouchMove(e);
    }
    timeline._mouseMode = timelineMouseMode.touchOnly;
    if (len !== 1) {
      timeline._touchMode =
        len > 0 ? timelineTouchMode.ignore : timelineTouchMode.none;
    } else if (timeline._touchMode === timelineTouchMode.slideZoom) {
      timeline._touchState.centerX = e.touches[0].clientX - leftX;
    }
    if (timeline._scrubElement) {
      timeline._scrubElement.style.backgroundPosition = "0 0";
    }
  };
}

function createTouchMoveCallback(timeline) {
  return function(e) {
    var dx,
      x,
      len,
      newCenter,
      newSpan,
      newStartTime,
      zoom = 1,
      leftX = timeline._topDiv.getBoundingClientRect().left;
    if (timeline._touchMode === timelineTouchMode.singleTap) {
      timeline._touchMode = timelineTouchMode.slideZoom;
    }
    timeline._mouseMode = timelineMouseMode.touchOnly;
    if (timeline._touchMode === timelineTouchMode.scrub) {
      e.preventDefault();
      if (e.changedTouches.length === 1) {
        x = e.changedTouches[0].clientX - leftX;
        if (x >= 0 && x <= timeline._topDiv.clientWidth) {
          timeline._setTimeBarTime(
            x,
            (x * timeline._timeBarSecondsSpan) / timeline._topDiv.clientWidth
          );
        }
      }
    } else if (timeline._touchMode === timelineTouchMode.slideZoom) {
      len = e.touches.length;
      if (len === 2) {
        newCenter = (e.touches[0].clientX + e.touches[1].clientX) * 0.5 - leftX;
        newSpan = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
      } else if (len === 1) {
        newCenter = e.touches[0].clientX - leftX;
        newSpan = 0;
      }

      if (defined(newCenter)) {
        if (newSpan > 0 && timeline._touchState.spanX > 0) {
          // Zoom and slide
          zoom = timeline._touchState.spanX / newSpan;
          newStartTime = JulianDate.addSeconds(
            timeline._startJulian,
            (timeline._touchState.centerX * timeline._timeBarSecondsSpan -
              newCenter * timeline._timeBarSecondsSpan * zoom) /
              timeline._topDiv.clientWidth,
            new JulianDate()
          );
        } else {
          // Slide to newCenter
          dx = timeline._touchState.centerX - newCenter;
          newStartTime = JulianDate.addSeconds(
            timeline._startJulian,
            (dx * timeline._timeBarSecondsSpan) / timeline._topDiv.clientWidth,
            new JulianDate()
          );
        }

        timeline.zoomTo(
          newStartTime,
          JulianDate.addSeconds(
            newStartTime,
            timeline._timeBarSecondsSpan * zoom,
            new JulianDate()
          )
        );
        timeline._touchState.centerX = newCenter;
        timeline._touchState.spanX = newSpan;
      }
    }
  };
}
</script>
<style scoped>
.startAndStop {
  position: absolute;
  width: 2px;
  height: 26px;
  background-color: #1e9fff;
}
.left,
.right {
  position: absolute;
  bottom: 30px;
  width: 20px;
  height: 30px;
  outline: none;
  border: none;
  cursor: pointer;
}
.left {
  left: 0;
  background: url("../../images/timeline-left.png") no-repeat;
  background-size: contain;
}
.left:hover {
  background: url("../../images/timeline-left-hover.png") no-repeat;
  background-size: contain;
}
.right {
  right: 0;
  background: url("../../images/timeline-right.png") no-repeat;
  background-size: contain;
}
.right:hover {
  background: url("../../images/timeline-right-hover.png") no-repeat;
  background-size: contain;
}
.cesium-viewer-timelineContainer {
  height: 30px;
  left: 19px;
  right: 20px;
  bottom: 30px;
}
.cesium-timeline-main {
  border-color: #5c5e61;
}
.cesium-timeline-bar {
  height: 32px;
  background: rgba(71, 71, 71, 0.8);
}

.cesium-timeline-icon16 {
  width: 14px;
  height: 22px;
  background: url("../../images/timeline.png") no-repeat !important;
  background-size: contain;
  margin-bottom: 2px;
  margin-left: 1px;
}
.cesium-timeline-needle {
  background: #1fffff;
}

.animationBox {
  position: absolute;
  width: 664px;
  height: 32px;
  bottom: 62px;
  left: 50%;
  margin-left: -332px;
  display: flex;
}
.clockstepbutton {
  width: 32px;
  height: 32px;
  background: url("../../images/clockstep.png") center no-repeat;
  background-size: contain;
  border: none;
  outline: none;
  cursor: pointer;
  margin-right: 4px;
}
.clockstepbutton:hover,
.clockstepbuttonactive {
  background: url("../../images/clockstep-on.png") center no-repeat;
  background-size: contain;
}
.animationContainer {
  display: flex;
  width: 584px;
  height: 30px;
  background: rgba(71, 71, 71, 0.8);
  border: 1px solid #565b64;
}
.backbtn,
.suspendbtn,
.playbtn {
  width: 26px;
  height: 26px;
  margin-top: 3px;
  cursor: pointer;
  border-radius: 4px;
  cursor: pointer;
}
.backbtn span,
.suspendbtn span,
.playbtn span {
  display: inline-block;
  width: 16px;
  height: 18px;
  background: url("../../images/timeline-back.png") center no-repeat;
  background-size: contain;
  margin-top: 4px;
  margin-left: 5px;
}
.backbtn:hover,
.suspendbtn:hover,
.playbtn:hover {
  background-color: #3d3d3d;
}
.backbtnactive,
.suspendbtnactive,
.playbtnactive {
  background-color: #333333 !important;
}
.backbtnactive span {
  background: url("../../images/timeline-back-active.png") center no-repeat !important;
  background-size: contain;
}
.suspendbtn {
  margin-left: 46px;
}
.suspendbtn span {
  background: url("../../images/timeline-suspend.png") center no-repeat;
  background-size: contain;
}
.suspendbtnactive span {
  background: url("../../images/timeline-spanspan-active.png") center no-repeat !important;
  background-size: contain;
}
.playbtn {
  margin-left: 46px;
}
.playbtn span {
  background: url("../../images/timeline-play.png") center no-repeat;
  background-size: contain;
}
.playbtnactive span {
  background: url("../../images/timeline-play-active.png") center no-repeat !important;
  background-size: contain;
}

.sliderline {
  position: absolute;
  left: 50%;
  top: 6px;
  display: inline-block;
  width: 1px;
  height: 18px;
  background-color: rgba(230, 230, 230, 0.5);
  z-index: 100;
  cursor: pointer;
}
.sliderreduce,
.slideradd {
  position: absolute;
  top: 0;
  font-size: 18px;
  color: rgba(157, 157, 157, 0.5);
  z-index: 100;
  user-select: none;
  cursor: pointer;
}
.sliderreduce {
  left: 10px;
}
.slideradd {
  right: 10px;
  line-height: 32px;
}

/* .button-group {
  display: flex;
  flex-direction: column;
} */
.clamped,
.unbounded,
.loop {
  width: 32px;
  height: 32px;
  cursor: pointer;
  border: none;
  outline: none;
  margin-left: 4px;
}
.clamped {
  background: url("../../images/clamped.png") center no-repeat !important;
  background-size: contain;
}
.unbounded {
  background: url("../../images/unbounded.png") center no-repeat !important;
  background-size: contain;
}
.loop {
  background: url("../../images/loop.png") center no-repeat !important;
  background-size: contain;
}
</style>