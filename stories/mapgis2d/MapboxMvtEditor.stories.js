import MapgisMvtEditor from "../../mapboxgl/src/components/layer/edit/Edit";

export default {
  title: "二维/图层/MVT/编辑样式",
  component: MapgisMvtEditor,
  argTypes: {
    outStyle: {
      position: "absolute",
      zIndex: 900,
      top: "10px",
      left: "10px",
      height: "300px",
      width: "280px",
    },
    visible: true,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisMvtEditor },
  data() {
    return {
      layer: "",
      enableEditor: false,
      mvtStyle:
        `http://${window.webclient.ip}:${window.webclient.port}/${window.styles}/街道-墨卡托.json`,
  };
  },
  methods: {
    handleMapLoad(e) {
      this.map = e.map;
    },
    handleChangeStyle(style) {
      const vm = this;
      window.setTimeout(() => {
        vm.enableEditor = true;
        vm.layer = "中国行政区";
        console.log("map laod", this.map.getStyle());
      }, 1000);
    },
    handleEditChange(event) {
      console.log("样式切换", event, this.map.getStyle());
    },
  },
  template: `<mapgis-web-map crs="EPSG:3857" :center="[105.22,33.03]" :zoom="2" style="height:95vh" @load="handleMapLoad">
      <mapgis-mvt-style-layer :mvtStyle="mvtStyle" @change-style="handleChangeStyle" />
      <mapgis-mvt-editor :outStyle="outStyle" :layerid="layer" :visible="enableEditor" @edit-change="handleEditChange"/>
    </mapgis-web-map>`,
});

export const 编辑 = Template.bind({});
编辑.args = {
  outStyle: {
    position: "absolute",
    zIndex: 900,
    top: "10px",
    left: "10px",
    height: "480px",
    width: "340px",
  },
  visible: true,
};
