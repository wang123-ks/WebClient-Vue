# 图标 

> mapgis-ui-iconfont

## 属性

### `type`

- **类型:** `String`
- **非侦听属性**
- **描述:** iconfont官方网站上对应的图标名称
- **示例:** "mapgis-jiamixian1"

![IconFont](../../assets/images/iconfont-simple.png)
  
``` vue
<mapgis-ui-iconfont type="mapgis-jiamixian1"/>
```

## 组合使用

``` vue
<template>
  <mapgis-ui-button-group class="mapgis-2d-draw-wrapper">
    <mapgis-ui-tooltip ] v-for="(item, i) in buttons" :key="i" placement="bottom" >
    <template slot="title">
        <span>{{ item.tip }}</span>
        </template>
        <mapgis-ui-button
        circle
        size="small"
        :type="item.type"
        @click="item.click"
        >
        <mapgis-ui-iconfont :type="item.icon" />
        </mapgis-ui-button>
    </mapgis-ui-tooltip>
  </mapgis-ui-button-group>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {},
  components: {
    CustomDocument,
  },
  data() {
    return {
        buttons: [
        {
          icon: "mapgis-erweidian",
          type: "default",
          tip: "点选几何,按住shift可以框选",
          click: this.toggleSimple,
        },
        {
          icon: "mapgis-erweidian",
          type: "primary",
          tip: "画点",
          click: this.togglePoint,
        },
        {
          icon: "mapgis-erweixian",
          type: "primary",
          tip: "画线",
          click: this.togglePolyline,
        },
        {
          icon: "mapgis-erweiqu",
          type: "primary",
          tip: "画矩形",
          click: this.toggleRect,
        },
        {
          icon: "mapgis-erweiqu",
          type: "primary",
          tip: "画多边形",
          click: this.togglePolygon,
        },
        {
          icon: "mapgis-yuan1",
          type: "primary",
          tip: "画圆",
          click: this.toggleCircle,
        },
        {
          icon: "mapgis-yuanxinbanjingyuan1",
          type: "primary",
          tip: "画半径",
          click: this.toggleRadius,
        },
        {
          icon: "mapgis-shanchudangqianziceng",
          type: "primary",
          tip: "删除选中图元",
          click: this.toggleDelete,
        },
        {
          icon: "mapgis-shanchudangqianziceng",
          type: "primary",
          tip: "删除全部",
          click: this.toggleDeleteAll,
        },
        {
          icon: "mapgis-juxing1",
          type: "default",
          tip: "矩形查询",
          click: this.toggleQueryByRect,
        },
        {
          icon: "mapgis-pinghangsibianxing1",
          type: "default",
          tip: "多边形查询",
          click: this.toggleQueryByPolygon,
        },
      ],
    }
  }
}
```

### 显示效果:
![组合显示1](../../assets/images/combine-1.png);

![组合显示2](../../assets/images/combine-2.png);