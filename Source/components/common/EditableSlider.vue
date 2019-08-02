
<template>
    <div>
        <div style="width: calc(100% - 100px); display: inline-block;">
            <Slider
                @on-change="toChangeRangeCallbackWrap"
                :value="value"
                @on-input="onSliderInputChanged"
                :min="originSliderValue-sliderRange"
                :max="originSliderValue+sliderRange"
                :step="0.01*sliderRange"
                show-tip="never"
                :disabled="disabled"
            ></Slider>
        </div>
        <InputNumber
            :disabled="disabled" 
            :value="inputValue"
            @on-change="onInputNumberChanged" 
            :step="0.01*sliderRange" 
            style="width: 80px; vertical-align: top; margin-left: 5px;"
        ></InputNumber>
    </div>
</template>

<script>

function clamp(value, min, max) {
    if (typeof min !== 'undefined' && typeof max !== 'undefined' && min > max) {
        console.error('min max error!');
        return value;
    }

    if (typeof min !== 'undefined' && value < min) {
        return min;
    }
    if (typeof max !== 'undefined' && value > max) {
        return max;
    }

    return value;
}

export default {
    props: {
        value: Number,
        originSliderValue: Number,
        sliderRange: Number,
        toChangeRangeCallback: Function,
        disabled: {
            type: Boolean,
            default: false,
        },
        fixNumber: {
            type: Number,
            default: 2,
        },
        min: Number,
        max: Number,
    },
    data() {
        return {
        };
    },
    watch: {
        value: function (val) {
            this.value = clamp(val, this.min, this.max);
        }
    },
    computed: {
        tempPrecision: function () {
            return Math.pow(10, this.fixNumber);
        },
        inputValue: function () {
            return Math.round(this.tempPrecision * this.value) / this.tempPrecision;
        }
    },
    methods: {
        onSliderInputChanged(value) {
            if (typeof value !== 'undefined') {
                value = clamp(value, this.min, this.max);
                this.$emit('input', value);
            }
        },
        onInputNumberChanged(value) {
            if (typeof value !== 'undefined') {
                if (this.inputValue !== value) {
                    value = clamp(value, this.min, this.max);
                    this.$emit('input', value);
                }

                this.toChangeRangeCallbackWrap();
            }
        },
        toChangeRangeCallbackWrap() {
            if (typeof this.toChangeRangeCallback !== 'undefined') {
                this.toChangeRangeCallback();
            }
        }
    }
};
</script>

<style>

</style>
