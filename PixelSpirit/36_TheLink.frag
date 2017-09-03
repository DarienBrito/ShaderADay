/*
The link
--------------------
Shader-a-day
Darien Brito, August 29 2017
*/

#define PI 3.141592653589
#define HALF_PI 1.570796326795
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;

float rect(vec2 st, vec2 size) {
	// This requires a normalized bipolar mapping of the coordinat system
	// i.e st *2. -1.
	return max(abs(st.x/size.x), abs(st.y/size.y));
}

vec2 rotate2d(vec2 st, float angle) {
	st *= mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
	return st;
}

float stroke(float x, float s, float w) {
	float d = 	smoothstep(s, s+0.001, x+w * .5) - 
				smoothstep(s, s+0.001, x-w * .5);
	return clamp(d, 0., 1.);
}

float shape(vec2 st, int numSides, float s) {
	float a = atan(st.y, st.x) + HALF_PI;
	float r = TWO_PI/float(numSides);
	float d = cos(floor(0.5 + (a/r)) * r - a) * length(st);
	return 1.0 - smoothstep(s-0.001, s, d);
}

float diamond(vec2 st, float s) {
	float d = mix(
		shape((1.-st)-0.5 , 3, s), 
		shape((st-0.5), 3, s), 
		step(0.5, st.y)
		);
	return d;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution; 
	float color = 0.;
	vec2 offset = vec2(0.,0.1);
	float size = 0.4;
	float bold = 0.1;

	// First get the diamonds
	vec2 doff = vec2(0., -0.27);
	float d1 = diamond(st + doff, 0.01);
	float d2 = diamond(st - doff, 0.01);

	// calculate rectangles.. notice that rect() requires a 
	// normalized bipolar mapping of the coordinate system
	float r1 = rect(rotate2d((st*2.-1.) - offset, PI*0.25), vec2(0.5 ,0.5));
	float r2 = rect(rotate2d((st*2.-1.) + offset, PI*0.25), vec2(0.5 ,0.5));
	// first shape
	color += stroke(r1, size, bold);
	// mask
	color *= 1. - stroke(r2, size, bold * 2.);
	// shape2
	color += stroke(r2, size, bold);
	// add diamonds
	color += d1 + d2;

	gl_FragColor = vec4(vec3(color), 1.0);
}
