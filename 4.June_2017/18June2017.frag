/*
Compositing primitives
Shader-a-day
Darien Brito, 18 June, 2017
*/

#define LO_CLIP 0.001
#define HI_CLIP 100.0

#define NUM_LIGHTS 2
#define STEPS 128
#define PI 3.141592653589
#define HALF_PI 1.570796326795

uniform float u_time;
uniform vec2 u_resolution;

struct Light {
	vec3 intensity;
	vec3 position;
};

struct Material {
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float shininess;
};

struct Object {
	Material material;
	vec3 normal;
	vec3 position;
	float totalDistance;
};

struct Ray {
	vec3 origin;
	vec3 direction;
};

Light lights[NUM_LIGHTS]; 

float fSphere(vec3 p, float r) {
	return length(p) - r;
}

float fTorus(vec3 p, float smallRadius, float largeRadius) {
	return length(vec2(length(p.xz) - largeRadius, p.y)) - smallRadius;
}

// The "Round" variant uses a quarter-circle to join the two objects smoothly:
float fOpUnionRound(float a, float b, float r) {
	vec2 u = max(vec2(r - a,r - b), vec2(0));
	return max(r, min (a, b)) - length(u);
}

void pR(inout vec2 p, float a) {
	p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

mat3 rotateY(float a) {
	float s = sin(a);
	float c = cos(a);
	return mat3(
			vec3(0, 1, 0),
			vec3(c, 0, -s),
			vec3(s, 0, c)
		);
}

mat3 rotateZ(float a) {
	float s = sin(a);
	float c = cos(a);
	return mat3(
			vec3(0, 0, 1),
			vec3(c, -s, 0),
			vec3(s, c, 0)
		);
}

float scene(vec3 p) {
	vec3 q = p * rotateY(u_time * 0.5);
	q *= rotateZ(u_time * 0.75);
	float inner = .1;
	float outer = 1.;
	// ring 1
	float sdf1 = fTorus(q, inner, outer);
	// ring 2
	vec3 p2 = q;
	pR(p2.xy, 45.);
	float sdf2 = fTorus(p2, inner, outer);
	// ring 3
	vec3 p3 = q;
	pR(p3.xy, 90.);
	float sdf3 = fTorus(p3, inner, outer);
	// carving sphere
	float sdf4 = fSphere(p, 1.);
	// center sphere
	float a = 0.5;
	float f = 8.0;
	float displacement = sin(p.x*f)*a * sin(p.y*f)*a;
	float sdf5 = fSphere(q + displacement, .6);

	float junction = .2;
	float s = fOpUnionRound(sdf1, sdf2, junction);
	s = fOpUnionRound(s, sdf3, junction);
	s = max(s, -sdf4);
	s = min(s, sdf5);
	return s;
}

float rayMarch(vec3 origin, vec3 direction, inout vec3 p){
	float totaldistance = 0.0;
	for (int i = 0; i < STEPS; ++i){
		p = origin + (direction * totaldistance);
		float dist = scene(p);
		if(dist < LO_CLIP){
			return totaldistance;
		}
		totaldistance += dist;
		if(totaldistance >= HI_CLIP){
			return HI_CLIP;
		}
	}
	return HI_CLIP;
}

vec3 rayDir(float fov, vec2 resolution, vec2 coordinates){
	vec2 xy = coordinates - (resolution * 0.5);
	float z = resolution.y / tan(radians(fov) * 0.5);
	return normalize(vec3(xy, -z));
}

vec3 getNormal(vec3 p){
	vec3 delta = vec3(0.01, 0., 0.);
	float x = scene(p + delta.xyy) - scene(p - delta.xyy);
	float y = scene(p + delta.yxy) - scene(p - delta.yxy);
	float z = scene(p + delta.yyx) - scene(p - delta.yyx);
	return normalize(vec3(x,y,z));
}

vec3 phongLight(Light l, float fogVal, Object o, Ray r) {
	// Get control data from structs
	vec3 k_ambient = o.material.ambient;
	vec3 k_diffuse = o.material.diffuse;
	vec3 k_specular = o.material.specular;
	float k_shininess = o.material.shininess;
	// Calculate ambient light
	vec3 ambientLight = 0.5 * vec3(1.0); 	
	ambientLight *= o.material.ambient;
	// Calculate parameters
	vec3 light_dir = normalize(l.position - o.position);
	vec3 viewpoint = normalize(r.origin - o.position);
	vec3 reflection = normalize(reflect(-light_dir, o.normal));
	float diffuse = max(0.0, dot(light_dir, o.normal));
	float specular = max(0.0, dot(reflection, viewpoint));
	// Compute final color
	vec3 lightContribution = l.intensity * (diffuse * k_diffuse + k_specular * pow(specular, k_shininess));
	vec3 color = ambientLight + lightContribution;
	// Add some fog
	float fog = pow(1.0 / (1.0 + o.totalDistance), fogVal);
	return color * fog;
}

void main() {
	vec3 camera = vec3(0.0, 0.0, 10.0);
	vec3 direction = rayDir(45.0, u_resolution, gl_FragCoord.xy);
	vec3 p;
	float dist = rayMarch(camera, direction, p);
	vec3 color = vec3(0.1);
	
	if(dist > (HI_CLIP - LO_CLIP)){
		gl_FragColor = vec4(color, 1.0);
		return; 
	}

	// vec3 origin; vec3 direction;
	Ray r = Ray(camera, direction);
	// vec3 ambient; vec3 diffuse; vec3 specular; float shininess;
	Material m = Material(vec3(0.02), vec3(0.6, 0.2, 0.2), vec3(1.0), 10.0);
	Object o = Object(m, getNormal(p), p, dist);
	// vec3 intensity; vec3 position;
	lights[0] = Light(vec3(0.5), vec3(-10.0, .0, 15.0));
	lights[1] = Light(vec3(0.1, 0.9, 0.9), vec3(10.0, .0, 15.0));

	for(int i = 0; i < NUM_LIGHTS; i++){
		color += phongLight(lights[i], 0.1, o, r);
	}

	gl_FragColor = vec4(color, 1.0);
}
