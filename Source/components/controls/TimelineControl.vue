<template>

<div v-show="show">
    <div ref='timelineContainer' class="cesium-viewer-timelineContainer" style="bottom:28px">
        <div ref='topDiv' class="cesium-timeline-main">

            <div ref="bar" class="cesium-timeline-bar">
                <div>
                    <span class="cesium-timeline-ticTiny" v-for="ticTiny in ticTinys" :key="ticTiny+Math.random()" :style="{left: ticTiny+'px'}"></span>
                </div>
                <div>
                    <span class="cesium-timeline-ticSub" v-for="ticSub in ticSubs" :key="ticSub+Math.random()" :style="{left: ticSub+'px'}"></span>
                </div>
                <div>
                    <span class="cesium-timeline-ticMain" v-for="ticMain in ticMains" :key="ticMain+Math.random()" :style="{left: ticMain+'px'}"></span>
                </div>
                <div>
                    <span class="cesium-timeline-ticLabel" v-for="ticLabel in ticLabels" :key="ticLabel[1]" :style="{left: ticLabel[0]+'px'}">{{ticLabel[1]}}</span>
                </div>
                <div>
                    <span class="timeline-storetime" :style="{left: startTimeStore-1+'px'}"></span>
                    <span class="timeline-storetime" :style="{left: stopTimeStore-1+'px'}"></span>

                </div>
                <span class="cesium-timeline-icon16" :style="{left: icon16+'px'}" style="bottom:0;background-position: 0 0;"></span>
            </div>
            <div ref="trackContainer" class="cesium-timeline-trackContainer">
                <canvas ref="track" class="cesium-timeline-tracks" width="10" height="1"></canvas>
            </div>
            <div ref="needle" class="cesium-timeline-needle"></div>
            <span ref="ruler" class="cesium-timeline-ruler"></span>
        </div>
    </div>

    <div ref="animation" class="animationContainer">
        <div class="defultbtn" :class="{btnon:status=='backPlay'}" @click="backPlay()">倒放</div>
        <div class="defultbtn" style="margin-left:20px;" :class="{btnon:status=='pause'}"  @click="pause()">暂停</div>
        <div class="defultbtn" style="margin-left:20px;" :class="{btnon:status=='play'}"  @click="play()">播放</div>
        <br/>
        <div class="defultbtn" style="margin-left:20px;"  @click="normalPlay()">normal</div>
        <div class="defultbtn" style="margin-left:20px;"  @click="changeShowType()">showType</div><br/>
        <br/>
        <div class="defultbtn" style="margin-left:20px;" @click="_storeStatus = 'start';">开始时间</div>
        <div class="defultbtn" style="margin-left:20px;" @click="useStore()">使用</div>
        <div class="defultbtn" style="margin-left:20px;" @click="_storeStatus = 'stop';">结束时间</div>

        <div>{{showType}}</div>
        <div>开始时间： {{startString}}</div>
        <input type="datetime-local" v-model="start" @change="changeStart(start)" :max="stop">
        <div>结束时间： {{stopString}}</div>
        <input type="datetime-local" v-model="stop" @change="changeStop(stop)" :min="start">
        <div>当前时间： {{currentString}}</div>
        <input type="datetime-local" v-model="current" @change="changeCurrent(current)" :max="stop" :min="start">
        <br>
        <a>播放速率：</a><input type='range' min='-1000' max='1000' step='1' v-model.number="multiplier">
        <!-- <br/><a>当前时间：</a>
        <input ref='now' type='range' min='0' max='1' step='0.0001' v-model.number="now" @mousedonw="pause()" @mouseup="setCurrent()"> -->

        <br/>
        <span>clockRange: </span><select style="width: 246px; cursor: pointer;" v-model="clockRange"><option v-for="item in clockRanges" :key='item'>{{item}}</option></select><br/>
        <span>clockStep: </span><select style="width: 246px; cursor: pointer;" v-model="clockStep"><option v-for="item in clockSteps" :key='item'>{{item}}</option></select><br/>
    </div>
</div>
</template>

<script>
Date.prototype.format = function(fmt){
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };

    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
        }       
    }

    return fmt;
}
let [ClockRange,defined,destroyObject,DeveloperError,JulianDate,getElement,TimelineHighlightRange,TimelineTrack] =[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];

var timelineWheelDelta = 1e12;

var timelineMouseMode = {
    none : 0,
    scrub : 1,
    slide : 2,
    zoom : 3,
    touchOnly : 4
};
var timelineTouchMode = {
    none : 0,
    scrub : 1,
    slideZoom : 2,
    singleTap : 3,
    ignore : 4
};

var timelineTicScales = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.25, 0.5, 1.0, 2.0, 5.0, 10.0, 15.0, 30.0, 60.0, // 1min
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
let timelineMonthNames = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

