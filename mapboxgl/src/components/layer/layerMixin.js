// import withRegistration from "../../lib/withRegistration";
import withEvents from "../../lib/withEvents";

const mapgisCustomProps = {
  url: {
    type: String,
    default: null
  },
  mapgisOffset: {
    type: Number,
    default: 0
  }
};

const mapboxSourceProps = {
  sourceId: {
    type: String,
    default: undefined
  },
  source: {
    type: [Object, String],
    default: undefined
  }
};

const mapboxLayerStyleProps = {
  layerId: {
    type: String,
    required: true
  },
  layer: {
    type: Object,
    default: () => {
      return {};
    }
  },
  before: {
    type: String,
    default: undefined
  }
};

const componentProps = {
  clearSource: {
    type: Boolean,
    default: true
  },
  replaceSource: {
    type: Boolean,
    default: false
  },
  replace: {
    type: Boolean,
    default: false
  },
  token: {
    type: Object
  }
};

export default {
  mixins: [withEvents],
  props: {
    ...mapboxSourceProps,
    ...mapboxLayerStyleProps,
    ...componentProps,
    ...mapgisCustomProps
  },

  inject: ["mapbox", "map"],

  watch: {
    before(val) {
      // 特别声明，这个before的监听行为必须在replaceSource=false
      // &&replace=false 的前提下才能成立，这是先决条件
      this.move(val);
    }
  },

  data() {
    return {
      initial: true
    };
  },

  computed: {
    sourceLoaded() {
      return this.map
        ? this.map.isSourceLoaded(this.sourceId || this.layerId)
        : false;
    },
    mapLayer() {
      return this.map ? this.map.getLayer(this.layerId) : null;
    },
    mapSource() {
      return this.map
        ? this.map.getSource(this.sourceId || this.layerId)
        : null;
    }
  },

  created() {
    if (this.layer.minzoom) {
      this.$watch("layer.minzoom", function(next) {
        if (this.initial) return;
        this.map.setLayerZoomRange(this.layerId, next, this.layer.maxzoom);
      });
    }

    if (this.layer.maxzoom) {
      this.$watch("layer.maxzoom", function(next) {
        if (this.initial) return;
        this.map.setLayerZoomRange(this.layerId, this.layer.minzoom, next);
      });
    }

    if (this.layer.paint) {
      this.$watch(
        "layer.paint",
        function(next) {
          if (this.initial) return;
          if (next) {
            for (let prop of Object.keys(next)) {
              this.map.setPaintProperty(this.layerId, prop, next[prop]);
            }
          }
        },
        { deep: true }
      );
    }

    if (this.layer.layout) {
      this.$watch(
        "layer.layout",
        function(next) {
          if (this.initial) return;
          if (next) {
            for (let prop of Object.keys(next)) {
              this.map.setLayoutProperty(this.layerId, prop, next[prop]);
            }
          }
        },
        { deep: true }
      );
    }

    if (this.layer.filter) {
      this.$watch(
        "layer.filter",
        function(next) {
          if (this.initial) return;
          this.map.setFilter(this.layerId, next);
        },
        { deep: true }
      );
    }
  },

  beforeDestroy() {
    if (this.map) {
      try {
        this.map.removeLayer(this.layerId);
      } catch (err) {
        this.$_emitEvent("layer-does-not-exist", {
          layerId: this.sourceId || this.layerId,
          error: err
        });
      }
      if (this.clearSource) {
        try {
          this.map.removeSource(this.sourceId || this.layerId);
        } catch (err) {
          this.$_emitEvent("source-does-not-exist", {
            sourceId: this.sourceId || this.layerId,
            error: err
          });
        }
      }
    }
  },

  methods: {
    $_emitLayerMapEvent(event) {
      return this.$_emitMapEvent(event, { layerId: this.layerId });
    },

    $_bindLayerEvents(events) {
      Object.keys(this.$listeners).forEach(eventName => {
        if (events.includes(eventName)) {
          this.map.on(eventName, this.layerId, this.$_emitLayerMapEvent);
        }
      });
    },

    $_unbindEvents(events) {
      if (this.map) {
        events.forEach(eventName => {
          this.map.off(eventName, this.layerId, this.$_emitLayerMapEvent);
        });
      }
    },

    $_watchSourceLoading(data) {
      const sourceId = this.sourceId || this.layerId;
      if (data.dataType === "source" && data.sourceId === sourceId) {
        this.$_emitEvent("layer-source-loading", { sourceId: sourceId });
        this.map.off("dataloading", this.$_watchSourceLoading);
      }
    },

    move(beforeId) {
      this.map.moveLayer(this.layerId, beforeId);
      this.$_emitEvent("layer-moved", {
        layerId: this.layerId,
        beforeId: beforeId
      });
    },

    remove() {
      this.map.removeLayer(this.layerId);
      this.map.removeSource(this.sourceId || this.layerId);
      this.$_emitEvent("layer-removed", { layerId: this.layerId });
      this.$destroy();
    }
  },

  render() {}
};
