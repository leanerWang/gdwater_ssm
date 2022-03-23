
//import LineImageTrailMaterial from'../shader/PolylineImageTrailMaterial.glsl'
/**
 * PolylineImageTrail
 * @type {string}
 */
 var LineImageTrailMaterial = `uniform sampler2D image;
 uniform float speed;
 uniform vec4 color;
 uniform vec2 repeat;
 
 czm_material czm_getMaterial(czm_materialInput materialInput){
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = repeat * materialInput.st;
    float time = fract(czm_frameNumber * speed / 1000.0);
    vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));
    if(color.a == 0.0){
     material.alpha = colorImage.a;
     material.diffuse = colorImage.rgb;
    }else{
     material.alpha = colorImage.a * color.a;
     material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);
    }
    return material;
 }
 `
function addPolylineImageTrailType() {   
    Cesium.Material.PolylineImageTrailType = 'PolylineImageTrail'
    Cesium.Material._materialCache.addMaterial(
        Cesium.Material.PolylineImageTrailType,
        {
            fabric: {
                type: Cesium.Material.PolylineImageTrailType,
                uniforms: {
                    color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
                    image: Cesium.Material.DefaultImageId,
                    speed: 1,
                    repeat: new Cesium.Cartesian2(1, 1)
                },
                source: LineImageTrailMaterial
            },
            translucent: function(material) {
                return true
            }
        }
    )
}

export default addPolylineImageTrailType