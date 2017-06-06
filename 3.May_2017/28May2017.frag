/*
Writing a ray Marched scene
in less than 30 min...

I know, I'm a bit obsessive...
--------------------
Shader-a-day
Darien Brito, May 29, 2017
*/

uniform vec2 u_resolution;

#define STEPS 32
#define LO_CLIP 0.001
#define HI_CLIP 100.0

float sphere(vec3 p, float r) {
	return length(p) - r;
}

float scene(vec3 p) {
	return sphere(p, 1.0);
}

float rayMarch(vec3 origin, vec3 direction, out vec3 p) {
	float totaldistance = 0.0;
	for(int i = 0; i < STEPS; ++i){
		p = origin + (direction * totaldistance);
		float dist = scene(p);
		if(dist < LO_CLIP) {
			return totaldistance;
		}
		totaldistance += dist;
		if(totaldistance >= HI_CLIP){
			break;
		}
	}
	return HI_CLIP;
}

vec3 rayDir(float fov, vec2 res, vec2 coords) {
	vec2 xy = coords - (res * 0.5);
	float z = coords.y / tan(radians(fov) * 0.5);
	return normalize(vec3(xy, -z)); // So when defining camera dist is positive
}

vec3 getNormal(vec3 p) {
	vec3 delta = vec3(0.001, 0.0, 0.0);
	float x = scene(p + delta.xyy) - scene(p - delta.xyy);
	float y = scene(p + delta.yxy) - scene(p - delta.yxy);
	float z = scene(p + delta.yyx) - scene(p - delta.yyx);
	return normalize(vec3(x, y, z));
}

vec3 phong(vec3 p, vec3 camera, vec3 normal){
	vec3 light_pos = vec3(0.0, 0.0, 1.0);
	vec3 light_dir = normalize(light_pos - p);
	vec3 eye_dir = normalize(camera - p);
	vec3 reflection = normalize(reflect(-light_dir, normal));
	float diffuse = max(0.0, dot(light_dir, normal));
	float specular = max(0.0, dot(reflection, eye_dir));

	vec3 ambient = vec3(1.0) * 0.01;
	vec3 color = vec3(1.0, 0.5, 0.25);
	float specularVal = 0.0;
	float shininess = 0.5;
	return ambient + (color * diffuse + pow(specular * specularVal, shininess)); 

}

void main() {
	vec3 camera = vec3(0.0, 0.0, 5.0);
	vec3 direction = rayDir(60.0, u_resolution, gl_FragCoord.xy);
	vec3 p = vec3(0.0);
	float dist = rayMarch(camera, direction, p);
	vec3 color = vec3(0.0);
	if(dist > (HI_CLIP - LO_CLIP)){
		gl_FragColor = vec4(color, 1.0);
		return;
	}
	vec3 normal = getNormal(p);
	color = phong(p, camera, normal);
	gl_FragColor = vec4(color, 1.0);
}

