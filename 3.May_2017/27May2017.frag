/*
Ray marcher from scratch
(attempting no code-peeking whatsoever)

10 min... pfff got stuck with an error...

20 min... got the Lambertian right!

30 min... no succes implementing Phong by myself, 
got mixed up with the light direction business... 

40 min... mmm I need to remember phong depends in 
view point as well! I forgot that!

50 min... had to peek! Damn you normalization! 
Got it to work but not 100% withouth code-peeking
so this one is a fail :(

1hour... added some transforms and displacements

Uploading to Github...
--------------------
Shader-a-day
Darien Brito, May 27, 2017
*/

#define STEPS 64
#define LO_CLIP 0.001
#define HI_CLIP 100.0

uniform vec2 u_resolution;
uniform float u_time;

mat3 rotateY(float angle) {
	float s = sin(angle);
	float c = cos(angle);
	return mat3(
			vec3(c, 0, -s),
			vec3(0, 1, 0),
			vec3(s, 0, c)
		);
}

float sphere(vec3 p, float r) {
	return length(p) - r;
}

float scene(vec3 p) {
	float amp = .6;
	// plug this in grapher to understand:
	float ringModSines = sin(p.x * 4.0 + u_time) * amp * sin(p.y * 4.) * amp * sin(p.z * 4.0) * amp; 
	return sphere(p * rotateY(u_time) + ringModSines, 1.0);
}

vec3 viewRay(float fov, vec2 resolution, vec2 coords) {
	vec2 xy = coords - (resolution * 0.5);
	float z = resolution.y / tan(radians(fov) * 0.5);
	return normalize(vec3(xy, -z));
}

float rayMarch(vec3 origin, vec3 direction, out vec3 p) {
	float totaldistance = 0.0;
	for(int i = 0; i < STEPS; ++i) {
		p = origin + (totaldistance * direction);
		float dist = scene(p);
		if(dist < LO_CLIP) {
			return totaldistance;
		}
		totaldistance += dist;
		if(totaldistance >= HI_CLIP) {
			return HI_CLIP;
		}
	}
	return HI_CLIP;
}

vec3 getNormal(vec3 p) {
	float delta = 0.001;
	float x = scene(p + vec3(delta, .0, .0)) - scene(p - vec3(delta, .0, .0));
	float y = scene(p + vec3(0., delta, .0)) - scene(p - vec3(0., delta, .0));
	float z = scene(p + vec3(0., .0, delta)) - scene(p - vec3(0., .0, delta));
	return normalize(vec3(x, y, z));
}

vec3 lambertianLight(vec3 p, vec3 normal, float f) {
	// In this case light direction can be represented like this 
	// because we do not depend on the point of view
	vec3 lightDir = normalize(vec3(0.0, 1.0, 1.0));  
	vec3 ambientLight = vec3(1.0) * 0.02;
	vec3 material = vec3(1.0, 0.0, 0.0);
	float diffuse = max(0.0, dot(lightDir, normal));
	vec3 finalColor = ambientLight + (material * diffuse);
	// finalColor *= fog;
	return finalColor;
}

vec3 phong(vec3 p, vec3 normal, vec3 eye, float f) {
	// Settings
	vec3 lightPos = vec3(0., 1., 2.0);
	vec3 lightDir = normalize(lightPos - p); // This is what i was missing!
	vec3 eyeDirection = vec3(eye - p);
	// Properties
	vec3 ambientLight = vec3(1.0) * 0.001;
	vec3 material = vec3(1.1, 0.2, 0.0);
	float shininess = 2.0;
	float specularIntensity = 0.16;
	// Calcualtions
	vec3 reflection = normalize(reflect(-lightDir, normal));
	float diffuse = max(0.0, dot(lightDir, normal));
	float specular = max(0.0, dot(reflection, eyeDirection));
	vec3 finalColor = ambientLight + (material * diffuse + pow(specular * specularIntensity, shininess));
	// finalColor *= fog;
	return finalColor;
}

void main() {
	vec3 camera = vec3(0.0, 0.0, 5.0);
	vec3 direction = viewRay(60.0, u_resolution, gl_FragCoord.xy);
	vec3 p = vec3(0.0);
	float dist = rayMarch(camera, direction, p);
	vec3 color;
	if(dist > (HI_CLIP - LO_CLIP)) {
		color = vec3(0.0);
		gl_FragColor = vec4(color, 1.0);
		return;
	}
	color = phong(p, getNormal(p), camera, 0.1);
	gl_FragColor = vec4(color, 1.0);

}