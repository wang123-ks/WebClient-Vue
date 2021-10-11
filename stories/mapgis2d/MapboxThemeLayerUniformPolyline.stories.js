import wuhan_subway from "../assets/geojson/wuhan_subway"
export default {
  title: "二维/图层/专题图/统一专题图/线",
  argTypes: {
    type: {
      description: "专题图类型，uniform(统一)，unique(单值)，range(分段)，heatmap(热力)，symbol(符号)",
      table:{
        defaultValue: { summary: 'range' },
      },
    },
    field: {
      description: "专题图字段，即以某个字段的值来创建专题图",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    dataSource: {
      description: "geojson格式的数据源，详见如下网址：<a href='https://geojson.org/' target='_blank'>https://geojson.org/  </a>",
      table:{
        defaultValue: { summary: 'null' },
      },
    },
    layerStyle: {
      description: "专题图样式，有如下参数：<br>" +
          "1、<span class='storybook-span'>color</span>：填充颜色，十六进制颜色或rgb颜色<br>" +
          "2、<span class='storybook-span'>opacity</span>：透明度，默认为1，0~1之间的小数，0表示完全透明，1表示不透明<br>" +
          "3、<span class='storybook-span'>width</span>：线的宽度，默认为1",
      table:{
        defaultValue: { summary: 'null' },
      }
    }
  },
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  methods:{},
  template:`<mapgis-web-map crs="EPSG:4326" :center="[114.299039,30.594797]" :zoom="8" style="height:60vh">
    <mapgis-theme-layer-custom v-bind="$props"/>
    </mapgis-web-map>`,
});

export const  自定义样式 = Template.bind({});
自定义样式.args = {
  type: "uniform",
  field: "mpLength",
  dataSource: wuhan_subway,
  layerStyle: {
    color: "#0000FF",
    opacity: 1,
    width: 4
  }
}

export const  默认样式 = Template.bind({});
默认样式.args = {
  type: "uniform",
  field: "mpLength",
  dataSource: wuhan_subway,
}