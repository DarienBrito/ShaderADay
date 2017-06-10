/*
Kaleidoscopic candy

based on code by dila
https://www.shadertoy.com/view/4lSXDw
--------------------
Shader-a-day
Darien Brito, June 7, 2017
*/


uniform vec2 u_resolution;
uniform float u_time;

#define STEPS 64

float map(vec3 p) {
    float density = 0.5;
    vec3 q = (fract(p * density) * 2.0 - 1.0); // Make it signed 
    return length(q);
}

vec3 getNormal(vec3 p)
{
	vec3 delta = vec3(0.01, 0.0, 0.0);
    return normalize(vec3(map(p+delta.xyy) - map(p-delta.xyy),
                          map(p+delta.yxy) - map(p-delta.yxy),
                          map(p+delta.yyx) - map(p-delta.yyx)));
}

float trace(vec3 o, vec3 r) {
    float totalDist = 0.0;
    for (int i = 0; i < STEPS; ++i) {
        vec3 p = o + r * totalDist;
        float d = map(p);
        totalDist += d * 0.15;
    }
    return totalDist;
}

vec3 rayDir(float fov, vec2 coords, vec2 res) {
    vec2 xy = coords - res * 0.5;
    float z = res.y / tan(radians(fov) * 0.5);
    return normalize(vec3(xy, z));
}

void main()
{    
    vec3 o = vec3(0.0, 0.0, u_time * 0.5);
    vec3 r = rayDir(100.0, gl_FragCoord.xy, u_resolution);
    float d = trace(o, r);

    vec3 w = o + r * d;
    float fd = map(w);
   	vec3 normal = getNormal(w);
    
    float diffusion = max(dot(r, -normal), 0.0);
    float fog = diffusion * 50.0 / d * 2.0 + fd - .9; 
    
    vec3 sc = vec3(0.1, 0.3, 1.0);
    vec3 ec = vec3(0.9, 0.0, 0.0);
    vec3 fc = mix(sc, ec, fd);
    
    fc *= fog;
    
	gl_FragColor = vec4(sqrt(fc),1.0);
}