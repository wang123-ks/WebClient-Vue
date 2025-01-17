import {BaseParameter} from "./index";
import {extend} from "@mapgis/webclient-es6-service/common";

class RectangleParameter extends BaseParameter{
    constructor(options) {
        super();
        this.where = undefined;
        this.rectangle = [];
        this.compareRectOnly = false;
        this.enableDisplayCondition = false;
        this.spatialRelationType = "Intersects";

        extend(this,options);
    }
}

export {RectangleParameter}