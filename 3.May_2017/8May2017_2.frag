/*
Ray-marching after studying the math... (full analysis in my notebook)
It is actually quite simple! Things to remember:
+ The length of a 3D vector v is = sqrt(pow(v.x, 2.0) + pow(v.y, 2.0), pow(v.z, 2.0))
+ This is parallel computation, so we cast a ray from each pixel to see if intersects with geometry at some point
+ Some pixels are gonna intersect, some not, this is what we check with the conditionals in the tracing func.
--------------------		
Shader-a-day
Darien Brito, 8 May 2017
*/

uniform vec2 u_resolution;

float sphere(vec3 p, float r) {
	return length(p) - r;
}

float scene(vec3 p) {
	return sphere(p, 3.0);
}

float tracing(vec3 origin, vec3 direction) {
	float currentDistance = 0.0;
	for(int i = 0; i < 32; ++i) {
		vec3 p = origin + (direction * currentDistance);
		float distanceToObj = scene(p);
		currentDistance += distanceToObj;
		// Check if intersection will happen...
		if(distanceToObj < 0.001) {
			break;
		}
		// Check if we are marching to emptiness...
		if(currentDistance > 10000.0){
			currentDistance = 0.0;
			break;
		}
	}
	return currentDistance;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution * 2.0 - 1.0;
	st.x  *= u_resolution.x/u_resolution.y; 
	vec3 cameraPos = vec3(0.0, 0.0, -10.0);
	vec3 cameraDir = vec3(st.x, st.y, 1.0);
	float rayMarch = tracing(cameraPos, cameraDir);
	vec3 color = vec3(rayMarch);
	gl_FragColor = vec4(color, 1.0);
}