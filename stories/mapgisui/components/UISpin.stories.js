import MapgisUiSpin from "../../../ui/src/components/spin/Spin.vue";

export default {
  title: "界面/反馈/加载中",
  component: MapgisUiSpin,
  argTypes: {
    prefixCls: { table: { disable: true } },
    getPopupContainer: { table: { disable: true } },
    csp: { table: { disable: true } },
    locale: { table: { disable: true } },
    background: { table: { disable: true } },
    textColor: { table: { disable: true } },
    colorGroup: { table: { disable: true } },
    themeStyleChanged: { table: { disable: true } },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiSpin },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-spin />
  `,
});

export const Spin = Template.bind({});
Spin.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiSpin },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-spin tip="Loading...">
    <div style="border: 1px solid #91d5ff; background: rgba(0, 0, 0, 0.25); padding:30px">
        我的描述文案是自定义的。。。
    </div>
  </mapgis-ui-spin>
  `,
});

export const CustomizedDescriptionSpin = Template2.bind({});
CustomizedDescriptionSpin.args = {};