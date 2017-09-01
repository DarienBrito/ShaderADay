/*
The Devil

--------------------
Shader-a-day
Darien Brito, 21 August, 2017
*/

#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define HALF_PI 1.570796326795

uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

// It was impossible for me to crack down how to make the star!
// so, I had to look... 
float starSDF(vec2 st, int V, float s) {
	st = st * 8. -4.;
	float a = atan(st.y, st.x) / TWO_PI;
	float seg = a * float(V);
	a = ((floor(seg) + 0.5)/float(V) + 
	mix(s, -s, step(.5, fract(seg)))) * TWO_PI;
	return abs(dot(vec2(cos(a), sin(a)), st));
}

// I just learned also this neat trick to create the outlines...
float stroke(float x, float s, float w) {
	float d = 	step(s, x+w * .5) - 
				step(s, x-w * .5);
	return clamp(d, 0., 1.);
}

float circle(vec2 st) {
	return length(st - 0.5);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st -= 0.5;
	st *= rotate2d(PI);
	st += 0.5;

	float circle = circle(st);
	float c = stroke(circle, .3, .02);

	float blackStar = starSDF(st.yx, 5, 0.1);
	c *= step(0.9, blackStar);

	float star = starSDF(st.yx, 5, 0.1);
	float s = 1.0 - step(0.5, star);
	s = stroke(star, .5, .1);

	vec3 color = vec3(c + s);
	gl_FragColor = vec4(vec3(color), 1.0);
}