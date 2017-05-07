/*
Combining Shapes
From "The Book of Shaders"
--------------------
Shader-a-day
Darien Brito, 24 March 2017
*/

uniform vec2 u_resolution;
uniform float u_time;

#define HALFPI 1.570796326795
#define PI 3.14159265359
#define TWOPI 6.28318530718

float shape(vec2 st, int numSides) {
	float a = atan(st.y, st.x) + HALFPI;
	float r = TWOPI/float(numSides);
	float d = cos(floor(0.5 + (a/r)) * r - a) * length(st);
	return 1.0 - smoothstep(0.4, 0.41, d);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st = st * 2.0 - 1.0; //Rmap to -1. to 1 (to be able to use angles in radians)
	float theShape = shape(st, 6);
	vec3 color = vec3(theShape);
	gl_FragColor = vec4(color, 1.0);
}
