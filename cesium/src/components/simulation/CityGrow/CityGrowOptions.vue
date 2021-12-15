<template>
  <div class="mapgis-city-grow-options">
    <mapgis-ui-select-panel
        label="地图文档基地址"
        v-model="baseUrl"
        :selectOptions="urlOptions"
        @change="val => onFieldChange(val, 'baseUrl') ">
    </mapgis-ui-select-panel>
    <mapgis-ui-form-item label="输入文档基地址">
      <mapgis-ui-input-search
          placeholder="基地址"
          enter-button="确认"
          @search="searchFields">
      </mapgis-ui-input-search>
    </mapgis-ui-form-item>
    <mapgis-ui-select-panel
        label="开始时间字段"
        v-model="startTimeField"
        :selectOptions="dataFields"
        :disabled="isDisabled"
        @change="val => onFieldChange(val, 'startTimeField') ">
    </mapgis-ui-select-panel>
    <mapgis-ui-select-panel
        label="结束时间字段"
        v-model="endTimeField"
        :selectOptions="dataFields"
        :disabled="isDisabled"
        @change="val => onFieldChange(val, 'endTimeField') ">
    </mapgis-ui-select-panel>
    <mapgis-ui-select-panel
        label="高程字段"
        v-model="heightField"
        :selectOptions="dataFields"
        :disabled="isDisabled"
        @change="val => onFieldChange(val, 'heightField') ">
    </mapgis-ui-select-panel>
    <mapgis-ui-range-picker @change="onDateChange"></mapgis-ui-range-picker>
    <mapgis-ui-input-number-panel
        size="small"
        label="高程比"
        v-model="heightScale"
        @change="val => onHeightScale(val,  'heightScale')"/>
    <mapgis-ui-colors-setting
        v-model="colorsCopy"
        :rangeField="'高度'"
        :showNumber="false"
        style="margin-top: 8px"
    >
    </mapgis-ui-colors-setting>
    <mapgis-ui-setting-footer>
      <mapgis-ui-button type="primary" @click="onCommitOptions"
      >确认</mapgis-ui-button
      >
      <mapgis-ui-button @click="remove">取消</mapgis-ui-button>
    </mapgis-ui-setting-footer>
  </div>
</template>

<script>
export default {
  name: "mapgis-3d-city-grow-options",
  props: {
    defaultDocData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    buildingcolors: {
      type: Array,
      default: () => {
        return ["#fff0f6", "#ff85c0", "#eb2f96"]
      }
    }
  },
  data() {
    return {
      baseUrl: "",
      urlOptions: [],
      startTimeField: "",
      endTimeField: "",
      heightField: "",
      isDisabled: true,
      dataFields: [],
      heightScale: 1,
      colorsCopy:[],
    }
  },
  mounted() {

  },
  watch: {
    defaultDocData: {
      deep: true,
      immediate: true,
      handler(next) {
        let vm = this;
        vm.urlOptions = [];
        for (let i = 0; i < next.length; i++) {
          vm.urlOptions.push(next[i].baseUrl);
        }
      }
    },
    buildingcolors: {
      handler() {
        let vm = this;
        let colors = this.buildingcolors;
        if (colors.length > 0){
          // vm.colorsCopy =
          for (let i = 0; i < colors.length; i++) {
            let obj = {};
            obj.min = 60*i;
            obj.max = 60*(i+1);
            obj.color = colors[i];
            vm.colorsCopy.push(obj);
            vm.buildingcolorsCopy = vm.colorsCopy;
          }
        }
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    onFieldChange(val, key) {
      let vm = this;
      if (key === 'baseUrl') {
        for (let i = 0; i < vm.defaultDocData.length; i++) {
          if (vm.defaultDocData[i].baseUrl === val) {
            vm.startTimeField = vm.defaultDocData[i].startTimeField
            vm.endTimeField = vm.defaultDocData[i].endTimeField
            vm.heightField = vm.defaultDocData[i].heightField
            vm.isDisabled = false
          }
        }
      }
    },
    searchFields(value) {

    },
    onDateChange(date, dateString) {
      console.log("date", date);
      console.log("dateString", dateString);
    },
    onHeightScale() {

    },
    onCommitOptions(){
      this.$emit('commitOptions',);
    }
  }
}
</script>

<style scoped>
.mapgis-city-grow-options{
  max-height: calc(50vh);
  overflow-y: auto;
}
</style>