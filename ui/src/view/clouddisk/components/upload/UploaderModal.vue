<template>
  <mapgis-ui-modal
    :visible="show"
    :maskClosable="false"
    :title="title"
    :width="width"
    :dialog-style="{ top: '100px' }"
    @cancel="handleCloseImport"
    :footer="footerHandle"
  >
    <template slot="footer">
      <div v-if="uistatus === 'check'">
        <!-- <mapgis-ui-button key="back" :disabled="true" @click="handleCSVBack" >
          上一步
        </mapgis-ui-button> -->
        <mapgis-ui-button key="close" type="primary" :disabled="!continueImportCsv" @click="handleCSVGo">
          下一步
        </mapgis-ui-button>
      </div>
      <div v-if="uistatus === 'upload'">
        <mapgis-ui-button key="back" :disabled="!continueUpload" @click="handleBack" >
          继续上传
        </mapgis-ui-button>
        <mapgis-ui-button key="close" type="primary" @click="handleCloseImport">
          关闭
        </mapgis-ui-button>
      </div>
    </template>
    <mapgis-ui-uploader-data
      v-if="uistatus === 'init' && show"
      :curImportUrl="curImportUrl"
      :importDestUrl="importDestUrl"
      @changePathText="changePathText"
    />
    <mapgis-ui-uploader-csv-check ref="CsvCheck" v-if="uistatus === 'check' && show" :curImportUrl="curImportUrl"/>
    <mapgis-ui-uploader-progress
      v-if="uistatus === 'upload' && show"
      @handleUploadComplete="handleUploadComplete"
      @closeImport="handleCloseImport"
    />
    <mapgis-ui-clouddisk-transform
      ref="layerTransform"
      :selectLists="selectLists"
      :currentDocument="currentDocument"
      :handleNewDocument="handleNewDocument"
      @closeImport="handleCloseImport"/>
  </mapgis-ui-modal>
</template>

<script>
import MapgisUiUploaderData from "./UploaderData.vue";
import MapgisUiUploaderCsvCheck from "./UploaderCsvCheck.vue";
import MapgisUiUploaderProgress from "./UploaderProgress.vue";
import MapgisUiClouddiskTransform from "../select/LayerTransform";
import UploadMixin from "../../../../mixin/UploaderMixin";
import { changeUiState, changeCsvUploadComplete, changePathUploaduri } from "../../../../util/emit/upload";
import { getMapgisGroupPath } from "../../config/mapgis";
import { getFileByWebsocketCallback, importVector } from "../../axios/files";

export default {
  name: "mapgis-ui-upload-modal",
  mixins: [UploadMixin],
  components: {
    MapgisUiUploaderData,
    MapgisUiUploaderCsvCheck,
    MapgisUiUploaderProgress,
    MapgisUiClouddiskTransform
  },
  model: {
    prop: "show",
    event: "change"
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 600
    },
    title: {
      type: String,
      default: '导入文件'
    },
    defaultPath: {
      type: String,
      default: 'data'
    },
    isMapstudio: {
      type: Boolean,
      default: false
    },
    currentDocument: {
      type: Object,
      default: () => {
        return {};
      }
    },
    handleNewDocument: Function,
    handleUploaded: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      curImportUrl: "",
      importDestUrl: "",
      continueUpload: false,
      selectLists: [],
      continueImportCsv: false, // csv文件的下一步按钮
    };
  },
  watch: {
    WebsocketContent: {
      handler() {
        if (this.WebsocketMessageId === this.webSocketTaskId && this.WebsocketAction === 'refresh') {
          this.handleWebsocket(this.WebsocketMessageId);
        }
      },
      deep: true
    },
    csvUploadComplete(next) {
      this.continueImportCsv = next
    },
    defaultPath: {
      handler (next) {
        if (next !== '') {
          let url = getMapgisGroupPath() + '/' + next
          changePathUploaduri({ uri: url })
          this.changePathText(url)
        }
      },
      immediate: true
    },
  },
  computed: {
    footerHandle() {
      if (this.uistatus === 'init') {
        return null
      }
    }
  },
  methods: {
    handleImport() {
      /* this.curImportUrl = this.$store.state.path.current.uri || "";
      this.importDestUrl = this.importFileInfo(this.curImportUrl);
      this.show = true; */
      this.$emit("ok", true);
    },
    handleCloseImport() {
      this.handleBack();
      // changeUiState({ state: "init" });
      // this.continueUpload = false;
      this.$emit("cancel", false);
      this.$emit("change", false);
    },
    handleBack() {
      changeUiState({ state: "init" });
      changeCsvUploadComplete({ csvUploadComplete: false });
      this.continueUpload = false;
    },
    handleCSVGo () {
      let CsvParams = this.$refs.CsvCheck.getCsvParams()
      importVector(CsvParams)
        .then(res => {
          if (res.status === 200) {
            let result = res.data
            let { errorCode, msg } = result
            if (errorCode < 0) {
              this.$notification.error({ message: errorCode, description: msg })
            } else {
              changeUiState({ state: "upload" });
            }
          }
        })
        .catch(error => {
          this.$notification.error({ message: '网络异常,请检查链接', description: error })
        })
    },
    changePathText(url) {
      this.curImportUrl = url === "" ? this.uploaduri || "" : url;
      // console.warn("this.uploaduri222", this.uploaduri);
      this.importDestUrl = this.importFileInfo(this.curImportUrl);
    },
    handleUploadComplete(flag) {
      this.continueUpload = flag;
    },
    importFileInfo(url) {
      let gisindex = url.indexOf("/");
      if (gisindex >= 0) {
        url = "组织文件夹" + url.slice(gisindex);
      } else {
        url = "组织文件夹";
      }
      return url;
    },
    handleWebsocket(msgid) { // 在线制图时触发
      // console.warn('监控到消息', this.WebsocketContent)
      let srcUrl = "";
      let content = this.WebsocketContent
      if (this.isMapstudio === false) {
        this.handleUploaded()
      } else {
        // console.warn('进到调图层来', this.WebsocketAction)
        // let promises = content.map(i => getFileByWebsocketCallback(i.subject));
        content.forEach((c, i) => {
          let url;
          if (c.subject && c.subject.indexOf("file:") >= 0) {
            let files = c.subject.split("file:");
            url = files[1];
          } else {
            url = c.subject;
          }
          srcUrl += i !== content.length - 1 ? `${url},` : `${url}`;
        });
        getFileByWebsocketCallback(srcUrl).then(res => {
          this.selectLists = res.data.data;
          setTimeout(() => {
            this.$refs.layerTransform.addLayer();
          },100);
        });
      }
    }
  }
};
</script>
