/*
Condensing information (1D Noise)
--------------------
Shader-a-day
Darien Brito, 6 April, 2017
*/

uniform float u_time;
uniform vec2 u_resolution;

float random(float x){
	return fract(sin(x) * 1e4);
}

float noise(float x) {
	float iIndex = floor(x);
	float fIndex = fract(x);
	return mix(random(iIndex), random(iIndex+1.0), smoothstep(0., 1.,fIndex));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float color = 1.0;
	float n = noise(u_time);
	gl_FragColor = vec4(vec3(n), 1.0);
}