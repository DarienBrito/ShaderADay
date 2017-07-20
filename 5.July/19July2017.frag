/*
Patterns 
--------------------
Shader-a-day
Darien Brito, July 19, 2017
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec2 tile(vec2 st, float s) {
	st *= s; // appy scaling
	float oddEven = step(1., mod(st.y, 2.)); // Find wether is odd or even
	float dir = (oddEven > 0.) ? 1. : -1.; 
	st.x += oddEven * 0.25 + u_time * 0.25 * dir; // move it accordingly 
	//st.x += oddEven * 0.25; // an offset of n 
	return fract(st);
}

float shape(vec2 st, float s, float n){
	st -= 0.5;
	float l = length(st);
	float a = atan(st.y, st.x);
	float f = 0.03 * sin(a * n);
	return smoothstep(s, s + 0.01, l + f);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st = tile(st, 12.0);
	float c = shape(st, 0.3, 24.0);
	c *= smoothstep(0.55, 0.45, length(st - 0.5));
	vec3 color = vec3(c);
	gl_FragColor = vec4(color, 1.0);

}