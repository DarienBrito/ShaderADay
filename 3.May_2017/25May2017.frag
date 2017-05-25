/*
Another ray marcher with an
abstract form, using some funcs by IQ
--------------------
Shader-a-day
Darien Brito, 25 May 2017
*/

#define STEPS 64
#define HALF_PI 1.570796326795
#define PI 3.1415926538
#define LO 0.001
#define HI 100.0

uniform vec2 u_resolution;
uniform float u_time;

float sdBox( vec3 p, vec3 b ) {
	vec3 d = abs(p) - b;
	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0)); }

float opTwist(vec3 p, float freq) {
	float c = cos(freq * p.y);
	float s = sin(freq * p.y);
	mat2 m = mat2(c, -s, s, c); // A rotation matrix on x y axis
	vec3 q = vec3(m * p.xz, p.y); // Alter desired axis
	return sdBox(q, vec3(1.0));
}

mat3 rotateY(float angle) {
	float c = cos(angle);
	float s = sin(angle);
	return mat3(
		vec3(c, 0.0, -s),
		vec3(0.0, 1.0, 0.0),
		vec3(s, 0.0, c)
		);
}

float scene(vec3 p){
	float freq = cos(u_time * 0.1) * 1.5;
	float displacement = sin(p.x * freq) * sin(p.y * freq) * sin(p.z * freq);
	return opTwist(p * rotateY(u_time * 0.1), 1.2) * 1.125 + displacement;
}

// We can pass directly HALF_PI or so instead of 45 in radians
vec3 rayDir(float fov, vec2 resolution, vec2 coordinates){
	vec2 xy = coordinates - (resolution * 0.5);
	float z = resolution.y / tan(fov * 0.5);
	return normalize(vec3(xy, -z));
}

float rayMarch(vec3 origin, vec3 direction, out vec3 p){
	float totalDistance = 0.0;
	for(int i = 0; i < STEPS; ++i){
		p = origin + (direction * totalDistance);
		float dist = scene(p);
		if(dist < LO) {
			return totalDistance;
		}
		totalDistance += dist;
		if(totalDistance >= HI) {
			return HI;
		}
	}
	return HI;
}

vec3 getNormals(vec3 p, float delta) {
	float x = scene(p + vec3(delta, 0.0, 0.0)) - scene(p - vec3(delta, 0.0, 0.0));
	float y = scene(p + vec3(0.0, delta, 0.0)) - scene(p - vec3(0.0, delta, 0.0));
	float z = scene(p + vec3(0.0, 0.0, delta)) - scene(p - vec3(0.0, 0.0, delta));
	return normalize(vec3(x, y, z));
}

vec3 phongLight(vec3 ambientLight, vec3 dif, vec3 spec, float shininess, vec3 p, vec3 eye, vec3 light_pos, vec3 light_intensity) {
	vec3 color = vec3(0.0);
	color += ambientLight;
	vec3 surfaceNormal = getNormals(p, 0.1);
	vec3 lightDir = normalize(light_pos - p);
	vec3 viewPoint = normalize(eye - p);
	vec3 reflection = normalize(reflect(-lightDir, surfaceNormal));
	float diffuse = max(0.0, dot(lightDir, surfaceNormal));
	float specular = max(0.0, dot(reflection, viewPoint));
	vec3 lightValue = light_intensity * (dif * diffuse + spec * pow(specular, shininess));
	return color += lightValue;
}

void main() {
	vec3 camera = vec3(0.0, 0.0, 5.0);
	vec3 direction = rayDir(HALF_PI, u_resolution, gl_FragCoord.xy);
	vec3 p = vec3(0.0);
	float dist = rayMarch(camera, direction, p);
	vec3 color;
	vec3 normals = getNormals(p, 0.01);

	if(dist > (HI - LO)){
		color = vec3(0.0);
		gl_FragColor = vec4(color, 1.0);
		return;
	}
	// Parameters for light
	vec3 lightPosition = vec3(0.5, 1.0, 2.0);
	vec3 ambient = vec3(0.025);
	vec3 diffusion = vec3(0.11, 0.5, 0.59);
	vec3 specular = vec3(0.7);
	float shininess = 20.0;
	vec3 light_intensity = vec3( 1.0, 0.7, 0.7 );
	// Calculate light
	color = phongLight(ambient, diffusion, specular, shininess, p,
		camera, lightPosition, light_intensity);

	gl_FragColor = vec4(color, 1.0);
}

