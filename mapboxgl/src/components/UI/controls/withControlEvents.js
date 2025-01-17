const DrawSources = {
  HOT: "mapbox-gl-draw-hot",
  COLD: "mapbox-gl-draw-cold"
};
export default {
  created() {
    this.$_initMapboxDom();
    this.drawEvents = this.$_initMapboxEvent().draw;
    this.measureEvents = this.$_initMapboxEvent().measure;
    this.editEvents = this.$_initMapboxEvent().edit;
  },

  methods: {
    $_initMapboxDom() {
      window.mapboxDom = window.mapboxDom || {};
      window.mapboxDom.draw = window.mapboxDom.draw || {};
      window.mapboxDom.measure = window.mapboxDom.measure || {};
      window.mapboxDom.edit = window.mapboxDom.edit || {};
      window.mapboxDom.measureCom = window.mapboxDom.measureCom || {};
      return window.mapboxDom;
    },

    $_initMapboxEvent() {
      window.mapboxEvent = window.mapboxEvent || {};
      window.mapboxEvent.draw = window.mapboxEvent.draw || [];
      window.mapboxEvent.measure = window.mapboxEvent.measure || [];
      window.mapboxEvent.edit = window.mapboxEvent.edit || [];
      return window.mapboxEvent;
    },

    $_removeSource(source) {
      if (!this.map) return;
      if (this.map.getSource(source)) {
        const { layers } = this.map.getStyle();

        if (layers) {
          layers
            .filter(layer => layer.source === source)
            .forEach(layer => this.map.removeLayer(layer.id));
        }
        this.map.removeSource(source);
      }
    },

    $_addDrawControl(control) {
      if (!control) return;
      this.$_removeDrawControl();
      this.$_removeMeasureControl();
      this.$_removeEditControl();
      window.mapboxDom.draw = control;
      this.map && this.map.addControl(control);
    },

    $_removeDrawControl() {
      this.$_removeSource(DrawSources.HOT);
      this.$_removeSource(DrawSources.COLD);
      if (
        window.mapboxDom.draw &&
        window.mapboxDom.draw.onAdd &&
        window.mapboxDom.draw.onRemove
      ) {
        if (!this.map) return;
        this.map.removeControl(window.mapboxDom.draw);
        window.mapboxDom.draw = undefined;
      }
    },

    $_bindDrawEvents(eventName, eventCallback) {
      if (!this.map) return;
      this.drawEvents.push({
        name: eventName,
        callback: eventCallback
      });
      this.map.on(eventName, eventCallback);
    },

    $_unbindDrawEvents() {
      if (!this.map) return;
      if (this.drawEvents.length <= 0) return;
      this.drawEvents.forEach(e => {
        this.map && this.map.off(e.name, e.callback);
      });
      this.drawEvents.length = 0;
    },

    $_addMeasureControl(control, com) {
      if (!control) return;
      this.$_removeDrawControl();
      this.$_removeMeasureControl();
      this.$_removeEditControl();
      window.mapboxDom.measure = control;
      window.mapboxDom.measureCom = com;
      this.map && this.map.addControl(control);
    },

    $_removeMeasureControl() {
      this.$_removeSource(DrawSources.HOT);
      this.$_removeSource(DrawSources.COLD);

      if (
        window.mapboxDom.measure &&
        window.mapboxDom.measure.onAdd &&
        window.mapboxDom.measure.onRemove
      ) {
        if (!this.map) return;

        this.map.removeControl(window.mapboxDom.measure);
        window.mapboxDom.measure = undefined;
        window.mapboxDom.measureCom = undefined;
      }
    },

    $_bindMeasureEvents(eventName, eventCallback) {
      if (!this.map) return;
      this.measureEvents.push({
        name: eventName,
        callback: eventCallback
      });
      this.map.on(eventName, eventCallback);
    },

    $_unbindMeasureEvents() {
      if (!this.map) return;
      if (this.measureEvents.length <= 0) return;
      this.measureEvents.forEach(e => {
        this.map && this.map.off(e.name, e.callback);
      });
      this.measureEvents.length = 0;
    },

    $_addEditControl(control) {
      if (!control) return;
      this.$_removeDrawControl();
      this.$_removeMeasureControl();
      this.$_removeEditControl();
      window.mapboxDom.edit = control;
      this.map && this.map.addControl(control);
    },

    $_removeEditControl() {
      this.$_removeSource(DrawSources.HOT);
      this.$_removeSource(DrawSources.COLD);
      if (
        window.mapboxDom.edit &&
        window.mapboxDom.edit.onAdd &&
        window.mapboxDom.edit.onRemove
      ) {
        if (!this.map) return;
        this.map.removeControl(window.mapboxDom.edit);
        window.mapboxDom.edit = undefined;
      }
    },

    $_bindEditEvents(eventName, eventCallback) {
      if (!this.map) return;
      this.editEvents.push({
        name: eventName,
        callback: eventCallback
      });
      this.map.on(eventName, eventCallback);
    },

    $_unbindEditEvents() {
      if (!this.map) return;
      if (this.editEvents.length <= 0) return;
      this.editEvents.forEach(e => {
        this.map && this.map.off(e.name, e.callback);
      });
      this.editEvents.length = 0;
      if (window.mapboxDom.measureCom) {
        window.mapboxDom.measureCom.coordinates = [];
      }
    }
  }
};
