<template>
  <div class="mapgis-3d-measure">
    <slot v-if="initial"></slot>
    <slot name="measureTool">
      <measure-3d-tool/>
    </slot>
  </div>
</template>

<style></style>

<script>
import ServiceLayer from "../ServiceLayer";
import Measure3dTool from "./components/MeasureTool.vue";

export default {
  name: "mapgis-3d-measure",
  mixins: [ServiceLayer],
  components: {
    "measure-3d-tool": Measure3dTool
  },
  props: {
    styles: {
      type: Object,
      default() {
        return {
          lineColor: "black"
        };
      }
    },
    measureOptions: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      measure: undefined,
      initial: false,
      measureStyles: {},
      waitManagerName: "GlobesManager"
    };
  },
  watch: {
    styles: {
      handler: function () {
        this.initStyles();
      },
      deep: true
    },
    measureOptions: {
      handler: function () {
        this.measureOptions = this.$_formatOptions(this.measureOptions);
      },
      deep: true
    }
  },
  mounted() {
    let vm = this;
    this.measureOptions = this.$_formatOptions(this.measureOptions);
    this.$_init(function () {
      vm.initStyles();
      vm.initial = true;
      vm.$emit("load", vm);
    });
  },
  destroyed() {
    this.deleteMeasure();
    this.$emit("unload");
  },
  methods: {
    initStyles() {
      this.measureStyles.lineColor = Cesium.Color.fromCssColorString(
        this.styles.lineColor,
        this.measureStyles.lineColor
      );
    },
    measureCallBack(result) {
      if (result instanceof Array) {
        for (let i = 0; i < result.length; i++) {
          result[i] = result[i] / 1000;
        }
      }
      this.$emit("measured", result);
    },
    enableMeasureLength() {
      this.$_enableMeasure("MeasureLengthTool");
    },
    enableMeasureArea() {
      this.$_enableMeasure("MeasureAreaTool");
    },
    enableMeasureTriangle() {
      this.$_enableMeasure("TriangulationTool");
    },
    enableMeasureSlope() {
      this.$_enableMeasure("MeasureSlopeTool");
    },
    $_formatOptions(options) {
      const colorArr = ["fillColor", "outlineColor", "backgroundColor", "lineColor", "areaColor"];
      for (let i=0;i<colorArr.length;i++){
        if(options.hasOwnProperty(colorArr[i]) && typeof options[colorArr[i]] === "string"){
          options[colorArr[i]] = Cesium.Color.fromCssColorString(options[colorArr[i]]);
        }
      }
      return options;
    },
    $_enableMeasure(MeasureName) {
      const {vueKey, vueIndex} = this;
      let webGlobe = this.$_getObject(this.waitManagerName, this.deleteMeasure);
      let measureOptions = {
        lineColor: this.measureStyles.lineColor,
        callBack: result => {
          if (typeof callback === "function") {
            callback(result);
          } else {
            this.measureCallBack(result);
          }
        }
      }
      measureOptions = Object.assign(measureOptions, this.measureOptions);
      let measure = new Cesium[MeasureName](webGlobe.viewer, measureOptions);
      window.CesiumZondy.MeasureToolManager.addSource(
        vueKey,
        vueIndex,
        measure
      );
      measure.startTool();
    },
    deleteMeasure() {
      this.$_deleteManger("MeasureToolManager", function (manager) {
        if (manager.source) {
          manager.source.stopTool();
        }
      });
    },
    remove() {
      this.deleteMeasure();
    }
  }
};
</script>
