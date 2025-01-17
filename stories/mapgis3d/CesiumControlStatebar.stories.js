// import MapgisWebGlobe from "../../cesium/src/components/WebGlobe/WebGlobe.vue";
import MapgisStatebar from "../../cesium/src/components/UI/Controls/State/StateControl.vue";

export default {
  title: "三维/场景子组件/地图状态",
  component: MapgisStatebar,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisStatebar },
  template: `<mapgis-web-scene :style="{height: '95vh'}">
  <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-statebar />
  </mapgis-web-scene>`
});

export const BaseState = Template.bind({});
BaseState.args = {
};
