<template></template>

<script>
export default {
    name: "mapgis-3d-compare",
    inject: ["Cesium", "webGlobe", "CesiumZondy"],
    props: {
        beforeLayers: {
            type: Array,
            default: function () {
                return [];
            },
        },
        afterLayers: {
            type: Array,
            default: function () {
                return [];
            },
        },
        vueKey: {
            type: String,
            default: "default",
        },
    },
    data() {
        return {
            container: null,
        };
    },
    watch: {
        beforeLayers: {
            handler(val) {
                this.initCompare();
            },
            deep: true,
        },
        afterLayers: {
            handler(val) {
                this.initCompare();
            },
            deep: true,
        },
        vueKey() {
            this.polling();
        },
    },
    mounted() {
        this.polling();
    },
    methods: {
        polling() {            
            const { vueKey, CesiumZondy, webGlobe } = this;
            if (vueKey === 'default') {
                console.log('cdn', this.vueKey);
                this.initCompare(webGlobe);
            } else {
                const timer = setInterval(() => {
                    if (
                        CesiumZondy.GlobesManager.hasOwnProperty(this.vueKey)
                    ) {
                        clearInterval(timer);
                        this.initCompare();
                    }
                }, 50);
            }
        },
        initCompare(webGlobe) {
            const { CesiumZondy, vueKey } = this;
            webGlobe = webGlobe || CesiumZondy.GlobesManager[vueKey][0].source;
            let slider = document.createElement("div");
            slider.className = "slider";
            this.container = webGlobe.elementID.parentNode;
            this.container.appendChild(slider);
            let layers = webGlobe.layers._layers;

            if (this.beforeLayers.length && this.afterLayers.length) {
                for (let i = 1; i < layers.length; i++) {
                    layers[i].show = true;
                    if (this.beforeLayers.includes(layers[i].id)) {
                        layers[i].splitDirection =
                            Cesium.ImagerySplitDirection.LEFT;
                    } else if (this.afterLayers.includes(layers[i].id)) {
                        layers[i].splitDirection =
                            Cesium.ImagerySplitDirection.RIGHT;
                    } else {
                        layers[i].show = false;
                    }
                }
            } else {
                layers[layers.length - 2].splitDirection =
                    Cesium.ImagerySplitDirection.LEFT;
                layers[layers.length - 1].splitDirection =
                    Cesium.ImagerySplitDirection.RIGHT;
            }

            // let slider = this.slider;
            webGlobe.scene.imagerySplitPosition =
                slider.offsetLeft / slider.parentElement.offsetWidth;

            let handler = new Cesium.ScreenSpaceEventHandler(slider);
            let moveActive = false;

            function move(movement) {
                if (!moveActive) {
                    return;
                }
                let relativeOffset = movement.endPosition.x;
                let splitPosition =
                    (slider.offsetLeft + relativeOffset) /
                    slider.parentElement.offsetWidth;
                slider.style.left = 100.0 * splitPosition + "%";
                webGlobe.scene.imagerySplitPosition = splitPosition;
            }

            //鼠标左键按下事件
            handler.setInputAction(function () {
                moveActive = true;
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
            //鼠标左键抬起事件
            handler.setInputAction(function () {
                moveActive = false;
            }, Cesium.ScreenSpaceEventType.LEFT_UP);
            //滑动事件的开始
            handler.setInputAction(function () {
                moveActive = true;
            }, Cesium.ScreenSpaceEventType.PINCH_START);
            //滑动事件的结束
            handler.setInputAction(function () {
                moveActive = false;
            }, Cesium.ScreenSpaceEventType.PINCH_END);
            //鼠标移动事件
            handler.setInputAction(
                move,
                Cesium.ScreenSpaceEventType.MOUSE_MOVE
            );
            //滑动事件
            handler.setInputAction(
                move,
                Cesium.ScreenSpaceEventType.PINCH_MOVE
            );
        },
    },
    destroyed() {
        const { webGlobe, CesiumZondy, vueKey } = this;
        let globe = webGlobe || CesiumZondy.GlobesManager[vueKey][0].source;
        let layers = globe.layers._layers;
        layers.forEach((layer) => {
            layer.show = true;
            layer.splitDirection = Cesium.ImagerySplitDirection.NONE;
        });
        let slider = document.getElementsByClassName("slider");
        this.container.removeChild(slider[0]);
    },
};
</script>

<style>
.cesium-map-wrapper .slider {
    position: absolute;
    left: 50%;
    top: 0;
    background-color: #d3d3d3;
    width: 5px;
    height: 100%;
    z-index: 9999;
}

.cesium-map-wrapper .slider:hover {
    cursor: ew-resize;
}
</style>
