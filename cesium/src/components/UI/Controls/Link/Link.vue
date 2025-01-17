<template>
  <span />
</template>

<script>
import { ScreenSpaceEventType } from "../../../../lib/Event/ScreenSpaceEventType";
import { deepCopy } from "../../../Utils/deepequal";

export default {
  name: "mapgis-3d-link",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    enable: { type: Boolean, default: false },
    includes: { type: Array, default: () => [] },
    excludes: { type: Array, default: () => [] },
    screenSpaceEventType: {
      type: Array,
      default: () => [
        ScreenSpaceEventType.WHEEL,
        ScreenSpaceEventType.MOUSE_MOVE,
        ScreenSpaceEventType.LEFT_UP,
        ScreenSpaceEventType.LEFT_DOWN,
        ScreenSpaceEventType.RIGHT_UP,
        ScreenSpaceEventType.RIGHT_DOWN
      ]
    },
    vueKey: {
      type: String,
      default: "default"
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    },
    timestamp: {
      type: Number,
      default: 0 // 毫秒
    },
    interval: {
      type: Number,
      default: 60
    }
  },
  model: {
    prop: "view",
    event: "change"
  },
  data() {
    return {
      time: 0,
      stamp: -1,
      active: false
    };
  },
  watch: {
    enable: function(news) {
      if (news) {
        this.addHandler();
      } else {
        this.deleteHandler();
      }
    }
  },
  mounted() {
    if (this.enable) {
      this.addHandler();
    }
  },
  destroyed() {
    this.deleteHandler();
  },
  methods: {
    getInstanceOptions() {
      let instanceOptions;
      let { vueKey, CesiumZondy } = this;
      CesiumZondy = CesiumZondy || window.CesiumZondy;
      if (vueKey !== "default") {
        instanceOptions = CesiumZondy.GlobesManager[vueKey][0].options;
      }
      return instanceOptions;
    },
    checkValid(viewer, camera, parent) {
      const { includes, excludes } = this;
      if (includes.length === 0 && excludes.length === 0) {
        this.setView(viewer, camera);
      } else if (
        includes &&
        excludes &&
        includes.length > 0 &&
        excludes.length >= 0 &&
        includes.indexOf(parent) >= 0
      ) {
        this.setView(viewer, camera);
      } else if (
        includes &&
        excludes &&
        includes.length === 0 &&
        excludes.length > 0 &&
        excludes.indexOf(parent) < 0
      ) {
        this.setView(viewer, camera);
      }
    },
    updateView(camera) {
      let { interval, timestamp } = this;
      // 针对按帧刷新或者按照时间戳刷新走不同的分支
      if (timestamp > 0) {
        let curstamp = new Date().getTime();
        if (curstamp - this.stamp > timestamp) {
          this.updateRect(camera);
          this.stamp = curstamp;
        }
      } else {
        // 一秒60帧，每秒更新一次，减少无效更新
        if (++this.time % interval === 0) {
          this.updateRect(camera);
        }
        if (this.time > 1000000) this.time = 0;
      }
    },
    updateRect(camera) {
      let view3d = {
        destination: deepCopy(camera.position),
        orientation: {
          direction: deepCopy(camera._direction),
          up: deepCopy(camera.up),
          heading: deepCopy(camera.heading),
          pitch: deepCopy(camera.pitch),
          roll: deepCopy(camera.roll)
        }
      };
      let rect = camera.computeViewRectangle();
      let rect2d = { west: 0, east: 0, north: 0, south: 0 };
      rect2d.west = Cesium.Math.toDegrees(rect.west);
      rect2d.east = Cesium.Math.toDegrees(rect.east);
      rect2d.north = Cesium.Math.toDegrees(rect.north);
      rect2d.south = Cesium.Math.toDegrees(rect.south);
      this.$emit("change", {
        "3d": view3d,
        "2d": rect2d
      });
    },
    setView(viewer, camera) {
      let view3d = {
        destination: deepCopy(camera.position),
        orientation: {
          direction: deepCopy(camera._direction),
          up: deepCopy(camera.up),
          heading: deepCopy(camera.heading),
          pitch: deepCopy(camera.pitch),
          roll: deepCopy(camera.roll)
        }
      };
      viewer.camera.setView(view3d);
    },
    addHandler() {
      let { CesiumZondy, includes, excludes, screenSpaceEventType } = this;
      CesiumZondy = CesiumZondy || window.CesiumZondy;
      let sources = CesiumZondy.GlobesManager.flatAllSource();
      let vm = this;

      this.stamp = new Date().getTime();

      for (let i = 0; i < sources.length; i++) {
        let s = sources[i];
        if (includes && includes.length > 0 && includes.indexOf(s.parent) < 0) {
          continue;
        }
        if (
          (!includes || includes.length == 0) &&
          excludes &&
          excludes.length > 0 &&
          excludes.indexOf(s.parent) >= 0
        ) {
          continue;
        }

        s.options.ScreenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
          s.source.viewer.scene.canvas
        );

        s.source.viewer.camera.changed.addEventListener(() => {
          vm.updateView(s.source.viewer.camera);
        });

        screenSpaceEventType.forEach(item => {
          s.options.ScreenSpaceEventHandler.setInputAction(function(movement) {
            if (item.type == "LEFT_DOWN" || item.type == "RIGHT_DOWN") {
              vm.active = true;
            } else if (item.type == "LEFT_UP" || item.type == "RIGHT_UP") {
              vm.active = false;
            } else if (item.type == "MOUSE_MOVE") {
              if (!vm.active) return;
            }

            vm.updateView(s.source.viewer.camera);
            let _camerca = s.source.viewer.camera;
            sources.forEach((other, j) => {
              if (i != j) {
                vm.checkValid(other.source.viewer, _camerca, other.parent);
              }
            });
          }, Cesium.ScreenSpaceEventType[item.type]);
        });
      }
    },
    deleteHandler() {
      let { CesiumZondy, screenSpaceEventType } = this;
      CesiumZondy = CesiumZondy || window.CesiumZondy;
      /* 这段代码要结合WebGlobe里面的如下代码才能明白
      window.CesiumZondy.GlobesManager.addSource(vueKey, vueIndex, webGlobe, {
        ScreenSpaceEventHandler: undefined,
      }); */
      const instance = this.getInstanceOptions();
      if (instance) {
        const handler = instance.ScreenSpaceEventHandler;
        if (handler) {
          screenSpaceEventType.forEach(item => {
            handler.removeInputAction(Cesium.ScreenSpaceEventType[item.type]);
          });
          handler.destroy();
        }
      }

      let sources = CesiumZondy.GlobesManager.flatAllSource();
      sources.forEach((s, i) => {
        if (s.options.ScreenSpaceEventHandler) {
          screenSpaceEventType.forEach(item => {
            s.options.ScreenSpaceEventHandler.removeInputAction(
              Cesium.ScreenSpaceEventType[item.type]
            );
          });
          s.source.viewer.camera.changed.removeEventListener(() => {
            vm.updateView(s.source.viewer.camera);
          });
          // s.options.ScreenSpaceEventHandler.destroy();
        }
      });
    }
  }
};
</script>

<style></style>
