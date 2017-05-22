/*
Playing some more with this code
--------------------
Shader-a-day
Darien Brito, 22 May, 2017
*/

#define HI_THRES 100.0
#define LO_THRES 0.0001
#define STEPS 64
#define PI 3.141592653589
#define TWO_PI 6.283185307178

uniform vec2 u_resolution;
uniform float u_time;

/*	
	---------------
	SOME PRIMITIVES
	---------------
*/

float sphere(vec3 p, float r){
	return length(p) - r;
}

// Unsigned box
float udBox( vec3 p, vec3 b ){
  return length(max(abs(p)-b,0.0));
}

// Signed torus
float sdTorus( vec3 p, vec2 t ) {
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

/*	
	-----------------
	SOME BOOLEAN OPS
	-----------------
*/

float intersectSDF(float geo1, float geo2){
	// negative only if both are negative
	return max(geo1, geo2);
}

float unionSDF(float geo1, float geo2) {
	// negative if both negative or one negative one positive
	return min(geo1, geo2);
}

float differenceSDF(float geo1, float geo2){
	// reverse the effect of union
	return max(geo1, -geo2);
}

/*	
	-----------------------
	SOME ROTATION MATRIXES 
	-----------------------
*/

mat3 rotateX(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(1, 0, 0),
        vec3(0, c, -s),
        vec3(0, s, c)
    );
}

mat3 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, 0, s),
        vec3(0, 1, 0),
        vec3(-s, 0, c)
    );
}

mat3 rotateZ(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, -s, 0),
        vec3(s, c, 0),
        vec3(0, 0, 1)
    );
}

mat3 rotate(float angle, int mode){
	if(mode == 0) {
		return rotateX(angle);
	} else if(mode == 1) {
		return rotateY(angle);
	} else {
		return rotateZ(angle);
	}
}

/*	
	--------------------
	CONSTRUCT THE SCENE 
	--------------------
*/

float scene(vec3 p){
	float s1 = sphere(p, 0.6); // This "chops" the corners of the box
	float rScale = 0.2;
	float b = udBox(p * rotate(u_time, 0) + vec3(0.0, 0.0, sin(u_time) * 0.1), vec3(0.5, 0.45, 0.05));
	float s2 = sphere(p + vec3(cos(u_time) * rScale, sin(u_time) * rScale, 0.0), 0.25);
	float comp = differenceSDF(b, s2);
	return intersectSDF(s1, comp);
	return comp;
}

/*	
	-------------------------
	DEFINE RAY DATA FUNCTIONS
	-------------------------
*/

vec3 viewRay(float fov, vec2 resolution, vec2 coords){
	vec2 xy = coords - (resolution * 0.5); // get a signed representation of coordinate space
	float z = resolution.y / tan(radians(fov) * 0.5); // take smaller side or res and dome some trig magic
	return normalize(vec3(xy, -z));
}

float rayMarch(vec3 origin, vec3 direction, out vec3 p){
	float totalDistance = 0.0;
	for(int i = 0; i < STEPS; ++i){
		p = origin + direction * totalDistance; // point on surface
		float dist = scene(p);
		if(dist < LO_THRES) {
			return totalDistance;
		}
		totalDistance += dist;
		if(totalDistance >= HI_THRES){
			return HI_THRES;
		}
	}
	return HI_THRES;
}

// Get normals bu using the gradient of the surface
vec3 getNormals(vec3 p, float delta) {
	float x = scene(vec3(p.x + delta, p.y, p.z) - scene(vec3(p.x - delta, p.y, p.z)));
	float y = scene(vec3(p.x, p.y + delta, p.z) - scene(vec3(p.x, p.y - delta, p.z)));
	float z = scene(vec3(p.x, p.y, p.z + delta) - scene(vec3(p.x, p.y, p.z - delta)));
	return normalize(vec3(x, y, z));
}

/*	
	----------------
	DEFINE LIGHTNING
	----------------	
	-	We are using here a Lambertian light, which is ismple enough for me to understand :P
	-	For any shading we need to get normals information
	-	For lightning we define some parameters such as material, diffuse and ambient
	-	Lambert lighting is the dot product of a directional light and the normal!
	*/
	vec3 lambertianLight(vec3 p, float dist, float fogVal){
		float fog = pow(1.0 / (1.0 + dist), fogVal);
		vec3 normal = getNormals(p, 0.01);
		vec3 material = vec3(.23, .22, 0.75); 
		vec3 light_dir = normalize(vec3(0.0, sin(u_time), 1.0));
		float diffuse = dot(light_dir, normal);
		//diffuse *= 0.5 + 0.5; // Make that shit positive
		// For real diffuse, use this instead (to avoid negative light)
	    diffuse = max(0.0, diffuse);
	    vec3 light_color = vec3(1.0, 1.0, 1.0);
	    vec3 ambient_color = vec3(0.76, 0.5, 0.24);
	    vec3 diffuse_light = material * (diffuse * light_color + ambient_color);
	    return diffuse_light * fog;
	}
/*	
	-------------
	MAIN PROGRAM
	-------------
*/

void main() {
	vec3 dir = viewRay(45.0, u_resolution, gl_FragCoord.xy);
	vec3 camera = vec3(0.0, 0.0, 5.0);
	vec3 p = vec3(0.0);
	float dist = rayMarch(camera, dir, p); // Pass p ot get point on surface
	vec3 color = vec3(0.0);

	/* OPTIMIZATION */
	/* if we don't hit anything we can ignore further calculations and return 
	current pixel pitch black */
	if(dist > (HI_THRES - LO_THRES)){
		gl_FragColor = vec4(color, 1.0);
		return;
	}
	// If we do hit something, we are gonna shade it!
    color = lambertianLight(p, dist, 0.2);
    gl_FragColor = vec4(color, 1.0);

}

