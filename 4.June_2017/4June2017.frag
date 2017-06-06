uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.141592653589
#define STEPS 364
#define LO_THRES 0.001
#define HI_THRES 100.0

// OPS
float unionOP(float geo1, float geo2) {
	return min(geo1, geo2);
}

float intersectOP(float geo1, float geo2) {
	return max(geo1, geo2);
}

float differenceOP(float geo1, float geo2) {
	return max(geo1, -geo2);
}

mat3 rotatex(float angle) {
	float c = cos(angle);
	float s = sin(angle);
	return mat3(
		vec3(1, 0, 0),
		vec3(0, c, -s),
		vec3(0, s, c)
		);
}

mat3 rotatey(float angle) {
	float c = cos(angle);
	float s = sin(angle);
	return mat3(
		vec3(c, 0, -s),
		vec3(0, 1, 0),
		vec3(s, 0, c)
		);
}

float sphere(vec3 p, float r) {
	return length(p) - r;
}

float maxVals(vec3 p){
	return max(p.x, max(p.y, p.z));
}

float sdBox(vec3 p, vec3 b, float r) {
    vec3 d = abs(p) - b;
    return min(maxVals(d), 0.0) - r + length(max(d,0.0));
}

float sine(float axis, float freq, float amp) {
	return sin(axis * freq) * amp;
}

vec3 repeat(vec3 p, vec3 spacing) {
	return mod(p, spacing) - spacing * 0.5;
}

float scene(vec3 p) {
	float freq = 20.0;
	float amp = .3;
	vec3 q = repeat(p, vec3(5.0));
	float displace = sine(q.x, freq, amp) * sine(q.y, freq, amp) * sine(q.z, freq, amp);
	float s1 = sphere(q * rotatey(u_time) + displace, 1.5);
	return s1;
}

float rayMarch(vec3 origin, vec3 direction, out vec3 p) {
	float totalDistance = 0.0;
	for(int i = 0; i < STEPS; i++) {
		p = origin + (direction * totalDistance);
		float dist = scene(p);
		if(dist < LO_THRES) {
			return totalDistance;
		}
		totalDistance += dist;
		if(totalDistance >= HI_THRES) {
			return HI_THRES;
		}
	}
	return HI_THRES;
}

vec3 rayDir(float fov, vec2 resolution, vec2 coords) {
	vec2 xy = coords - (resolution * 0.5); // Move coords to signed space
	float z = resolution.y / tan(radians(fov)  * 0.5);
	return normalize(vec3(xy, -z)); // negative so we can define camera as positive
}

vec3 getNormal(vec3 p) {
	vec3 delta = vec3(0.001, 0.0, 0.0);
	float x = scene(p + delta.xyy) - scene(p - delta.xyy);
	float y = scene(p + delta.yxy) - scene(p - delta.yxy);
	float z = scene(p + delta.yyx) - scene(p - delta.yyx);
	return normalize(vec3(x,y,z));
}

vec3 phong(vec3 p, vec3 eye, vec3 normal) {
	vec3 material = vec3(0.1, .2, .4);

	vec3 ambient = vec3(1.0) * 0.1;
	vec3 light_pos = vec3(0., 0., 0.0);
	//vec3 light_pos = vec3(cos(u_time), sin(u_time), 1.0);
	
	vec3 light_dir = normalize(light_pos - p);
	vec3 eye_dir = normalize(eye - p);
	vec3 reflection = normalize(reflect(-light_dir, normal));

	float diffuse = max(0.0, dot(light_dir, normal));
	float specular = max(0.0, dot(reflection, eye_dir));
	float shininess = 1.7;
	float specularFactor = 0.5;

	return ambient + (material * diffuse + (pow(specular * specularFactor, shininess)));
}


void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st.x *= u_resolution.x/u_resolution.y;
	vec3 camera = vec3(0.0, 0.0, 5.0);
	vec3 direction = rayDir(45.0, u_resolution, gl_FragCoord.xy);
	vec3 p = vec3(0.0);
	vec3 color;
	float dist = rayMarch(camera, direction, p);
	// Check if too far
	if(dist > (HI_THRES - LO_THRES)) {
		float rad = length(st - vec2(0.5));
		color =  1.0 - vec3(pow(rad, 0.2));
		gl_FragColor = vec4(color, 1.0);
		return;
	}
	vec3 normal = getNormal(p);
	color = phong(p, camera, normal);
	gl_FragColor = vec4(color, 1.0);
}