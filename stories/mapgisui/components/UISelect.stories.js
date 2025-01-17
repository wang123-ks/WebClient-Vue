import MapgisUiSelect from "../../../ui/src/components/select/Select.vue";

export default {
  title: "界面/数据输入/选择器",
  component: MapgisUiSelect,
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
  components: { MapgisUiSelect },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <div>
  <mapgis-ui-select default-value="上海" :autoWidth="autoWidth">
      <mapgis-ui-select-option value="武汉">
        武汉
      </mapgis-ui-select-option>
      <mapgis-ui-select-option value="上海">
        上海
      </mapgis-ui-select-option>
      <mapgis-ui-select-option value="不可选" disabled>
        不可选
      </mapgis-ui-select-option>
      <mapgis-ui-select-option value="北京">
        北京
      </mapgis-ui-select-option>
    </mapgis-ui-select>
    <mapgis-ui-select default-value="武汉" disabled>
      <mapgis-ui-select-option value="武汉">
        武汉
      </mapgis-ui-select-option>
    </mapgis-ui-select>
    <mapgis-ui-select default-value="武汉" loading>
      <mapgis-ui-select-option value="武汉">
        武汉
      </mapgis-ui-select-option>
    </mapgis-ui-select>
  </div>
  `,
});

export const Select = Template.bind({});
Select.args = {
  autoWidth: true
};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiSelect },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-select mode="tags" style="width: 100%" :token-separators="[',']">
    <mapgis-ui-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
      {{ (i + 9).toString(36) + i }}
    </mapgis-ui-select-option>
  </mapgis-ui-select>
  `,
});

export const TagsSelect = Template2.bind({});
TagsSelect.args = {};

const Template3 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiSelect },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <mapgis-ui-select default-value="武汉" :autoWidth="autoWidth">
    <mapgis-ui-select-opt-group>
      <span slot="label">湖北省</span>
      <mapgis-ui-select-option value="黄冈">
        黄冈
      </mapgis-ui-select-option>
      <mapgis-ui-select-option value="武汉">
        武汉
      </mapgis-ui-select-option>
    </mapgis-ui-select-opt-group>
    <mapgis-ui-select-opt-group label="浙江省">
      <mapgis-ui-select-option value="杭州">
        杭州
      </mapgis-ui-select-option>
    </mapgis-ui-select-opt-group>
  </mapgis-ui-select>
  `,
});

export const GroupSelect = Template3.bind({});
GroupSelect.args = {
  autoWidth: true  
};