<template>
  <div class="mapgis-widget-visual-analysis">
    <mapgis-ui-setting-form v-model="formData" :wrapper-width="280">
      <mapgis-ui-form-item label="水平视角">
        <mapgis-ui-input
          v-model.number="formData.horizontAngle"
          :min="1"
          type="number"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="垂直视角">
        <mapgis-ui-input
          v-model.number="formData.verticalAngle"
          :min="1"
          type="number"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="附加高度(米)">
        <mapgis-ui-input
          v-model.number="formData.exHeight"
          type="number"
          :min="0"
          :step="0.1"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="方向角">
        <mapgis-ui-input
          v-model.number="angleSet.heading"
          :min="0"
          :max="360"
          type="number"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="俯仰角">
        <mapgis-ui-input
          v-model.number="angleSet.pitch"
          :min="-90"
          :max="90"
          type="number"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="可视距离(米)">
        <mapgis-ui-input
          v-model.number="angleSet.viewRadius"
          :min="0"
          type="number"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="观察点坐标">
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <mapgis-ui-input
              v-model.number="posData.viewPositionX"
              :step="0.0001"
              type="number"
              placeholder="经度"
            />
          </mapgis-ui-col>
          <mapgis-ui-col :span="8">
            <mapgis-ui-input
              v-model.number="posData.viewPositionY"
              :step="0.0001"
              type="number"
              placeholder="纬度"
            />
          </mapgis-ui-col>
          <mapgis-ui-col :span="8">
            <mapgis-ui-input
              v-model.number="posData.viewPositionZ"
              type="number"
              placeholder="高度"
            />
          </mapgis-ui-col>
        </mapgis-ui-row>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="目标点坐标">
        <mapgis-ui-row>
          <mapgis-ui-col :span="8">
            <mapgis-ui-input
              v-model.number="posData.targetPositionX"
              :step="0.0001"
              type="number"
              placeholder="经度"
            />
          </mapgis-ui-col>
          <mapgis-ui-col :span="8">
            <mapgis-ui-input
              v-model.number="posData.targetPositionY"
              :step="0.0001"
              type="number"
              placeholder="纬度"
            />
          </mapgis-ui-col>
          <mapgis-ui-col :span="8">
            <mapgis-ui-input
              v-model.number="posData.targetPositionZ"
              type="number"
              placeholder="高度"
            />
          </mapgis-ui-col>
        </mapgis-ui-row>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="不可视区域颜色">
        <mapgis-ui-sketch-color-picker
          :disableAlpha="false"
          :color="formData.unVisibleColor"
          @input="
            val =>
              (formData.unVisibleColor = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`)
          "
        ></mapgis-ui-sketch-color-picker>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="可视区域颜色">
        <mapgis-ui-sketch-color-picker
          :disableAlpha="false"
          :color="formData.visibleColor"
          @input="
            val =>
              (formData.visibleColor = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`)
          "
        ></mapgis-ui-sketch-color-picker>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="可视遮罩颜色">
        <mapgis-ui-sketch-color-picker
          :disableAlpha="false"
          :color="formData.maskColor"
          @input="
            val =>
              (formData.maskColor = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`)
          "
        ></mapgis-ui-sketch-color-picker>
      </mapgis-ui-form-item>
    </mapgis-ui-setting-form>
    <!--    </div>-->
    <mapgis-ui-setting-footer>
      <mapgis-ui-button type="primary" @click="onClickStart"
        >分析</mapgis-ui-button
      >
      <mapgis-ui-button @click="onClickStop">清除</mapgis-ui-button>
    </mapgis-ui-setting-footer>
  </div>
</template>

<script>
import VueOptions from "../Base/Vue/VueOptions";
import {
  isDepthTestAgainstTerrainEnable,
  setDepthTestAgainstTerrainEnable
} from "../WebGlobe/util";

export default {
  name: "mapgis-3d-viewshed",
  props: {
    ...VueOptions,
    /**
     * @type Number
     * @default 60
     * @description 观察点的水平视角
     */
    horizontAngle: {
      type: Number,
      default: 60
    },
    /**
     * @type Number
     * @default 60
     * @description 观察点的垂直视角
     */
    verticalAngle: {
      type: Number,
      default: 60
    },
    /**
     * @type String
     * @default '#ff0000'
     * @description 不可视区域颜色
     */
    unVisibleColor: {
      type: String,
      default: "#ff0000"
    },
    /**
     * @type String
     * @default '#00ff00'
     * @description 可视区域颜色
     */
    visibleColor: {
      type: String,
      default: "#00ff00"
    },
    /**
     * @type String
     * @default 'rgba(37, 218, 169, 0.2)'
     * @description 可视遮罩颜色
     */
    maskColor: {
      type: String,
      default: "rgba(37, 218, 169, 0.2)"
    },
    /**
     * @type Number
     * @default 1.85
     * @description 观察点的附加高度/米
     */
    exHeight: {
      type: Number,
      default: 1.85
    }
  },
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  data() {
    return {
      formData: {
        horizontAngle: 60,
        verticalAngle: 60,
        unVisibleColor: "#ff0000",
        visibleColor: "#00ff00",
        maskColor: "rgba(37, 218, 169, 0.2)",
        exHeight: 1.85
      },
      angleSet: {
        //方向角
        heading: 0,
        // 俯仰角
        pitch: 0,
        // 可视距离
        viewRadius: 0
      },
      // 坐标数据
      posData: {
        viewPositionX: "",
        viewPositionY: "",
        viewPositionZ: "",
        targetPositionX: "",
        targetPositionY: "",
        targetPositionZ: ""
      },

      // 是否为鼠标注册了监听事件
      isAddEventListener: false,

      // 是否已选择观察点位置
      hasViewPosition: false,

      // 是否可以进行可视域分析
      isAnalyze: false,

      // 是否具有初始目标点
      isHasTargetPos: false,

      // 观察点
      viewPoint: undefined,

      isDepthTestAgainstTerrainEnable: undefined // 深度检测是否已开启，默认为undefined，当这个值为undefined的时候，说明没有赋值，不做任何处理
    };
  },
  watch: {
    horizontAngle: {
      handler: function(newVal, oldVal) {
        this.formData.horizontAngle = newVal;
      },
      immediate: true
    },
    verticalAngle: {
      handler: function(newVal, oldVal) {
        this.formData.verticalAngle = newVal;
      },
      immediate: true
    },
    unVisibleColor: {
      handler: function(newVal, oldVal) {
        this.formData.unVisibleColor = newVal;
      },
      immediate: true
    },
    visibleColor: {
      handler: function(newVal, oldVal) {
        this.formData.visibleColor = newVal;
      },
      immediate: true
    },
    maskColor: {
      handler: function(newVal, oldVal) {
        this.formData.maskColor = newVal;
      },
      immediate: true
    },
    exHeight: {
      handler: function(newVal, oldVal) {
        this.formData.exHeight = newVal;
      },
      immediate: true
    },
    formData: {
      deep: true,
      handler: function(newVal, oldVal) {
        let { Cesium } = this;
        let find = this.findSource();
        const unVisibleColor = new Cesium.Color.fromCssColorString(
          newVal.unVisibleColor
        );
        const visibleColor = new Cesium.Color.fromCssColorString(
          newVal.visibleColor
        );
        const maskColor = new Cesium.Color.fromCssColorString(newVal.maskColor);

        if (find.options.visualAnalysis) {
          let visualAnalysis = find.options.visualAnalysis;
          visualAnalysis.unVisibleColor = unVisibleColor;
          visualAnalysis.visibleColor = visibleColor;
          visualAnalysis._fanColor = maskColor;
          visualAnalysis.horizontAngle = newVal.horizontAngle;
          visualAnalysis.verticalAngle = newVal.verticalAngle;

          if (newVal.exHeight !== oldVal.exHeight) {
            let cartesian = visualAnalysis.viewPosition;
            // 获取当前坐标系标准
            const ellipsoid = this.webGlobe.viewer.scene.globe.ellipsoid;
            // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
            const cartographic = ellipsoid.cartesianToCartographic(cartesian);
            cartographic.height += newVal.exHeight - oldVal.exHeight;

            cartesian = Cesium.Cartographic.toCartesian(cartographic);
            visualAnalysis.viewPosition = cartesian;
            //赋值给manager
            CesiumZondy.ViewshedAnalysisManager.changeOptions(
              vueKey,
              vueIndex,
              "visualAnalysis",
              visualAnalysis
            );
            // 改变观察点坐标
            this.viewPoint.position._value = cartesian;
          }
        }
      }
    },
    angleSet: {
      deep: true,
      handler: function(newVal) {
        let { vueKey, vueIndex } = this;
        let find = this.findSource();
        if (find && find.options.visualAnalysis) {
          let visualAnalysis = find.options.visualAnalysis;
          visualAnalysis.heading = newVal.heading;
          visualAnalysis.pitch = newVal.pitch;
          visualAnalysis.viewRadius = newVal.viewRadius;
          CesiumZondy.ViewshedAnalysisManager.changeOptions(
            vueKey,
            vueIndex,
            "visualAnalysis",
            visualAnalysis
          );
          this.updateTargetPosition(find.options.visualAnalysis.targetPosition);
        }
      }
    }
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
      const { baseUrl, options } = this;
      // return new Cesium.GeoJsonDataSource.load(baseUrl, options);
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    mount() {
      const { webGlobe, CesiumZondy, vueKey, vueIndex } = this;
      const { viewer } = webGlobe;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        vm.$emit("load", vm);
        CesiumZondy.ViewshedAnalysisManager.addSource(
          vueKey,
          vueIndex,
          dataSource,
          {
            visualAnalysis: null
          }
        );
      });
    },
    unmount() {
      let { vueKey, vueIndex } = this;
      this.onClickStop();
      CesiumZondy.ViewshedAnalysisManager.deleteSource(vueKey, vueIndex);
    },
    formDataClone() {
      let vm = this;
      vm.formDataCloneVal = JSON.parse(JSON.stringify(this.formData));
      return vm.formDataCloneVal;
    },

    // 若分析完成后，当方向角、俯仰角、可视距离变化时，更新目标点坐标
    updateTargetPosition(cartesian) {
      this.convertPosition(cartesian, "target");
    },

    // 将三维笛卡尔坐标转换为经纬度坐标
    convertPosition(position, type) {
      // 获取当前坐标系标准
      const ellipsoid = this.webGlobe.viewer.scene.globe.ellipsoid;
      // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
      const cartographic = ellipsoid.cartesianToCartographic(position);
      // 获取高度
      const height = cartographic.height.toFixed(8);

      // 获取该位置的经纬度坐标
      const centerLon = parseFloat(
        this.Cesium.Math.toDegrees(cartographic.longitude).toFixed(8)
      );
      const centerLat = parseFloat(
        this.Cesium.Math.toDegrees(cartographic.latitude).toFixed(8)
      );

      if (type === "view") {
        this.posData.viewPositionX = centerLon;
        this.posData.viewPositionY = centerLat;
        this.posData.viewPositionZ = height;
      } else {
        this.posData.targetPositionX = centerLon;
        this.posData.targetPositionY = centerLat;
        this.posData.targetPositionZ = height;
      }
    },

    // 点击开始分析按钮回调
    onClickStart() {
      this.startVisualAnalysis();

      if (
        this.posData.viewPositionX !== "" &&
        this.posData.viewPositionY !== "" &&
        this.posData.viewPositionZ !== "" &&
        this.posData.targetPositionX !== "" &&
        this.posData.targetPositionY !== "" &&
        this.posData.targetPositionZ !== ""
      ) {
        this.isHasTargetPos = false;
        // 注销鼠标的各项监听事件
        this.webGlobe.unRegisterMouseEvent("MOUSE_MOVE");
        this.webGlobe.unRegisterMouseEvent("LEFT_CLICK");
        this.webGlobe.unRegisterMouseEvent("RIGHT_CLICK");
        this.isAddEventListener = false;

        this.onInputStart();
      } else if (
        this.posData.viewPositionX === "" &&
        this.posData.viewPositionY === "" &&
        this.posData.viewPositionZ === "" &&
        this.posData.targetPositionX === "" &&
        this.posData.targetPositionY === "" &&
        this.posData.targetPositionZ === ""
      ) {
        this.isHasTargetPos = false;
        this.addEventListener();
      } else if (
        this.posData.viewPositionX !== "" &&
        this.posData.viewPositionY !== "" &&
        this.posData.viewPositionZ !== "" &&
        this.posData.targetPositionX === "" &&
        this.posData.targetPositionY === "" &&
        this.posData.targetPositionZ === ""
      ) {
        this.isHasTargetPos = false;
        let viewCartesian = this.Cesium.Cartesian3.fromDegrees(
          this.posData.viewPositionX,
          this.posData.viewPositionY,
          this.posData.viewPositionZ
        );

        const cartographic = this.updateExheight(viewCartesian);
        viewCartesian = this.Cesium.Cartographic.toCartesian(cartographic);

        // window.VisualAnalysisManage.visualAnalysis.viewPosition = viewCartesian;
        let find = this.findSource();
        find.options.visualAnalysis.viewPosition = viewCartesian;

        this.convertPosition(viewCartesian, "view");
        // 添加观察点到地图
        this.addViewPoint(viewCartesian);
        this.hasViewPosition = true;
        this.addEventListener();
      } else if (
        this.posData.viewPositionX === "" &&
        this.posData.viewPositionY === "" &&
        this.posData.viewPositionZ === "" &&
        this.posData.targetPositionX !== "" &&
        this.posData.targetPositionY !== "" &&
        this.posData.targetPositionZ !== ""
      ) {
        this.isHasTargetPos = true;
        this.addEventListener();
      } else {
        this.isHasTargetPos = false;
        this.addEventListener();
      }
    },

    // 开启可视域分析工具
    startVisualAnalysis() {
      let { webGlobe, Cesium, vueKey, vueIndex } = this;
      const viewer = webGlobe;
      this.isAnalyze = true;
      this.tilesetArray = this.webGlobe._m3dServerLayer;
      //深度检测开启
      this.isDepthTestAgainstTerrainEnable = isDepthTestAgainstTerrainEnable(
        this.webGlobe
      );
      if (!this.isDepthTestAgainstTerrainEnable) {
        // 如果深度检测没有开启，则开启
        setDepthTestAgainstTerrainEnable(true, this.webGlobe);
      }
      // 初始化分析工具
      let find = this.findSource();
      let { options } = find;
      let visualAnalysis = options.visualAnalysis;
      visualAnalysis = new Cesium.ViewshedAnalysis(viewer.scene);

      // 锁定图层帧数,只显示一个可视域结果
      for (let i = 0; i < this.tilesetArray.length; i++) {
        this.tilesetArray[i][0].debugFreezeFrame = true;
      }

      // 移除可视域分析结果
      this.webGlobe.viewer.scene.VisualAnalysisManager._visualAnalysisList = [];

      // 移除所有观察点
      this.webGlobe.viewer.entities.removeAll();

      // 设置可视域分析工具的配置
      const unVisibleColor = new this.Cesium.Color.fromCssColorString(
        this.formData.unVisibleColor
      );
      const visibleColor = new this.Cesium.Color.fromCssColorString(
        this.formData.visibleColor
      );
      const maskColor = new this.Cesium.Color.fromCssColorString(
        this.formData.maskColor
      );

      visualAnalysis.horizontAngle = this.formData.horizontAngle;
      visualAnalysis.verticalAngle = this.formData.verticalAngle;
      visualAnalysis._unVisibleColor = unVisibleColor;
      visualAnalysis._visibleColor = visibleColor;
      visualAnalysis._fanColor = maskColor;

      // 添加可视域分析结果显示
      this.webGlobe.viewer.scene.VisualAnalysisManager.add(visualAnalysis);
      //更新manager
      CesiumZondy.ViewshedAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "visualAnalysis",
        visualAnalysis
      );
    },
    // 通过输入坐标开始分析按钮
    onInputStart() {
      let viewCartesian = this.Cesium.Cartesian3.fromDegrees(
        this.posData.viewPositionX,
        this.posData.viewPositionY,
        this.posData.viewPositionZ
      );

      const cartographic = this.updateExheight(viewCartesian);
      viewCartesian = this.Cesium.Cartographic.toCartesian(cartographic);

      const targetCartesian = this.Cesium.Cartesian3.fromDegrees(
        this.posData.targetPositionX,
        this.posData.targetPositionY,
        this.posData.targetPositionZ
      );

      let find = this.findSource();
      find.options.visualAnalysis.viewPosition = viewCartesian;
      find.options.visualAnalysis.targetPosition = targetCartesian;

      this.setVisualAttrs();

      // 添加观察点到地图
      this.addViewPoint(viewCartesian);
    },

    // 获取更新附加高度后的地理坐标
    updateExheight(cartesian) {
      // 获取当前坐标系标准
      const ellipsoid = this.webGlobe.viewer.scene.globe.ellipsoid;
      // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
      const cartographic = ellipsoid.cartesianToCartographic(cartesian);
      // 抬高观察点
      cartographic.height += this.formData.exHeight;

      return cartographic;
    },

    // 分析完成时显示方向角、俯仰角、可视距离三种属性
    setVisualAttrs() {
      let find = this.findSource();
      const { heading, pitch, viewRadius } = find.options.visualAnalysis;

      this.angleSet.heading = heading.toFixed(2);
      this.angleSet.pitch = pitch.toFixed(2);
      this.angleSet.viewRadius = parseInt(viewRadius);
    },

    // 添加观察点到地图上
    addViewPoint(cartesian) {
      if (this.viewPoint) this.webGlobe.viewer.entities.remove(this.viewPoint);

      this.viewPoint = this.webGlobe.viewer.entities.add({
        position: cartesian,
        point: {
          color: this.Cesium.Color.BLUE,
          pixelSize: 10
        }
      });
    },

    /**
     * @description 恢复深度检测设置
     */
    _restoreDepthTestAgainstTerrain() {
      if (
        this.isDepthTestAgainstTerrainEnable !== undefined &&
        this.isDepthTestAgainstTerrainEnable !==
          isDepthTestAgainstTerrainEnable(this.webGlobe)
      ) {
        setDepthTestAgainstTerrainEnable(
          this.isDepthTestAgainstTerrainEnable,
          this.webGlobe
        );
      }
    },

    // 点击结束分析按钮回调
    onClickStop() {
      let { vueKey, vueIndex } = this;
      // 注销鼠标的各项监听事件
      this.webGlobe.unRegisterMouseEvent("MOUSE_MOVE");
      this.webGlobe.unRegisterMouseEvent("LEFT_CLICK");
      this.webGlobe.unRegisterMouseEvent("RIGHT_CLICK");

      // 清空观察点与目标点坐标
      this.posData.viewPositionX = "";
      this.posData.viewPositionY = "";
      this.posData.viewPositionZ = "";
      this.posData.targetPositionX = "";
      this.posData.targetPositionY = "";
      this.posData.targetPositionZ = "";

      // 清空方向角、俯仰角、可视距离
      this.angleSet.heading = 0;
      this.angleSet.pitch = 0;
      this.angleSet.viewRadius = 0;

      // 移除所有观察点
      this.webGlobe.viewer.entities.removeAll();

      for (let i = 0; i < (this.tilesetArray || []).length; i++) {
        this.tilesetArray[i][0].debugFreezeFrame = false;
      }

      // 移除可视域分析工具
      let find = this.findSource();
      if (find && find.options) {
        find.options.visualAnalysis = null;
      }

      // 移除可视域分析结果
      this.webGlobe.viewer.scene.VisualAnalysisManager._visualAnalysisList = [];

      this.isAddEventListener = false;

      //恢复深度检测的原始设置
      this._restoreDepthTestAgainstTerrain();
      this.hasViewPosition = false;
      this.isAnalyze = false;
    },

    // 为鼠标的各种行为注册监听事件
    addEventListener() {
      if (!this.isAddEventListener) {
        this.webGlobe.registerMouseEvent("MOUSE_MOVE", event => {
          this.registerMouseMoveEvent(event);
        });
        this.webGlobe.registerMouseEvent("LEFT_CLICK", event => {
          this.registerMouseLClickEvent(event);
        });
        this.webGlobe.registerMouseEvent("RIGHT_CLICK", event => {
          this.registerMouseRClickEvent(event);
        });
        this.isAddEventListener = true;
      }
    },
    // 注册可视域分析鼠标移动事件
    registerMouseMoveEvent(event) {
      if (this.hasViewPosition) {
        const cartesian = this.webGlobe.viewer.getCartesian3Position(
          event.endPosition
        );
        if (cartesian) {
          // 设置可视域结束点坐标
          let find = this.findSource();
          find.options.visualAnalysis.targetPosition = cartesian;
        }
      }
    },

    // 注册可视域分析鼠标左键点击事件
    registerMouseLClickEvent(event) {
      let cartesian = this.webGlobe.viewer.getCartesian3Position(
        event.position
      );
      let find = this.findSource();

      if (this.isAnalyze) {
        if (!this.hasViewPosition && cartesian !== undefined) {
          // 若还未选择观察点
          const cartographic = this.updateExheight(cartesian);
          cartesian = this.Cesium.Cartographic.toCartesian(cartographic);

          // 设置可视域观察点坐标
          find.options.visualAnalysis.viewPosition = cartesian;
          this.convertPosition(cartesian, "view");

          // 添加观察点到地图
          this.addViewPoint(cartesian);
          this.hasViewPosition = true;

          // 如果拥有初始目标点，则相当于在选择观察点后，又自动点击了鼠标左键一次来选择目标点
          if (this.isHasTargetPos) {
            const targetCartesian = this.Cesium.Cartesian3.fromDegrees(
              this.posData.targetPositionX,
              this.posData.targetPositionY,
              this.posData.targetPositionZ
            );
            find.options.visualAnalysis.targetPosition = targetCartesian;

            this.setVisualAttrs();
            this.convertPosition(targetCartesian, "target");

            this.hasViewPosition = false;
            this.isAnalyze = false;
          }
        } else {
          // 已经选择了观察点，则这次是选择结束点

          // 设置可视域结束点坐标
          find.options.visualAnalysis.targetPosition = cartesian;

          this.setVisualAttrs();
          this.convertPosition(cartesian, "target");

          this.hasViewPosition = false;
          this.isAnalyze = false;
        }
      }
    },

    // 注册可视域分析鼠标右键点击事件
    registerMouseRClickEvent(event) {
      const cartesian = this.webGlobe.viewer.getCartesian3Position(
        event.position
      );
      let find = this.findSource();

      if (this.hasViewPosition) {
        // 设置可视域结束点坐标
        find.options.visualAnalysis.targetPosition = cartesian;

        this.setVisualAttrs();
        this.convertPosition(cartesian, "target");
      }

      this.hasViewPosition = false;
      this.isAnalyze = false;
    },
    findSource() {
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.ViewshedAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      return find;
    }
  }
};
</script>

<style scoped>
.mapgis-widget-visual-analysis {
  /*max-width: calc(42vw);*/
  max-height: calc(60vh);
  overflow-y: auto;
}

::v-deep .mapgis-ui-form-item {
  margin-bottom: 0;
}

::v-deep .mapgis-ui-form label {
  font-size: 12px;
}

::v-deep .mapgis-ui-form-item-label {
  line-height: 40px;
}

::v-deep .mapgis-ui-input {
  padding: 4px 11px;
}

::v-deep .mapgis-ui-card.mapgis-ui-card-bordered {
  max-height: 100%;
  overflow-y: auto;
}
</style>
