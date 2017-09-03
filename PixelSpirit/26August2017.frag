/*
Vision
--------------------
Shader-a-day
Darien Brito, August 26, 2017
*/

uniform vec2 u_resolution;

#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define HALF_PI 1.570796326795

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

float raysSDF(vec2 st, int N) {
	st -= .5;
	float phase = 0.2;
	return fract((atan(st.y, st.x) / TWO_PI + phase) * float(N));
}

float stroke(float x, float s, float w) {
	float d = 	step(s, x+w * .5) - 
				step(s, x-w * .5);
	return clamp(d, 0., 1.);
}

float circle(vec2 st, float r){
	return smoothstep(r, r + 0.002, length(st - .5));
}

float oval(vec2 st, float s, float sep) {
	float c1 = 1.0 - circle(st + vec2(sep, 0.0), s);
	float c2 = 1.0 - circle(st + vec2(-sep, 0.0), s);
	return c1 * c2;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

	float c = 0.;
	float outermask = oval(st, 0.4, 0.1);
	float rays = step(0.8, raysSDF(st, 32));
	c = outermask * rays;

	st -= 0.5;
	st *= rotate2d(HALF_PI);
	st += 0.5;
	
	float sizeEye = 0.36;
	float innermask = 1.0 - oval(st, sizeEye, 0.2);
	
	c *= innermask;
	
	float eye = oval(st, sizeEye, 0.2);
	eye *= 1.0 - oval(st, sizeEye - 0.02, 0.2);
	c += eye;

	float sizeIris = 0.15;
	float offset = 0.05;
	float iris = 1.0 - circle(st + vec2(offset,0.), sizeIris);
	iris *= circle(st + vec2(offset, 0.), sizeIris - 0.02);
	iris *= step(0.5, st.x + 0.137);
	c += iris;

	//c *= step(iris,innermask);
	// eye *=  1.0 - oval(st, sizeEye - 0.02);
	



	
	gl_FragColor = vec4(vec3(c), 1.0);
}