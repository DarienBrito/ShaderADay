/*
Scene with primitives
with 2 lights (is this the right way to extend lights?)
--------------------
Shader-a-day
Darien Brito, 23 May 2017
*/

#define STEPS 64
#define HI_THRES 100.0
#define LO_THRES 0.001
#define PRIMITIVE 1

uniform vec2 u_resolution;
uniform float u_time;

/*	
	-----------------
	PRIMITIVES
	-----------------
*/

float sphere(vec3 p, float r) {
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

// Hexagon
float sdHexPrism( vec3 p, vec2 h ){
    vec3 q = abs(p);
    return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);
}

/*	
	-----------------
	BOOLEAN OPS
	-----------------
*/

float intersectionSDF(float geo1, float geo2) {
	return max(geo1, geo2);
}

float unionSDF(float geo1, float geo2) {
	return min(geo1, geo2);
}

float differenceSDF(float geo1, float geo2){
	return max(geo1, -geo2);
}

/*	
	-----------------
	Rotation Matrixes
	-----------------
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
	-----------------
	SCENE
	-----------------
*/

float scene(vec3 p) {
	float freq = 30.0;
	float amp = 0.05;
	vec3 pos = p * rotate(u_time * 0.5, 1);
	float displacement = amp*sin(pos.x * freq) * sin(pos.y * freq) * sin(pos.z * freq);
	float s;
	if(PRIMITIVE == 0) {
		s = sphere(pos, 0.5);
	} else if (PRIMITIVE == 1){
		s = sdHexPrism(pos, vec2(0.5, 0.1));
	} else if (PRIMITIVE == 2){
		s = sdTorus(pos, vec2(0.5, 0.2));
	} else if (PRIMITIVE == 3) {
		s = udBox(pos, vec3(0.45));
	} else {
		s = sphere(pos, 0.5);
	}
	float op = differenceSDF(s, sphere(pos, 0.35));
	return op + displacement;
}

/*	
	-----------------
	LIGHTING
	-----------------
*/	

vec3 getNormals(vec3 p, float delta) {
	float x = scene(p + vec3(delta, 0.0, 0.0)) - scene(p - vec3(delta, 0.0, 0.0));
	float y = scene(p + vec3(0.0, delta, 0.0)) - scene(p - vec3(0.0, delta, 0.0));
	float z = scene(p + vec3(0.0, 0.0, delta)) - scene(p - vec3(0.0, 0.0, delta));
	return normalize(vec3(x, y, z));
}

vec3 singleLight(vec3 normal, vec3 lightColor, vec3 lightDir, vec3 ambient_color) {
	float diffuse = max(0.0, dot(lightDir, normal));
	return (diffuse * lightColor) + ambient_color;

}

vec3 lambertianLight(vec3 p, float dist, float fogVal){
		vec3 material = vec3(.23, .22, 0.75); 
		vec3 normal = getNormals(p, 0.01);
		vec3 ambient_color = vec3(0.76, 0.5, 0.24);
		
		vec3 light1 = singleLight(normal, 
			vec3(.8, .8, .9), //light color
			 normalize(vec3(1.0, 1.0, 0.5)), // lightDir
			 ambient_color // ambientColor
			 ); 

		vec3 light2 = singleLight(normal, 
			vec3(.1, 0.9, 0.5), //light color
			 normalize(vec3(-1.0, 1.0, 1.0)), // lightDir
			 ambient_color // ambientColor
			 ); 

	    vec3 diffuse_light = material * light1 + material * light2;
	    float fog = pow(1.0 / (1.0 + dist), fogVal);
	    return diffuse_light * fog;
}

/*	
	-----------------
	RAY MARCHER 
	-----------------
*/

float rayMarch(vec3 origin, vec3 direction, out vec3 p){
	float totalDistance = 0.0;
	for(int i = 0; i < STEPS; ++i){
		p = origin + direction * totalDistance;
		float dist = scene(p);
		if(dist < LO_THRES){
			return totalDistance;
		}
		totalDistance += dist;
		if(totalDistance > HI_THRES){
			return HI_THRES;
		}
	}
	return HI_THRES;
}

vec3 viewRay(float fov, vec2 resolution, vec2 coords){
	vec2 xy = coords - (resolution * 0.5);
	float z = resolution.y / tan(radians(fov) * 0.5);
	return normalize(vec3(xy, -z));
}

/*	
	-----------------
	MAIN PROGRAM
	-----------------
*/

void main() {
	vec3 camera = vec3(0.0, 0.0, 5.0);
	vec3 direction = viewRay(45.0, u_resolution, gl_FragCoord.xy);
	vec3 p = vec3(0.0);
	float dist = rayMarch(camera, direction, p);
	vec3 color;
	if(dist > (HI_THRES - LO_THRES)){
		color = vec3(0.0);
		gl_FragColor = vec4(color, 1.0);
		return;
	}

	color = lambertianLight(p, dist, 0.1);
	gl_FragColor = vec4(color, 1.0);
}


