// import withRegistration from "../../../lib/withRegistration";
import withEvents from "../../../../lib/withEvents";
import withSelfEvents from "../../withSelfEvents";

export default {
  mixins: [withEvents, withSelfEvents],

  inject: ["mapbox", "map", "actions"],

  props: {
    position: {
      type: String,
      default: "top-right"
    }
  },

  beforeDestroy() {
    if (this.map && this.measure) {
      // 这里后面除非找到了能够在组件内部解决事件冲突的方式，
      // 否则都通过$_removeMeasureControl()来释放测量组件
      // this.map.removeControl(this.measure);
    }
  },

  methods: {
    $_addControl() {
      if (this.map && this.measure) {
        try {
          this.map.addControl(this.measure, this.position);
        } catch (err) {
          this.$_emitEvent("error", { error: err });
          return;
        }
        this.$_emitEvent("added", { measure: this.measure });
      }
    }
  }
};
