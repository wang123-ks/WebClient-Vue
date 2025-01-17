<template>
  <span />
</template>
<script>
import { DataSet, canvasClear } from "mapv";
import { MapvLayer } from "./mapv/MapvLayer";
import { MRFS } from "@mapgis/webclient-es6-service";
const { VFeature } = MRFS;

export default {
  name: "mapgis-3d-mapv-layer",
  props: {
    geojson: {
      type: Object,
      required: true
    },
    countField: {
      type: String,
      default: "count"
    },
    options: {
      type: Object,
      default() {
        return {
          context: "2d",
          draw: "heatmap"
        };
      }
    }
  },
  inject: ["Cesium", "webGlobe"],
  watch: {
    geojson: {
      deep: true,
      handler() {
        const vm = this;
        this.dataSet = this.initData(this.geojson);
        if (!this.dataSet && this.mapvLayer) {
          this.mapvLayer.destroy();
          this.mapvLayer = undefined;
        }
        if (!this.mapvLayer) {
          this.mount();
        } else {
          this.mapvLayer.updateData(this.dataSet, this.options);
          // return new MapvLayer(this.webGlobe.viewer, this.dataset, this.options);
        }
      }
    },
    options: {
      deep: true,
      handler() {
        if (!this.mapvLayer) {
          return;
        }
        if (!this.options.cesium) {
          this.options.cesium = {
            postRender: true,
            postRenderFrame: 0
          };
        }
        this.mapvLayer.updateData(this.dataSet, this.options);
      }
    }
  },
  methods: {
    createCesiumObject() {
      const { webGlobe } = this;
      const viewer = webGlobe.viewer;
      this.dataset = this.initData();
      if (!this.dataset) {
        return;
      }
      if (!this.options.cesium) {
        this.options.cesium = {
          postRender: true,
          postRenderFrame: 0
        };
      }
      return new MapvLayer(viewer, this.dataset, this.options);
    },
    initData(geojson) {
      let vm = this;
      let data = [];
      geojson = geojson || this.geojson;
      if (!geojson.hasOwnProperty("features")) {
        geojson = this.$_convertData(geojson);
      }
      // 构造数据
      var features = geojson.features;
      if (!features) {
        return;
      }
      for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        const fType = feature.geometry.type;
        const coordinates = feature.geometry.coordinates;
        let countValue = feature.properties[this.countField];
        if (countValue){
          countValue = vm.isNumber(countValue) ? countValue : Number(countValue);
        } else {
          countValue = 30 * Math.random()
        }
        let timeValue = feature.properties.time;
        if (timeValue){
          timeValue = vm.isNumber(timeValue) ? timeValue : Number(timeValue);
        } else {
          timeValue = 100 * Math.random()
        }
        if (fType === "Point") {
          let obj = Object.assign(
            {
              geometry: {
                type: "Point",
                coordinates: coordinates
              },
              count: countValue,
              time: timeValue
            },
            feature.properties
          );
          data.push(obj);
        } else if (fType === "LineString") {
          let obj = Object.assign(
            {
              geometry: {
                type: "LineString",
                coordinates: coordinates
              },
              count: countValue,
              time: timeValue
            },
            feature.properties
          );
          data.push(obj);
        } else if (fType === "Polygon") {
          let obj = Object.assign(
            {
              geometry: {
                type: "Polygon",
                coordinates: coordinates
              },
              count: countValue,
              time: timeValue
            },
            feature.properties
          );
          data.push(obj);
        }
      }
      var dataSet = new DataSet(data);
      return dataSet;
    },
    isNumber(obj){
      typeof obj === "number" && !isNaN(obj)
    },
    $_convertData(geojson) {
      let data = VFeature.resultToGeojson(geojson);
      return data;
    },
    mount() {
      this.mapvLayer = this.createCesiumObject();
    },
    unmount() {
      const { webGlobe, mapvLayer } = this;
      const viewer = webGlobe.viewer;
      return !viewer.isDestroyed() && mapvLayer.destroy();
    }
  },
  beforeDestroy() {
    let { mapvLayer } = this;
    if (mapvLayer) {
      // canvasClear(this.mapvLayer.mapVOptions.context)
      mapvLayer.remove();
      mapvLayer = undefined;
    }
  },
  destroyed() {
    this.unmount();
  },
  created() {
    this.mount();
    // this.watchProp();
  }
};
</script>
