<template>
  <div :style="{...colorStyle}" class="mapgis-ui-sketch-color-picker" :class="{colorContainerLarge: size === 'large',colorContainerSmall: size === 'small'}">
    <mapgis-ui-popover trigger="click">
      <template slot="content">
        <sketch-picker
            class="sketch-color"
            :disableAlpha="disableAlpha"
            :value="pickColor"
            @input="onColorChange"
        />
      </template>
      <div class="color-container" :style="{padding: showBorder ? '9px 8px' : '0',border: showBorder ? 'border: 1px solid $border-color-base;' : 'none'}">
        <div :style="{ background: pickColor }" :title="color" class="color-div"></div>
      </div>
    </mapgis-ui-popover>
  </div>
</template>

<script>
import {Sketch} from "vue-color";

export default {
  name: "mapgis-ui-sketch-color-picker",
  components: {"sketch-picker": Sketch},
  props: {
    color: {
      type: String,
      required: true,
      default: "rgb(255,255,102)"
    },
    disableAlpha: {
      type: Boolean,
      required: false,
      default: true
    },
    extraValue: {
      type: [Object, String, Number, Boolean]
    },
    size: {
      type: String
    },
    showBorder: {
      type: Boolean,
      default: true
    },
    colorStyle: {
      type: Object
    }
  },
  computed: {
    pickColor: {
      get() {
        return this.color;
      },
      set(val) {
        this.$emit("update:color", val);
      }
    }
  },
  methods: {
    onColorChange(val) {
      this.getPickColor(val);
      this.$emit("input", val, this.extraValue);
    },
    // 颜色拾取器选中事件回调
    getPickColor(val) {
      this.pickColor = this.colorObjectToRgba(val.rgba, this.disableAlpha);
    },
    colorObjectToRgba(rgba, disableAlpha) {
      let colorStr = "";
      if (rgba.a !== undefined) {
        colorStr = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
        // 已传入disableAlpha，并且为true
        if (disableAlpha) {
          colorStr = `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;
        }
      } else {
        colorStr = `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;
      }
      return colorStr;
    }
  }
};
</script>
