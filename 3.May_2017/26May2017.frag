/*
Light study, lambertian

Implementing some data management
suggestions by shader-pal Tim Gerritsen,
namely re-arranging stuff in structs

Notice that up intil now, I have been 
treating the light position as equal to
the light direction. This may change
when implementing other types of light...
----------------------------------------
Shader-a-day
Darien Brito, 26 May, 2017
*/


#define LO_CLIP 0.001
#define HI_CLIP 100.0

#define NUM_LIGHTS 3
#define STEPS 32
#define PI 3.141592653589
#define HALF_PI 1.570796326795

uniform float u_time;
uniform vec2 u_resolution;

struct Light {
	vec3 intensity;
	vec3 color;
	vec3 direction;
};

struct Material {
	vec3 color;
	float diffuse;
	vec3 ambient;
	float ambientIntensity;
	float specular;
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

Light lights[NUM_LIGHTS]; // Array to store multiple lights conveniently

float sphere(vec3 p, float r) {
	return length(p) - r;
}

float opUnion(float geo1, float geo2) {
	return min(geo1, geo2);
}

float scene(vec3 p) {
	float s1 = sphere(p, 0.75);
	float amp = 1.2;
	float s2 = sphere(p + vec3(cos(u_time) * amp,sin(u_time) * amp,0.0), 0.1);
	return opUnion(s1, s2);
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
	float z = resolution.y / tan(fov * 0.5);
	return normalize(vec3(xy, -z));
}

vec3 getNormal(vec3 p){
	float delta = 0.01;
	float x = scene(p + vec3(delta, 0.0, 0.0)) - scene(p - vec3(delta, 0.0, 0.0));
	float y = scene(p + vec3(0.0, delta, 0.0)) - scene(p - vec3(0.0, delta, 0.0));
	float z = scene(p + vec3(0.0, 0.0, delta)) - scene(p - vec3(0.0, 0.0, delta));
	return normalize(vec3(x,y,z));
}

vec3 lambertianLight(Light l, float fogVal, Object o) {
		vec3 ambient_color = o.material.ambient * o.material.ambientIntensity;
		float diffuse = max(0.0, dot(l.direction, o.normal));
		vec3 lightContribution = (l.color * diffuse) * l.intensity + ambient_color;
		lightContribution *= o.material.color;
		float fog = pow(1.0 / (1.0 + o.totalDistance), fogVal);
		return lightContribution * fog; 
}

void main() {
	vec3 camera = vec3(0.0, 0.0, 5.0);
	vec3 direction = rayDir(HALF_PI, u_resolution, gl_FragCoord.xy);
	vec3 p = vec3(0.0);
	float dist = rayMarch(camera, direction, p);
	vec3 color = vec3(0.0);
	
	if(dist > (HI_CLIP - LO_CLIP)){
		gl_FragColor = vec4(color, 1.0);
		return; 
	}

	Ray r = Ray(camera, direction);
	Material m = Material(vec3(1.0), 0.5, vec3(0.9), 0.025, 0.7, 20.0);
	Object o = Object(m, getNormal(p), p, dist);
	lights[0] = Light(vec3(.6), vec3(1.0, 0.0, 0.0), normalize(vec3(-1.0, 1.0, 1.0)));
	lights[1] = Light(vec3(.6), vec3(0.0, 1.0, 0.0), normalize(vec3(1.0, 1.0, 1.0)));
	lights[2] = Light(vec3(.6), vec3(0.0, 0.0, 1.0), normalize(vec3(0.0, 0.0, 1.0)));

	for(int i = 0; i < NUM_LIGHTS; i++){
		color += lambertianLight(lights[i], 0.05, o);
	}

	gl_FragColor = vec4(color, 1.0);
}
