
<template>
    <EditableSlider
        :value="valueInDegrees"
        @input="onInput"
        :originSliderValue="originSliderValueInDegrees"
        :sliderRange="sliderRangeInDegrees"
        :toChangeRangeCallback="toChangeRangeCallback"
        :disabled="disabled"
        :fixNumber="fixNumber"
        :min="minInDegrees"
        :max="maxInDegrees"
    ></EditableSlider>
</template>

<script>
//import Cesium from 'Cesium';
import EditableSlider from './EditableSlider';

const tr = Cesium.Math.toRadians;
const td = Cesium.Math.toDegrees;

function vtxfEqual(left, right) {
    return Cesium.Math.equalsEpsilon(left, right, Cesium.Math.EPSILON7)
}

export default {
    components: {
        EditableSlider,
    },
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
    computed: {
        valueInDegrees: function () {
            return td(this.value);
        },
        originSliderValueInDegrees: function () {
            return td(this.originSliderValue);
        },
        sliderRangeInDegrees: function () {
            return td(this.sliderRange);
        },
        minInDegrees: function () {
            if (typeof this.min === 'undefined') {
                return undefined;
            } else {
                return td(this.min);
            }
        },
        maxInDegrees: function () {
            if (typeof this.max === 'undefined') {
                return undefined;
            } else {
                return td(this.max);
            }
        },
    },
    methods: {
        onInput(valueInDegrees) {
            if (typeof valueInDegrees !== 'undefined') {
                const value = tr(valueInDegrees);
                if (!vtxfEqual(this.value, value)) {
                    this.$emit('input', value);
                }
            }
        }
    }
};
</script>

<style>

</style>
