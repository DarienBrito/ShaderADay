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

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st = st * 2.0 - 1.0; //Rmap to -1. to 1 (to be able to use angles in radians)
	int numSides = 3;
	float d;

	// Angle and radius from current pixel
	float a = atan(st.y, st.x) + HALFPI;
	float r = TWOPI/float(numSides);

	// Shaping function that modulates the distance
	d = cos(floor(0.5 + (a/r)) * r - a) * length(st);
	vec3 color = vec3(1.0 - smoothstep(0.4, 0.41, d));
	gl_FragColor = vec4(color, 1.0);
}