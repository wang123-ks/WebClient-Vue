import MapgisUiBadge from "../../../ui/src/components/badge/Badge.vue";

export default {
  title: "界面/数据显示/徽标数",
  component: MapgisUiBadge,
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
  components: { MapgisUiBadge },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <div>
    <mapgis-ui-badge :count="5" style="margin-right: 20px;">
      <a href="#" style="width:42px;height:42px;border-radius:4px;background:#eee;display:inline-block;"/>
    </mapgis-ui-badge>
    <mapgis-ui-badge :count="99" style="margin-right: 20px;">
      <a href="#" style="width:42px;height:42px;border-radius:4px;background:#eee;display:inline-block;"/>
    </mapgis-ui-badge>
    <mapgis-ui-badge :count="100" style="margin-right: 20px;">
      <a href="#" style="width:42px;height:42px;border-radius:4px;background:#eee;display:inline-block;"/>
    </mapgis-ui-badge>
    <mapgis-ui-badge :count="99" :overflow-count="10" style="margin-right: 20px;">
      <a href="#" style="width:42px;height:42px;border-radius:4px;background:#eee;display:inline-block;"/>
    </mapgis-ui-badge>
    <mapgis-ui-badge :count="1000" :overflow-count="999" style="margin-right: 20px;">
      <a href="#" style="width:42px;height:42px;border-radius:4px;background:#eee;display:inline-block;"/>
    </mapgis-ui-badge>
  </div>
  `,
});

export const Badge = Template.bind({});
Badge.args = {};
