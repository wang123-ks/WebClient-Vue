# RectangleParameter

## constructor

### `geometry`

- **类型:** Geometry
- **Non-Synced**
- **描述:** 要素的几何信息，一个要素可包含多个几何信息，例如一个区要素可以包含多个区域坐标点集合.
- **参考:** `Geometry` in [Geometry](/zh/api/Util/geomtry/Geometry.md)

### `where`

- **类型:** String
- **Non-Synced**
- **描述:** sql语句中的where部分


### `compareRectOnly`

- **类型:** Boolean
- **默认值** false
- **Non-Synced**
- **描述:** 是否仅比较要素的外包矩形，来判定是否与几何约束图形有交集，可选值true|false

### `enableDisplayCondition`

- **类型:** Boolean
- **默认值** false
- **Non-Synced**
- **描述:** 是否将要素的可见性计算在内，来判定是否与几何约束图形有交集,可选值true|false

### `spatialRelationType`

- **类型:** String
- **默认值** Intersect
- **Non-Synced**
- **描述:** 几何与要素的空间关系，相交或相离，可选值Intersect|MustInside