export default {
    data(){
        return{
            show: true,
            start: '',
            current: '',
            stop: '',
            //_storeStatus: undefined,
            
            clockRanges: ['LOOP_STOP', 'CLAMPED', 'UNBOUNDED'],
            clockSteps: ['TICK_DEPENDENT', 'SYSTEM_CLOCK_MULTIPLIER', 'SYSTEM_CLOCK'],

            shouldAnimate: true,
            multiplier: 1,
            showType:   'local',
            clockRange: '',
            clockStep: '',
            startTime:  {dayNumber:2440587,secondsOfDay:43210},
            stopTime:   {dayNumber:2440587,secondsOfDay:43210},
            currentTime:{dayNumber:2440587,secondsOfDay:43210},
            
            storeStart: {dayNumber:2440587,secondsOfDay:43210},
            storeStop:  {dayNumber:2440587,secondsOfDay:43210},
            ticTinys:   [],
            ticSubs:    [],
            ticMains:   [],
            ticLabels:  [],
            icon16: '',

            startTimeStore: 0,
            stopTimeStore: 0,
        }
    },
    created(){
        this._timezoom = (new Date()).getTimezoneOffset()/60;
    },
    mounted(){
        this._earth = this.$root.$earth;
        this._clock = this._earth.clock;

        // let map = {
        //     'startTime': 'startTime',
        //     'stopTime': 'stopTime',
        //     'currentTime': 'currentTime',
        //     'shouldAnimate': 'shouldAnimate',
        //     'multiplier': 'multiplier',
        //     'showType': 'showType',
        //     'clockRange': 'clockRange',
        //     'clockStep': 'clockStep',
        // };
        // this._unbind = [];
        // for(let key in map){
        //     this._unbind.push( XE.MVVM.bind(this, map[key], this._clock, key));
        // }
        let map = ['startTime','stopTime','currentTime','shouldAnimate','multiplier','showType','clockRange', 'clockStep'];
        this._unbind = map.map( e=>{
            return XE.MVVM.bind(this, e, this._clock, e);
        })

        this.startTime = Cesium.JulianDate.fromDate( new Date());
        this.stopTime = Cesium.JulianDate.addHours( this.startTime, 1, new Cesium.JulianDate());
        this.currentTime = Cesium.JulianDate.clone( this.startTime, new Cesium.JulianDate());

        //下面是从timeLine.js挪过来的代码
        this.smallestTicInPixels = 7.0;
        [ClockRange,defined,destroyObject,DeveloperError,JulianDate,getElement,TimelineHighlightRange,TimelineTrack] = [
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
        this._scrubJulian = JulianDate.clone(this._clock.currentTime, this._scrubJulian);
        this._mainTicSpan = -1;
        this._mouseMode = timelineMouseMode.none;
        this._touchMode = timelineTouchMode.none;
        this._touchState = {
            centerX : 0,
            spanX : 0
        };
        this._mouseX = 0;
        this._timelineDrag = 0;
        this._timelineDragLocation = undefined;
        this._lastHeight = undefined;
        this._lastWidth = undefined;

        // this._topDiv.innerHTML = '<div class="cesium-timeline-bar"></div><div class="cesium-timeline-trackContainer">' +
        //                             '<canvas class="cesium-timeline-tracks" width="10" height="1">' +
        //                             '</canvas></div><div class="cesium-timeline-needle"></div><span class="cesium-timeline-ruler"></span>';
        this._timeBarEle = this.$refs.bar//this._topDiv.childNodes[0];
        this._trackContainer = this.$refs.trackContainer;//this._topDiv.childNodes[1];
        this._trackListEle = this.$refs.track;//this._topDiv.childNodes[1].childNodes[0];
        this._needleEle = this.$refs.needle//this._topDiv.childNodes[2];
        this._rulerEle = this.$refs.ruler;//this._topDiv.childNodes[3];
        this._context = this._trackListEle.getContext('2d');

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
        document.addEventListener('mouseup', this._onMouseUp, false);
        document.addEventListener('mousemove', this._onMouseMove, false);
        timeBarEle.addEventListener('mousedown', this._onMouseDown, false);
        timeBarEle.addEventListener('DOMMouseScroll', this._onMouseWheel, false); // Mozilla mouse wheel
        timeBarEle.addEventListener('mousewheel', this._onMouseWheel, false);
        timeBarEle.addEventListener('touchstart', this._onTouchStart, false);
        timeBarEle.addEventListener('touchmove', this._onTouchMove, false);
        timeBarEle.addEventListener('touchend', this._onTouchEnd, false);
        timeBarEle.addEventListener('touchcancel', this._onTouchEnd, false);
        this._topDiv.addEventListener('settime', this.onTimelineScrubfunction, false);

        this._topDiv.oncontextmenu = function() {
            return false;
        };

        this._resize = this.resize.bind( this);
        window.addEventListener( 'resize', this._resize);
        this.updateFromClock();
    },
    methods:{
        useStore(){
            this._storeStatus = undefined;
            if( this.storeStart && this.storeStop){
                let different = Cesium.JulianDate.secondsDifference( this.storeStop, this.storeStart);
                if( different < 0){
                    let comp = this.storeStart;
                    this.storeStart = this.storeStop;
                    this.storeStop = comp;
                }
                this.startTime = Cesium.JulianDate.clone( this.storeStart, this.startTime);
                this.stopTime = Cesium.JulianDate.clone( this.storeStop, this.stopTime);
                this.zoomTo( this.startTime, this.stopTime);

                setTimeout( ()=>{

                    this.computeStartAndStop();
                },10)
            }
        },
        changeStart(str){
            if( (new Date(str)).getTime() < (new Date( this.stop)).getTime()){

                Cesium.JulianDate.fromDate(new Date(str), this.startTime);
            }else{
                console.log( '开始时间必须小于结束时间');
            }
        },
        changeCurrent( str){
            if( (new Date(str)).getTime() < (new Date( this.stop)).getTime() && (new Date(str)).getTime() > (new Date( this.start)).getTime()){

                Cesium.JulianDate.fromDate(new Date(str), this.currentTime);
            }else{
                console.log( '当前时间必须小于结束时间并且大于开始时间');
            }
        },
        changeStop( str){
            if( (new Date(str)).getTime() > (new Date( this.start)).getTime()){

                Cesium.JulianDate.fromDate(new Date(str), this.stopTime);
            }else{
                console.log( '结束时间必须大于开始时间');
            }
        },
        normalPlay(){
            this.shouldAnimate = true;
            this.multiplier = 1;
        },
        backPlay(){
            this.shouldAnimate = true;
            this.multiplier = -Math.abs( this.multiplier);
        },
        pause(){
            this.shouldAnimate = false;
        },
        play(){
            this.shouldAnimate = true;
            this.multiplier = Math.abs( this.multiplier);
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
        changeShowType(){
            //展示UTC/当地时间
            this.showType = this.showType == 'local' ? 'UTC' : 'local';
            //派发事件给TimelineControl
        },
        getDateFromJulian( julian, showType){
            if( showType == 'local'){
                return Cesium.JulianDate.toDate( julian);
            }else{
                return Cesium.JulianDate.toDate( Cesium.JulianDate.addHours( julian, this._timezoom || -8, new Cesium.JulianDate()));
            }
        },
        resize() {
            this.zoomTo(this._clock.startTime, this._clock.stopTime);
            var width = this.container.clientWidth;
            var height = this.container.clientHeight;

            if (width === this._lastWidth && height === this._lastHeight) {
                return;
            }

            this._trackContainer.style.height = height + 'px';

            var trackListHeight = 1;
            this._trackList.forEach(function(track) {
                trackListHeight += track.height;
            });
            this._trackListEle.style.height = trackListHeight.toString() + 'px';
            this._trackListEle.width = this._trackListEle.clientWidth;
            this._trackListEle.height = trackListHeight;
            this._makeTics();

            this._lastXPos = undefined;
            this._lastWidth = width;
            this._lastHeight = height;
        },

        addEventListener (type, listener, useCapture) {
            this._topDiv.addEventListener(type, listener, useCapture);
        },

        removeEventListener (type, listener, useCapture) {
            this._topDiv.removeEventListener(type, listener, useCapture);
        },

        isDestroyed () {
            return false;
        },

        destroy () {
            this._clock.onTick.removeEventListener(this.updateFromClock, this);

            document.removeEventListener('mouseup', this._onMouseUp, false);
            document.removeEventListener('mousemove', this._onMouseMove, false);

            var timeBarEle = this._timeBarEle;
            timeBarEle.removeEventListener('mousedown', this._onMouseDown, false);
            timeBarEle.removeEventListener('DOMMouseScroll', this._onMouseWheel, false); // Mozilla mouse wheel
            timeBarEle.removeEventListener('mousewheel', this._onMouseWheel, false);
            timeBarEle.removeEventListener('touchstart', this._onTouchStart, false);
            timeBarEle.removeEventListener('touchmove', this._onTouchMove, false);
            timeBarEle.removeEventListener('touchend', this._onTouchEnd, false);
            timeBarEle.removeEventListener('touchcancel', this._onTouchEnd, false);
            this._topDiv.removeEventListener('settime', this.onTimelineScrubfunction, false);

            window.removeEventListener( 'resize', this._resize);

            this.container.removeChild(this._topDiv);
            destroyObject(this);
        },

        addHighlightRange (color, heightInPx, base) {
            var newHighlightRange = new TimelineHighlightRange(color, heightInPx, base);
            this._highlightRanges.push(newHighlightRange);
            this.resize();
            return newHighlightRange;
        },

        addTrack (interval, heightInPx, color, backgroundColor) {
            var newTrack = new TimelineTrack(interval, heightInPx, color, backgroundColor);
            this._trackList.push(newTrack);
            this._lastHeight = undefined;
            this.resize();
            return newTrack;
        },

        zoomTo (startTime, stopTime) {
            //>>includeStart('debug', pragmas.debug);
            if (!defined(startTime)) {
                throw new DeveloperError('startTime is required.');
            }
            if (!defined(stopTime)) {
                throw new DeveloperError('stopTime is required');
            }
            if (JulianDate.lessThanOrEquals(stopTime, startTime)) {
                throw new DeveloperError('Start time must come before end time.');
            }
            //>>includeEnd('debug');

            this._startJulian = Cesium.JulianDate.clone(startTime, this._startJulian);
            this._endJulian = Cesium.JulianDate.clone(stopTime, this._endJulian);
            this._timeBarSecondsSpan = JulianDate.secondsDifference(stopTime, startTime);

            // If clock is not unbounded, clamp timeline range to clock.
            if (this._clock && (this._clock.clockRange !== "UNBOUNDED")) {
                var clockStart = this._clock.startTime;
                var clockEnd = this._clock.stopTime;
                var clockSpan = JulianDate.secondsDifference(clockEnd, clockStart);
                var startOffset = JulianDate.secondsDifference(clockStart, this._startJulian);
                var endOffset = JulianDate.secondsDifference(clockEnd, this._endJulian);

                if (this._timeBarSecondsSpan >= clockSpan) {
                    // if new duration longer than clock range duration, clamp to full range.
                    this._timeBarSecondsSpan = clockSpan;
                    this._startJulian = Cesium.JulianDate.clone(this._clock.startTime, this._startJulian);
                    this._endJulian = Cesium.JulianDate.clone(this._clock.stopTime, this._endJulian);
                } else if (startOffset > 0) {
                    // if timeline start is before clock start, shift right
                    this._endJulian = JulianDate.addSeconds(this._endJulian, startOffset, this._endJulian);
                    this._startJulian = Cesium.JulianDate.clone( clockStart, this._startJulian);
                    this._timeBarSecondsSpan = JulianDate.secondsDifference(this._endJulian, this._startJulian);
                } else if (endOffset < 0) {
                    // if timeline end is after clock end, shift left
                    this._startJulian = JulianDate.addSeconds(this._startJulian, endOffset, this._startJulian);
                    this._endJulian = Cesium.JulianDate.clone(clockEnd, this._endJulian);
                    this._timeBarSecondsSpan = JulianDate.secondsDifference(this._endJulian, this._startJulian);
                }
            }

            this._makeTics();

            var evt = document.createEvent('Event');
            evt.initEvent('setzoom', true, true);
            evt.startJulian = this._startJulian;
            evt.endJulian = this._endJulian;
            evt.epochJulian = this._epochJulian;
            evt.totalSpan = this._timeBarSecondsSpan;
            evt.mainTicSpan = this._mainTicSpan;
            this._topDiv.dispatchEvent(evt);
        },

        zoomFrom (amount) {
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
            return ((num < 10) ? ('0' + num.toString()) : num.toString());
        },

        makeLabel (time) {
            let t = time;
            if( this.showType == 'local'){
                t = Cesium.JulianDate.addHours( time, -this._timezoom , new Cesium.JulianDate());
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
            if( this.showType == 'UTC'){
                
                for( let k in gregorian){
                    if( gregorian[k] < 10){
                        gregorian[k] = '0'+gregorian[k];
                    }
                }
                return `${gregorian.year}-${gregorian.month}-${gregorian.day}  ${gregorian.hour}:${gregorian.minute}:${gregorian.second}`//  ${millisecondString}`
            }else{
                return `${gregorian.year}年${gregorian.month}月${gregorian.day}日  ${gregorian.hour}时${gregorian.minute}分${gregorian.second}秒`//  ${millisecondString}`
            }

        },

        _makeTics () {
            var timeBar = this._timeBarEle;

            var seconds = JulianDate.secondsDifference(this._scrubJulian, this._startJulian);
            var xPos = Math.round(seconds * this._topDiv.clientWidth / this._timeBarSecondsSpan);
            var scrubX = xPos - 8, tic;
            var widget = this;

            this._needleEle.style.left = xPos.toString() + 'px';

            var tics = '';

            var minimumDuration = 0.01;
            var maximumDuration = 31536000000.0; // ~1000 years
            var epsilon = 1e-10;

            // If time step size is known, enter it here...
            var minSize = 0;

            var duration = this._timeBarSecondsSpan;
            if (duration < minimumDuration) {
                duration = minimumDuration;
                this._timeBarSecondsSpan = minimumDuration;
                this._endJulian = JulianDate.addSeconds(this._startJulian, minimumDuration, new JulianDate());
            } else if (duration > maximumDuration) {
                duration = maximumDuration;
                this._timeBarSecondsSpan = maximumDuration;
                this._endJulian = JulianDate.addSeconds(this._startJulian, maximumDuration, new JulianDate());
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
            if (duration > 315360000) { // 3650+ days visible, epoch is start of the first visible century.
                epochJulian = JulianDate.fromDate(new Date(Date.UTC(Math.floor(gregorianDate.year / 100) * 100, 0)));
            } else if (duration > 31536000) { // 365+ days visible, epoch is start of the first visible decade.
                epochJulian = JulianDate.fromDate(new Date(Date.UTC(Math.floor(gregorianDate.year / 10) * 10, 0)));
            } else if (duration > 86400) { // 1+ day(s) visible, epoch is start of the year.
                epochJulian = JulianDate.fromDate(new Date(Date.UTC(gregorianDate.year, 0)));
            } else { // Less than a day on timeline, epoch is midnight of the visible day.
                epochJulian = JulianDate.fromDate(new Date(Date.UTC(gregorianDate.year, gregorianDate.month, gregorianDate.day)));
            }

            // startTime: Seconds offset of the left side of the timeline from epochJulian.
            var startTime = JulianDate.secondsDifference(this._startJulian, JulianDate.addSeconds(epochJulian, epsilonTime, new JulianDate()));
            // endTime: Seconds offset of the right side of the timeline from epochJulian.
            var endTime = startTime + duration;
            this._epochJulian = epochJulian;

            function getStartTic(ticScale) {
                return Math.floor(startTime / ticScale) * ticScale;
            }

            function getNextTic(tic, ticScale) {
                return Math.ceil((tic / ticScale) + 0.5) * ticScale;
            }

            function getAlpha(time) {
                return (time - startTime) / duration;
            }

            function remainder(x, y) {
                //return x % y;
                return x - (y * Math.round(x / y));
            }

            // Width in pixels of a typical label, plus padding
            this._rulerEle.innerHTML = this.makeLabel(JulianDate.addSeconds(this._endJulian, -minimumDuration, new JulianDate()));
            var sampleWidth = this._rulerEle.offsetWidth + 20;
            if (sampleWidth < 30) {
                // Workaround an apparent IE bug with measuring the width after going full-screen from inside an iframe.
                sampleWidth = 180;
            }

            var origMinSize = minSize;
            minSize -= epsilon;

            var renderState = {
                startTime : startTime,
                startJulian : startJulian,
                epochJulian : epochJulian,
                duration : duration,
                timeBarWidth : timeBarWidth,
                getAlpha : getAlpha
            };
            this._highlightRanges.forEach(function(highlightRange) {
                tics += highlightRange.render(renderState);
            });

            // Calculate tic mark label spacing in the TimeBar.
            var mainTic = 0.0, subTic = 0.0, tinyTic = 0.0;
            // Ideal labeled tic as percentage of zoom interval
            var idealTic = sampleWidth / timeBarWidth;
            if (idealTic > 1.0) {
                // Clamp to width of window, for thin windows.
                idealTic = 1.0;
            }
            // Ideal labeled tic size in seconds
            idealTic *= this._timeBarSecondsSpan;
            var ticIndex = -1, smallestIndex = -1;

            var i, ticScaleLen = timelineTicScales.length;
            for (i = 0; i < ticScaleLen; ++i) {
                var sc = timelineTicScales[i];
                ++ticIndex;
                mainTic = sc;
                // Find acceptable main tic size not smaller than ideal size.
                if ((sc > idealTic) && (sc > minSize)) {
                    break;
                }
                if ((smallestIndex < 0) && ((timeBarWidth * (sc / this._timeBarSecondsSpan)) >= this.smallestTicInPixels)) {
                    smallestIndex = ticIndex;
                }
            }
            if (ticIndex > 0) {
                while (ticIndex > 0) // Compute sub-tic size that evenly divides main tic.
                {
                    --ticIndex;
                    if (Math.abs(remainder(mainTic, timelineTicScales[ticIndex])) < 0.00001) {
                        if (timelineTicScales[ticIndex] >= minSize) {
                            subTic = timelineTicScales[ticIndex];
                        }
                        break;
                    }
                }

                if (smallestIndex >= 0) {
                    while (smallestIndex < ticIndex) // Compute tiny tic size that evenly divides sub-tic.
                    {
                        if ((Math.abs(remainder(subTic, timelineTicScales[smallestIndex])) < 0.00001) && (timelineTicScales[smallestIndex] >= minSize)) {
                            tinyTic = timelineTicScales[smallestIndex];
                            break;
                        }
                        ++smallestIndex;
                    }
                }
            }

            minSize = origMinSize;
            if ((minSize > epsilon) && (tinyTic < 0.00001) && (Math.abs(minSize - mainTic) > epsilon)) {
                tinyTic = minSize;
                if (minSize <= (mainTic + epsilon)) {
                    subTic = 0.0;
                }
            }

            var lastTextLeft = -999999, textWidth;
            if ((timeBarWidth * (tinyTic / this._timeBarSecondsSpan)) >= 3.0) {
                //先清空
                this.ticTinys.length = 0;
                for (tic = getStartTic(tinyTic); tic <= endTime; tic = getNextTic(tic, tinyTic)) {
                    tics += '<span class="cesium-timeline-ticTiny" style="left: ' + Math.round(timeBarWidth * getAlpha(tic)).toString() + 'px;"></span>';
                    //再新增
                    this.ticTinys.push(  Math.round(timeBarWidth * getAlpha(tic)).toString());
                }
            }
            if ((timeBarWidth * (subTic / this._timeBarSecondsSpan)) >= 3.0) {
                this.ticSubs.length = 0;
                for (tic = getStartTic(subTic); tic <= endTime; tic = getNextTic(tic, subTic)) {
                    tics += '<span class="cesium-timeline-ticSub" style="left: ' + Math.round(timeBarWidth * getAlpha(tic)).toString() + 'px;"></span>';

                    this.ticSubs.push(  Math.round(timeBarWidth * getAlpha(tic)).toString());
                }
            }
            if ((timeBarWidth * (mainTic / this._timeBarSecondsSpan)) >= 2.0) {
                this.ticMains.length = [];
                this.ticLabels.length = [];

                this._mainTicSpan = mainTic;
                endTime += mainTic;
                tic = getStartTic(mainTic);
                var leapSecond = JulianDate.computeTaiMinusUtc(epochJulian);
                while (tic <= endTime) {
                    var ticTime = JulianDate.addSeconds(startJulian, tic - startTime, new JulianDate());
                    if (mainTic > 2.1) {
                        var ticLeap = JulianDate.computeTaiMinusUtc(ticTime);
                        if (Math.abs(ticLeap - leapSecond) > 0.1) {
                            tic += (ticLeap - leapSecond);
                            ticTime = JulianDate.addSeconds(startJulian, tic - startTime, new JulianDate());
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
                    var labelLeft = ticLeft - ((textWidth / 2) - 1);
                    if (labelLeft > lastTextLeft) {
                        lastTextLeft = labelLeft + textWidth + 5;
                        tics += '<span class="cesium-timeline-ticMain" style="left: ' + ticLeft.toString() + 'px;"></span>' + '<span class="cesium-timeline-ticLabel" style="left: ' + labelLeft.toString() +
                                'px;">' + ticLabel + '</span>';
                        this.ticMains.push( ticLeft.toString());
                        this.ticLabels.push( [labelLeft.toString(), ticLabel]);
                    } else {
                        tics += '<span class="cesium-timeline-ticSub" style="left: ' + ticLeft.toString() + 'px;"></span>';
                        this.ticSubs.push( ticLeft.toString());
                    }
                    tic = getNextTic(tic, mainTic);
                }
            } else {
                this._mainTicSpan = -1;
            }

            tics += '<span class="cesium-timeline-icon16" style="left:' + scrubX + 'px;bottom:0;background-position: 0 0;"></span>';
            this.icon16 = scrubX;
            //timeBar.innerHTML = tics;
            this._scrubElement = timeBar.lastChild;

            // Clear track canvas.
            this._context.clearRect(0, 0, this._trackListEle.width, this._trackListEle.height);

            renderState.y = 0;
            this._trackList.forEach(function(track) {
                track.render(widget._context, renderState);
                renderState.y += track.height;
            });
        },

        updateFromClock() {
            this._scrubJulian = JulianDate.clone(this._clock.currentTime, this._scrubJulian);
            var scrubElement = this._scrubElement;
            if (defined(this._scrubElement)) {
                var seconds = JulianDate.secondsDifference(this._scrubJulian, this._startJulian);
                var xPos = Math.round(seconds * this._topDiv.clientWidth / this._timeBarSecondsSpan);

                if (this._lastXPos !== xPos) {
                    this._lastXPos = xPos;

                    scrubElement.style.left = (xPos - 8) + 'px';
                    this._needleEle.style.left = xPos + 'px';
                }
            }
            if (defined(this._timelineDragLocation)) {
                this._setTimeBarTime(this._timelineDragLocation, this._timelineDragLocation * this._timeBarSecondsSpan / this._topDiv.clientWidth);
                this.zoomTo(JulianDate.addSeconds(this._startJulian, this._timelineDrag, new JulianDate()), JulianDate.addSeconds(this._endJulian, this._timelineDrag, new JulianDate()));
            }
        },

        onTimelineScrubfunction (e){
            this._clock.currentTime = e.timeJulian;
            this._clock.shouldAnimate = false;
        },
        /**
         * @private
         */
        _setTimeBarTime(xPos, seconds) {
            xPos = Math.round(xPos);
            this._scrubJulian = JulianDate.addSeconds(this._startJulian, seconds, this._scrubJulian);
            if (this._scrubElement) {
                var scrubX = xPos - 8;
                this._scrubElement.style.left = scrubX.toString() + 'px';
                this._needleEle.style.left = xPos.toString() + 'px';
            }
            if( this._storeStatus == "start"){

                this.storeStart = Cesium.JulianDate.clone( this._scrubJulian, this.storeStart);
            }else if( this._storeStatus == "stop"){

                this.storeStop = Cesium.JulianDate.clone( this._scrubJulian, this.storeStop);
            }else{

                var evt = document.createEvent('Event');
                evt.initEvent('settime', true, true);
                evt.clientX = xPos;
                evt.timeSeconds = seconds;
                evt.timeJulian = this._scrubJulian;
                evt.clock = this._clock;
                this._topDiv.dispatchEvent(evt);
            }

        },
        computeStartAndStop(){
            let d1 = Cesium.JulianDate.secondsDifference(this._endJulian, this._startJulian);
            let d2 = Cesium.JulianDate.secondsDifference( this.storeStart, this._startJulian);

            let d3 = Cesium.JulianDate.secondsDifference( this.storeStop, this._startJulian);
            this.startTimeStore = this._topDiv.clientWidth * d2 / d1;
            this.stopTimeStore = this._topDiv.clientWidth * d3 / d1;
        }
    },
    watch:{
        currentTime( val){
            //执行回调，修改timeLine中的当前时间
            this.updateFromClock();
        },
        startTime(){
            this.zoomTo( this.startTime, this.stopTime);
            this._secondsBetStartAndStop = Cesium.JulianDate.secondsDifference( this.stopTime, this.startTime);
        },
        stopTime(){
            this.zoomTo( this.startTime, this.stopTime);
            this._secondsBetStartAndStop = Cesium.JulianDate.secondsDifference( this.stopTime, this.startTime);
        },
        showType(){
            this._makeTics();
        }
    },
    computed:{
        status(){
            if(this.shouldAnimate && this.multiplier > 0){
                return 'play';
            }else if(this.shouldAnimate && this.multiplier < 0){
                return 'backPlay';
            }else{
                return 'pause';
            }
        },
        now(){
            let current = (Cesium.JulianDate.toDate( this.currentTime)).getTime();
            let start = (Cesium.JulianDate.toDate( this.startTime)).getTime();
            let stop = (Cesium.JulianDate.toDate( this.stopTime)).getTime();
            return (current - start)/(stop - start);
        },
        //timeLine上的时间应该是多个，这里只展示开始和结束
        startString(){
            this.start = (this.getDateFromJulian(this.startTime, this.showType)).format('yyyy-MM-ddThh:mm:ss');
            return (this.getDateFromJulian(this.startTime, this.showType)).format('yyyy-MM-dd hh:mm:ss');
        },
        stopString(){
            this.stop = (this.getDateFromJulian(this.stopTime, this.showType)).format('yyyy-MM-ddThh:mm:ss');
            return (this.getDateFromJulian(this.stopTime, this.showType)).format('yyyy-MM-dd hh:mm:ss');
        },
        currentString(){
            this.current = (this.getDateFromJulian(this.currentTime, this.showType)).format('yyyy-MM-ddThh:mm:ss');
            return (this.getDateFromJulian(this.currentTime, this.showType)).format('yyyy-MM-dd hh:mm:ss');
        },
    },
    beforeDestroy(){
        this.destroy();
        this._unbind.map( (unbind)=>{
            unbind();
            return null;
        });
    }
}

function createMouseDownCallback(timeline) {
    return function(e) {
        if (timeline._mouseMode !== timelineMouseMode.touchOnly) {
            if (e.button === 0) {
                timeline._mouseMode = timelineMouseMode.scrub;
                if (timeline._scrubElement) {
                    timeline._scrubElement.style.backgroundPosition = '-16px 0';
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
            timeline._scrubElement.style.backgroundPosition = '0 0';
        }
        timeline._timelineDrag = 0;
        timeline._timelineDragLocation = undefined;
        timeline.computeStartAndStop();
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
                timeline._setTimeBarTime(x, x * timeline._timeBarSecondsSpan / timeline._topDiv.clientWidth);
            }

        } else if (timeline._mouseMode === timelineMouseMode.slide) {
            dx = timeline._mouseX - e.clientX;
            timeline._mouseX = e.clientX;
            if (dx !== 0) {
                var dsec = dx * timeline._timeBarSecondsSpan / timeline._topDiv.clientWidth;
                timeline.zoomTo(JulianDate.addSeconds(timeline._startJulian, dsec, new JulianDate()), JulianDate.addSeconds(timeline._endJulian, dsec, new JulianDate()));
            }
        } else if (timeline._mouseMode === timelineMouseMode.zoom) {
            dx = timeline._mouseX - e.clientX;
            timeline._mouseX = e.clientX;
            if (dx !== 0) {
                timeline.zoomFrom(Math.pow(1.01, dx));
            }
        }
        timeline.computeStartAndStop();
    };
}

function createMouseWheelCallback(timeline) {
    return function(e) {
        var dy = e.wheelDeltaY || e.wheelDelta || (-e.detail);
        timelineWheelDelta = Math.max(Math.min(Math.abs(dy), timelineWheelDelta), 1);
        dy /= timelineWheelDelta;
        timeline.zoomFrom(Math.pow(1.05, -dy));
        timeline.computeStartAndStop();
    };
}

function createTouchStartCallback(timeline) {
    return function(e) {
        var len = e.touches.length, seconds, xPos, leftX = timeline._topDiv.getBoundingClientRect().left;
        e.preventDefault();
        timeline._mouseMode = timelineMouseMode.touchOnly;
        if (len === 1) {
            seconds = JulianDate.secondsDifference(timeline._scrubJulian, timeline._startJulian);
            xPos = Math.round(seconds * timeline._topDiv.clientWidth / timeline._timeBarSecondsSpan + leftX);
            if (Math.abs(e.touches[0].clientX - xPos) < 50) {
                timeline._touchMode = timelineTouchMode.scrub;
                if (timeline._scrubElement) {
                    timeline._scrubElement.style.backgroundPosition = (len === 1) ? '-16px 0' : '0 0';
                }
            } else {
                timeline._touchMode = timelineTouchMode.singleTap;
                timeline._touchState.centerX = e.touches[0].clientX - leftX;
            }
        } else if (len === 2) {
            timeline._touchMode = timelineTouchMode.slideZoom;
            timeline._touchState.centerX = (e.touches[0].clientX + e.touches[1].clientX) * 0.5 - leftX;
            timeline._touchState.spanX = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
        } else {
            timeline._touchMode = timelineTouchMode.ignore;
        }
    };
}

function createTouchEndCallback(timeline) {
    return function(e) {
        var len = e.touches.length, leftX = timeline._topDiv.getBoundingClientRect().left;
        if (timeline._touchMode === timelineTouchMode.singleTap) {
            timeline._touchMode = timelineTouchMode.scrub;
            timeline._onTouchMove(e);
        } else if (timeline._touchMode === timelineTouchMode.scrub) {
            timeline._onTouchMove(e);
        }
        timeline._mouseMode = timelineMouseMode.touchOnly;
        if (len !== 1) {
            timeline._touchMode = (len > 0) ? timelineTouchMode.ignore : timelineTouchMode.none;
        } else if (timeline._touchMode === timelineTouchMode.slideZoom) {
            timeline._touchState.centerX = e.touches[0].clientX - leftX;
        }
        if (timeline._scrubElement) {
            timeline._scrubElement.style.backgroundPosition = '0 0';
        }
    };
}

function createTouchMoveCallback(timeline) {
    return function(e) {
        var dx, x, len, newCenter, newSpan, newStartTime, zoom = 1, leftX = timeline._topDiv.getBoundingClientRect().left;
        if (timeline._touchMode === timelineTouchMode.singleTap) {
            timeline._touchMode = timelineTouchMode.slideZoom;
        }
        timeline._mouseMode = timelineMouseMode.touchOnly;
        if (timeline._touchMode === timelineTouchMode.scrub) {
            e.preventDefault();
            if (e.changedTouches.length === 1) {
                x = e.changedTouches[0].clientX - leftX;
                if ((x >= 0) && (x <= timeline._topDiv.clientWidth)) {
                    timeline._setTimeBarTime(x, x * timeline._timeBarSecondsSpan / timeline._topDiv.clientWidth);
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
                if ((newSpan > 0) && (timeline._touchState.spanX > 0)) {
                    // Zoom and slide
                    zoom = (timeline._touchState.spanX / newSpan);
                    newStartTime = JulianDate.addSeconds(timeline._startJulian, ((timeline._touchState.centerX * timeline._timeBarSecondsSpan) - (newCenter * timeline._timeBarSecondsSpan * zoom)) / timeline._topDiv.clientWidth, new JulianDate());
                } else {
                    // Slide to newCenter
                    dx = timeline._touchState.centerX - newCenter;
                    newStartTime = JulianDate.addSeconds(timeline._startJulian, dx * timeline._timeBarSecondsSpan / timeline._topDiv.clientWidth, new JulianDate());
                }

                timeline.zoomTo(newStartTime, JulianDate.addSeconds(newStartTime, timeline._timeBarSecondsSpan * zoom, new JulianDate()));
                timeline._touchState.centerX = newCenter;
                timeline._touchState.spanX = newSpan;
            }
        }
    };
}
</script>

<style scoped>

.timelineContainer{
    position: absolute;
    left:20px;
    right:20px;
    bottom: 20px;
    height: 28px;
    background: rgb(255, 0, 255);
}
.animationContainer{
    position: absolute;
    left: 0px;
    bottom: 400px;
    height: 20px;
}

.defultbtn {
    display: inline-block;
    text-align: center;
    min-width: 60px;
    height: 38px;
    padding: 0 10px;
    line-height: 38px;
    border-radius: 100px;
    border: 1px solid #C9C9C9;
    background-color: #FFF;
    color: #555;
    cursor: pointer;
}

.defultbtn:hover {
    background-color: #b3daf8;
}

.btnon {
    background-color: #1E9FFF;
    color: #fff;
    border: 1px solid #1E9FFF;
}

input {
    width: 222px;
}

.colorbox {
    width: 50px;
}

.timeline-storetime{
    height: 18px;
    width:2px;
    background-color: #1E9FFF;
    position: absolute;
}
</style>