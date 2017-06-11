/*
Plane and objects
--------------------
Shader-a-day
Darien Brito, June 10 2017

I have the plane, kinda,  and I'm using a lookAt matrix... 
but now how I do texture the plane correctly?
*/

#define STEPS 128

uniform vec2 u_resolution;
uniform float u_time;


float sdPlane( vec3 rayPos, vec4 n ) {
  n = normalize(n); // orientation of plane, n must be normalized!
  return dot(rayPos, n.xyz) + n.w;
}

float sphere(vec3 p, float r) {
	return length(p + vec3(0., -0.9, 0.)) - r;
}
float opUnion(float s1, float s2) {
	return min(s1, s2);
}

float scene(vec3 p) {
	float s1 = sphere(p, .5);
	float s2 = sdPlane(p, vec4(0.0, 1.0, 0.0, 0.));
	return opUnion(s1, s2);
	//return sdPlane(p, vec4(0.0, 1.0, 0.0, 1.0));
	//return sphere(p, .5);
}

mat4 viewMatrix(vec3 eye, vec3 center, vec3 up) {
    // Based on gluLookAt man page
    vec3 f = normalize(center - eye);
    vec3 s = normalize(cross(f, up));
    vec3 u = cross(s, f); // Remember the right hand rule
   	// https://en.wikipedia.org/wiki/Cross_product
    return mat4(
        vec4(s, 0.0),
        vec4(u, 0.0),
        vec4(-f, 0.0),
        vec4(0.0, 0.0, 0.0, 1)
    );
}

vec3 rayDir(float fov, vec2 res, vec2 coord) {
	vec2 xy = coord - (res * 0.5);
	float z = res.y / tan(radians(45.0) * 0.5);
	return normalize(vec3(xy, -z));
}

vec3 getNormal(vec3 p) {
	vec3 delta = vec3(0.001, 0., 0.);
	float x = scene(p + delta.xyy) - scene(p - delta.xyy);
	float y = scene(p + delta.yxy) - scene(p - delta.yxy);
	float z = scene(p + delta.yyx) - scene(p - delta.yyx);
	return normalize(vec3(x,y,z));
}

vec2 rayMarch(vec3 origin, vec3 direction, inout vec3 p) {
	float totalDistance = 0.;
	float location = 0.;
	for(int i = 0; i < STEPS; i++) {
		p = origin + direction * totalDistance;
		float dist = scene(p);
		if(dist < 0.001 || totalDistance >= 100.0){
			break;
		}
		totalDistance += dist;
	}
	location = totalDistance > 100.0 ? 0. : 1.;
	return vec2(totalDistance, location);
}

vec3 phong(vec3 normal, vec3 p, vec3 eye) {
	vec3 material = vec3(0., 1.0, 0.);
	vec3 ambient = vec3(1.) * 0.01;
	vec3 light_pos = vec3(0., 1., 1.);

	vec3 lightDir = normalize(light_pos - p);
	vec3 eyeDir = normalize(eye - p);
	vec3 reflection = normalize(reflect(-lightDir, normal));
	
	float diffuse = max(0., dot(light_pos, normal));
	float specular = max(0., dot(reflection, eyeDir));
	float specVal = 0.5;
	float shininess = 20.0;
	return ambient + (material * diffuse + pow(specular * specVal, shininess));
}

void main() {
	vec3 camera = vec3(10.0, 1.0, 4.0);
	vec3 direction = rayDir(90.0, u_resolution, gl_FragCoord.xy);
	// Look at:
	mat4 viewToWorld = viewMatrix(camera, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    vec3 worldDir = (viewToWorld * vec4(direction, 0.0)).xyz;

	vec3 p = vec3(0.);	
	vec2 marched = rayMarch(camera, worldDir, p);
	vec3 normal = getNormal(p);
	vec3 color = marched.y > 0. ? phong(normal, p, camera) : vec3(0.);
	gl_FragColor = vec4(color, 1.0);

}
