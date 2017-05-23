/*
Scene with primitives
--------------------
Shader-a-day
Darien Brito, 23 May 2017
*/

#define STEPS 64
#define HI_THRES 10.0
#define LO_THRES 0.0001

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

// Unsigned round-box
float udRoundBox( vec3 p, vec3 b, float r ){
  return length(max(abs(p)-b,0.0))-r;
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
	float amp = 0.04;
	vec3 pos = p * rotate(u_time * 0.5, 1);
	float displacement = amp*sin(pos.x * freq) * sin(pos.y * freq) * sin(pos.z * freq);
	float s = sphere(pos, 0.5) + displacement;
	return s;
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

vec3 lambertianLight(vec3 p, float dist, float fogVal){
		vec3 normal = getNormals(p, 0.01);
		vec3 material = vec3(.23, .22, 0.75); 
		vec3 light_dir = normalize(vec3(0.0, 1.0, 1.0));
		float diffuse = dot(light_dir, normal);
	    diffuse = max(0.0, diffuse);
	    vec3 light_color = vec3(1.0, 1.0, 1.0);
	    vec3 ambient_color = vec3(0.76, 0.5, 0.24);
	    vec3 diffuse_light = material * (diffuse * light_color + ambient_color);
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


