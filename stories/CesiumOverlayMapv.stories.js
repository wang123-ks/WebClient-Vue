import MapgisWebScene from "../cesium/src/components/WebGlobe/WebGlobe.vue";
import Mapgis3dArcgisTileLayer from "../cesium/src/components/Layer/ArcGISServer/ArcGISTileLayer";
import {BaseServer} from "@mapgis/webclient-es6-service";

export default {
    title: "三维/覆盖物-MapV",
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    components: {MapgisWebScene, BaseServer,Mapgis3dArcgisTileLayer},
    mounted() {
        this.initData();
    },
    methods: {
        initData() {
            this.geojson = {};
            let randomCount = 500;
            let data = [];
            while (randomCount--) {
                data.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [75 + Math.random() * 50, 20.3 + Math.random() * 20]
                    },
                    properties:{
                        count: 30 * Math.random()
                    },
                });
            }
            ;
            this.geojson = {
                "features": data
            }
        }
    },
    template: `
      <mapgis-web-scene>
      <mapgis-3d-arcgis-tile-layer :baseUrl="baseUrl" :layer-style="layerStyle" :srs="srs"/>
      <mapgis-3d-mapv-layer :options="options" :geojson="geojson"></mapgis-3d-mapv-layer>
      </mapgis-web-scene>
    `
});

export const mapv = Template.bind({});
mapv.args = {
    baseUrl:"http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
    layerStyle: {
        visible: true,
        opacity: 1,
        zIndex: 2
    },
    srs:"EPSG:4326",
    options: {
        context: '2d',
        fillStyle: 'rgba(55, 50, 250, 0.8)',
        size: 40,
        globalAlpha: 0.5,
        label: {
            show: true,
            fillStyle: 'white',
            shadowColor: 'yellow',
            font: '15px Arial',
            shadowBlur: 10
        },
        gradient: {
            0: "rgba(49, 54, 149, 0)",
            0.2: "rgba(69,117,180, 0.7)",
            0.3: "rgba(116,173,209, 0.7)",
            0.4: "rgba(171,217,233, 0.7)",
            0.5: "rgba(224,243,248, 0.7)",
            0.6: "rgba(254,224,144,0.7)",
            0.7: "rgba(253,174,97,0.7)",
            0.8: "rgba(244,109,67,0.8)",
            0.9: "rgba(215,48,39,0.8)",
            0.95: "rgba(165, 0, 38,0.8)"
        },
        shadowColor: 'rgba(255, 255, 50, 1)',
        shadowBlur: 10,
        max: 100,
        draw: 'grid'
    },
    geojson: {}
};
