/*
Scene with primitives
with 2 lights (is this the right way to extend lights?)
--------------------
Shader-a-day
Darien Brito, 23 May 2017
*/



// struct Object
// {
// 	uint index;
// 	float distance;
// 	vec3 hitPosition;
// 	vec3 hitNormal;
// 	Material material;
// };

// Object scene(vec3 p) {
// 	Object o;
// 	float s = sphere(p, 1.0);
// 	o.distance = s;
// 	return o
// }

#define STEPS 64
#define HI_THRES 100.0
#define LO_THRES 0.001
#define PRIMITIVE 0

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
	return s + displacement;
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

// phong shading
vec3 phongLight( vec3 v, vec3 n, vec3 eye ) {
	// ...add lights here...
	float shininess = 50.0;
	vec3 final = vec3( 0.0 );
	vec3 ev = normalize( v - eye );
	vec3 ref_ev = reflect( ev, n );
	
	// Light Component
	vec3 light_pos   = vec3( 0.0, 20.0, 0.0 );
	vec3 light_color = vec3( 1.0, 0.7, 0.7 );
	vec3 vl = normalize( light_pos - v );
	float diffuse  = max( 0.0, dot( vl, n ) );
	float specular = max( 0.0, dot( vl, ref_ev ) );
	specular = pow( specular, shininess );
	final += light_color * ( diffuse + specular ); 

	return final;
}

// phong shading
vec3 phongLight(vec3 ambientLight, vec3 dif, vec3 spec, float shininess, vec3 p, vec3 eye, vec3 light_pos, vec3 light_intensity) {
	vec3 color = vec3(0.0);
	color += ambientLight;
	// Phong calculation
	vec3 surfaceNormal = getNormals(p, 0.1);
	vec3 lightDir = normalize(light_pos - p);
	vec3 viewPoint = normalize(eye - p);
	vec3 reflection = normalize(reflect(-lightDir, surfaceNormal));
	float diffuse = max(0.0, dot(lightDir, surfaceNormal));
	float specular = max(0.0, dot(reflection, viewPoint));
	vec3 lightValue = light_intensity * (dif * diffuse + spec * pow(specular, shininess));
	return color += lightValue;
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

vec3 rayDir(float fov, vec2 resolution, vec2 coords){
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
	vec3 direction = rayDir(45.0, u_resolution, gl_FragCoord.xy);
	vec3 pointOnSurface = vec3(0.0);
	float dist = rayMarch(camera, direction, pointOnSurface);
	vec3 color;
	if(dist > (HI_THRES - LO_THRES)){
		color = vec3(0.0);
		gl_FragColor = vec4(color, 1.0);
		return;
	}
	
	// Parameters for light	
	vec3 lightPosition = vec3(0.5, 1.0, 2.0);
	vec3 ambient = vec3(0.025);
	vec3 diffusion = vec3(0.9, 0.2, 0.2);
	vec3 specular = vec3(0.7);
	float shininess = 20.0;
	vec3 light_intensity = vec3( 1.0, 0.7, 0.7 );

	color = phongLight(ambient, diffusion, specular, shininess, pointOnSurface,
		camera, lightPosition, light_intensity);
	gl_FragColor = vec4(color, 1.0);
}


