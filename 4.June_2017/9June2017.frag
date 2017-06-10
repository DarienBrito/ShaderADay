/*
More experiments with color maps and ray marching
(gotta be pacient with this one, takes a while to unfold)
--------------------
Shader-a-day
Darien Brito, June 9 2017
*/

uniform vec2 u_resolution;
uniform float u_time;

#define LO 0.001
#define HI 100.0
#define STEPS 64

float scene(vec3 p) {
    vec3 q = fract(p * sin(u_time * 0.01) * 0.1 + 4.0) * 2.0 - 1.0;
    return length(q);
}

float rayMarch(vec3 o, vec3 d) {
    float td = 0.0;
    for(int i = 0; i < STEPS; i++) {
        vec3 p = o + td * d;
        float dist = scene(p);
        td += dist;
    }
    return td;
}

vec3 rayDir(float fov, vec2 res, vec2 coords) {
    vec2 xy = coords - (res * 0.5);
    float z = res.y / tan(radians(fov) * 0.5);
    return normalize(vec3(xy, -z));
}

vec3 getNormal(vec3 p){
    vec3 delta = vec3(0.01, 0., 0.);
    float x = scene(p + delta.xyy) - scene(p - delta.xyy);
    float y = scene(p + delta.yxy) - scene(p - delta.yxy);
    float z = scene(p + delta.yyx) - scene(p - delta.yyx);
    return normalize(vec3(x,y,z));
}

vec3 phong(vec3 p, vec3 eye, vec3 normal) {
    vec3 m1 = vec3(0., .2, .4);
    vec3 m2 = vec3(1.0, 0., 0.);

    vec3 ambient = vec3(1.0) * 0.1;
    vec3 light_pos = vec3(0., 0., 2.0);
    //vec3 light_pos = vec3(cos(u_time), sin(u_time), 1.0);
    
    vec3 light_dir = normalize(light_pos - p);
    vec3 eye_dir = normalize(eye - p);
    vec3 reflection = normalize(reflect(-light_dir, normal));

    float diffuse = max(0.0, dot(light_dir, normal));
    float specular = max(0.0, dot(reflection, eye_dir));
    float shininess = .1;
    float specularFactor = 0.5;

    vec3 material = mix(m1, m2, reflection);
    return ambient + (material * diffuse + (pow(specular * specularFactor, shininess)));
}

void main() {
    vec3 camera = vec3(0.0, 0.0, u_time);
    vec3 direction = rayDir(90.0, u_resolution, gl_FragCoord.xy);
    float dist = rayMarch(camera, direction);
    vec3 color;

    if(dist > (HI - LO)) {
        color = vec3(0.);
        gl_FragColor = vec4(color, 1.0);
        return;
    }
    vec3 p = camera + direction * dist;
    vec3 normal = getNormal(p);
    color = phong(p, camera, -normal);
    gl_FragColor = vec4(color, 1.0);
}







