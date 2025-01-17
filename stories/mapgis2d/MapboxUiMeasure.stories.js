import MapgisMeasure from "../../mapboxgl/src/components/UI/controls/measure/Measure.vue";

export default {
  title: "二维/地图子组件/量测",
  component: MapgisMeasure,
  argTypes: {
    enableControl: true,
    isAdvanceControl: false,
    position: "top-left",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisMeasure },
  data() {
    return {
      mapOptions: {
        crs: "EPSG:4326", //经纬度一定要设置crs参数
        maxBounds: [
          [-180, -90],
          [180, 90],
        ],
        zoom: 5,
        center: [107.19, 26.85],
      },
    };
  },
  template: `
  <mapgis-web-map v-bind="{ ...mapOptions }" style="height:95vh">
    <mapgis-rastertile-layer
      layerId="tdt"
      url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752"
    />
      <mapgis-measure v-bind="$props">
      </mapgis-measure>
</mapgis-web-map>`,
});

export const 量测 = Template.bind({});
量测.args = {
  enableControl: true,
  isAdvanceControl: false,
  position: "top-left",
};
