/*
Animating with noise
--------------------
Shader-a-day
Darien Brito, 6 April, 2017
*/

uniform float u_time;
uniform vec2 u_resolution;

float random(float x){
	return fract(sin(x) * 12000.0);
}

float noise(float x) {
	float iIndex = floor(x);
	float fIndex = fract(x);
	return mix(random(iIndex), random(iIndex+1.0), smoothstep(0., 1.,fIndex));
}

float circle(in vec2 st, float s) {
	return step(s, length(st));
}

float mover(vec2 st, float t, float seed) {
	float mul = random(seed);
	float x = noise(t * mul);
	float y = noise(t * mul + 10.0);
	return circle(st + vec2(x, y), 0.01);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st -= 1.0;
	
	float c = 1.0;
	 for(int i = 0; i < 30; ++i){
	 	c *= mover(st, u_time, random(float(i+1)));
	}

	c = 1.0 - c;

	gl_FragColor = vec4(vec3(c), 1.0);
}