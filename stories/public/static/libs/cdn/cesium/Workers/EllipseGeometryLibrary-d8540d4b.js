define(["exports","./Cartesian2-e9693975","./Math-72d6038c","./Transforms-f7cbddb2"],function(a,v,E,y){"use strict";var e={},u=new v.Cartesian3,m=new v.Cartesian3,c=new y.Quaternion,h=new y.Matrix3;function V(a,e,r,t,i,n,s,o,l,C){e=a+e;v.Cartesian3.multiplyByScalar(t,Math.cos(e),u),v.Cartesian3.multiplyByScalar(r,Math.sin(e),m),v.Cartesian3.add(u,m,u);e=Math.cos(a);e*=e;a=Math.sin(a);a*=a;a=n/Math.sqrt(s*e+i*a);return y.Quaternion.fromAxisAngle(u,a/o,c),y.Matrix3.fromQuaternion(c,h),y.Matrix3.multiplyByVector(h,l,C),v.Cartesian3.normalize(C,C),v.Cartesian3.multiplyByScalar(C,o,C),C}var A=new v.Cartesian3,R=new v.Cartesian3,W=new v.Cartesian3,M=new v.Cartesian3;e.raisePositionsToHeight=function(a,e,r){for(var t=e.ellipsoid,i=e.height,n=e.extrudedHeight,e=r?a.length/3*2:a.length/3,s=new Float64Array(3*e),o=a.length,l=r?o:0,C=0;C<o;C+=3){var y=C+1,u=C+2,m=v.Cartesian3.fromArray(a,C,A);t.scaleToGeodeticSurface(m,m);var c=v.Cartesian3.clone(m,R),h=t.geodeticSurfaceNormal(m,M),x=v.Cartesian3.multiplyByScalar(h,i,W);v.Cartesian3.add(m,x,m),r&&(v.Cartesian3.multiplyByScalar(h,n,x),v.Cartesian3.add(c,x,c),s[C+l]=c.x,s[y+l]=c.y,s[u+l]=c.z),s[C]=m.x,s[y]=m.y,s[u]=m.z}return s};var S=new v.Cartesian3,B=new v.Cartesian3,b=new v.Cartesian3;e.computeEllipsePositions=function(a,e,r){var t=a.semiMinorAxis,i=a.semiMajorAxis,n=a.rotation,s=a.center,a=8*a.granularity,o=t*t,l=i*i,C=i*t,y=v.Cartesian3.magnitude(s),u=v.Cartesian3.normalize(s,S),m=v.Cartesian3.cross(v.Cartesian3.UNIT_Z,s,B),m=v.Cartesian3.normalize(m,m),c=v.Cartesian3.cross(u,m,b),h=1+Math.ceil(E.CesiumMath.PI_OVER_TWO/a),x=E.CesiumMath.PI_OVER_TWO/(h-1),M=E.CesiumMath.PI_OVER_TWO-h*x;M<0&&(h-=Math.ceil(Math.abs(M)/x));var f,z,d,_,O=e?new Array(3*(h*(h+2)*2)):void 0,p=0,w=A,P=R,a=4*h*3,T=a-1,I=0,g=r?new Array(a):void 0,w=V(M=E.CesiumMath.PI_OVER_TWO,n,c,m,o,C,l,y,u,w);for(e&&(O[p++]=w.x,O[p++]=w.y,O[p++]=w.z),r&&(g[T--]=w.z,g[T--]=w.y,g[T--]=w.x),M=E.CesiumMath.PI_OVER_TWO-x,f=1;f<h+1;++f){if(w=V(M,n,c,m,o,C,l,y,u,w),P=V(Math.PI-M,n,c,m,o,C,l,y,u,P),e){for(O[p++]=w.x,O[p++]=w.y,O[p++]=w.z,d=2*f+2,z=1;z<d-1;++z)_=v.Cartesian3.lerp(w,P,z/(d-1),W),O[p++]=_.x,O[p++]=_.y,O[p++]=_.z;O[p++]=P.x,O[p++]=P.y,O[p++]=P.z}r&&(g[T--]=w.z,g[T--]=w.y,g[T--]=w.x,g[I++]=P.x,g[I++]=P.y,g[I++]=P.z),M=E.CesiumMath.PI_OVER_TWO-(f+1)*x}for(f=h;1<f;--f){if(w=V(-(M=E.CesiumMath.PI_OVER_TWO-(f-1)*x),n,c,m,o,C,l,y,u,w),P=V(M+Math.PI,n,c,m,o,C,l,y,u,P),e){for(O[p++]=w.x,O[p++]=w.y,O[p++]=w.z,d=2*(f-1)+2,z=1;z<d-1;++z)_=v.Cartesian3.lerp(w,P,z/(d-1),W),O[p++]=_.x,O[p++]=_.y,O[p++]=_.z;O[p++]=P.x,O[p++]=P.y,O[p++]=P.z}r&&(g[T--]=w.z,g[T--]=w.y,g[T--]=w.x,g[I++]=P.x,g[I++]=P.y,g[I++]=P.z)}w=V(-(M=E.CesiumMath.PI_OVER_TWO),n,c,m,o,C,l,y,u,w);a={};return e&&(O[p++]=w.x,O[p++]=w.y,O[p++]=w.z,a.positions=O,a.numPts=h),r&&(g[T--]=w.z,g[T--]=w.y,g[T--]=w.x,a.outerPositions=g),a},a.EllipseGeometryLibrary=e});
