/*
Pixel Spirit - The Summit (this was kind of tough to tackle)
--------------------
Shader-a-day
Darien Brito, August 7 2017
*/

#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define HALF_PI 1.570796326795

uniform vec2 u_resolution;

float shape(vec2 st, float numSides, float s, float angle) {
	float a = atan(st.y, st.x) + angle;
	float r = TWO_PI/numSides;
	float d = cos(floor(0.5 + (a/r)) * r - a) * length(st);
	return 1.0 - smoothstep(s, s + 0.001, d);
}

float ellipse(vec2 st, float r) {
	return smoothstep(r, r+0.005, length(st));
} 

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution * 2.0 - 1.;
	float c = ellipse(st, 0.325) * (1.0 - ellipse(st, 0.4));
	float t = shape(st + vec2(0., 0.35), 3., 0.25, PI*.5);
	vec3 color = vec3(c - t);
	float t2 = shape(st + vec2(0., 0.35), 3., 0.2, PI*.5);
	color += t2*2.; // I got this but intuition but... works because numbers are in radians?
	color = clamp(color, 0., 1.);
	gl_FragColor = vec4(color, 1.0);
}
