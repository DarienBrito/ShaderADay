/*
Re-cap

based on code by dila
https://www.shadertoy.com/view/4lSXDw
--------------------
Shader-a-day
Darien Brito, 8 June 2017
*/

uniform vec2 u_resolution;
uniform float u_time;

#define STEPS 32
#define LO_CLIP 0.001
#define HI_CLIP 100.0
#define SIZE 1.0

mat3 rotateX(float angle){
	float c = cos(angle);
	float s = sin(angle);
	return mat3(
			vec3(1, 0, 0),
			vec3(0, c, -s),
			vec3(0, s, c)
		);
}

float scene(vec3 p) {
    vec3 q = (fract(p * SIZE) * 2.0 - 1.0); // Make it signed 
    vec3 s = 0.5 - abs(normalize(q));
    q = sign(q) * s; //Extracts the sign, -1 if < 0, 0.0 if 0.0, +1 if > 0
    float l = length(q);
    return abs(sin(l * 2.0) * 2.0);
}

vec3 getNormal(vec3 p ){
	vec3 delta = vec3(0.001, 0.0, 0.0);
	float x = scene(p + delta.xyy) - scene(p - delta.xyy);
	float y = scene(p + delta.yxy) - scene(p - delta.yxy);
	float z = scene(p + delta.yyx) - scene(p - delta.yyx);
	return normalize(vec3(x,y,z));
}

float rayMarch(vec3 origin, vec3 direction, inout vec3 p) {
	float totalDistance = 0.0;
	for(int i = 0; i < STEPS; i++) {
		p = origin + (direction * totalDistance);
		float dist = scene(p);
		totalDistance += dist * 0.1;
	}
	return totalDistance;
}

vec3 rayDir(float fov, vec2 resolution, vec2 coords) {
	vec2 xy = coords - (resolution * 0.5);
	float z = resolution.y / tan(radians(fov) * 0.5);
	return normalize(vec3(xy, -z));
}


void main() {
	vec3 camera = vec3(0.0, 0.0, u_time * 0.1);
	vec3 direction = rayDir(90.0, u_resolution, gl_FragCoord.xy);
	vec3 p;
	float dist = rayMarch(camera, direction, p);
	vec3 normal = getNormal(p); 
	float map = scene(p);

	float diffusion = max(0.0, dot(direction, -normal));
	vec3 sc = vec3(1.0, 0.25, 0.1);
    vec3 ec = vec3(0.5, 0.33, 0.45);
    vec3 fc = mix(sc, ec, map);
	vec3 color = fc * diffusion;
	gl_FragColor = vec4(color * 1.5, 1.0);
}