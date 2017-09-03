/*
Holding Together
--------------------
Shader-a-day
Darien Brito, August 30, 2017

Did not like this one too much,
because the result had to be fine tuned 
and was time consuming just to look for 
the right parameters. Boring.
*/

uniform vec2 u_resolution;
#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define HALF_PI 1.570796326795

float rect(vec2 st, vec2 size) {
	// This requires a normalized bipolar mapping of the coordinat system
	// i.e st *2. -1. or -0.5;
	return max(abs(st.x/size.x), abs(st.y/size.y));
}

vec2 rotate2d(vec2 st, float angle) {
	return st * mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

float stroke(float x, float s, float w) {
	float d = 	smoothstep(s, s+0.001, x+w * .5) - 
				smoothstep(s, s+0.001, x-w * .5);
	return clamp(d, 0., 1.);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec2 off = vec2(0.08, 0.);

	st.x = mix(1.-st.x, st.x, step(0.5, st.y));

	float s1 = rect(rotate2d((st - 0.5) + off, PI * 0.25), vec2(0.25));
	float s2 = rect(rotate2d((st - 0.5) - off, PI * 0.25), vec2(0.25));
	float color = 0.;
	float size = 0.45; // This one needs to be fine tuned!
	float bold = 0.3;

	color += stroke(s1, size, bold);
	color *= 1. - stroke(s2, size, bold * 2.);
	color += stroke(s2, size, bold);

	gl_FragColor = vec4(vec3(color), 1.0);
}