import MapgisUiPopover from "../../../ui/src/components/popover/Popover.vue";

export default {
  title: "界面/数据显示/气泡卡片",
  component: MapgisUiPopover,
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
  components: { MapgisUiPopover },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-popover title="Title">
    <template slot="content">
      <p>Content</p>
      <p>Content</p>
    </template>
    <mapgis-ui-button type="primary">
      Hover me
    </mapgis-ui-button>
  </mapgis-ui-popover>
  `,
});

export const Popover = Template.bind({});
Popover.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiPopover },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    hide() {
      console.log(111);
      this.visible = false;
    },
  },
  template: `
  <mapgis-ui-popover v-model="visible" title="Title" trigger="click">
    <a slot="content" @click="hide">Close</a>
    <mapgis-ui-button type="primary">
      Click me
    </mapgis-ui-button>
  </mapgis-ui-popover>
  `,
});

export const PopoverClose = Template2.bind({});
PopoverClose.args = {};