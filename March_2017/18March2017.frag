/*

Excercise from The book of Shaders

*/

uniform vec2 u_resolution;
uniform float u_time;
#define PI 3.14159265359
#define TWOPI 6.28318530718

//  Function from Iñigo Quiles 
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb(vec3 c) {
	vec3 rgb = clamp(
		abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 
		0.0, 
		1.0);
	rgb = rgb * rgb * (3.0 - (2.0 * rgb));
	return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec3 color = vec3(0.0);

	vec2 toCenter = vec2(0.5) - st; // move to range of -0.5 to 0.5
	float angle = atan(toCenter.y, toCenter.x); //returns in rang -3.14 - 3.14
	float radius = length(toCenter) * 2.0; // 0.5 * 2 = 1
	//Length calculates the length of the vector
	
	// A equivalent approach to get radius would be:
	float r = distance(vec2(st), vec2(0.5)) * 2.0;


	//color = vec3((angle/TWOPI) + 0.5, radius, 1.0);
	color = vec3((angle/TWOPI) + (u_time * 0.25), r, 1.0);
	color = hsb2rgb(color);

	gl_FragColor = vec4(vec3(color), 1.0);
}
