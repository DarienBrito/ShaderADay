/*
Exploring smooth noise (1D, 2axis)
--------------------
Shader-a-day
Darien Brito, 6 April, 2017
*/

uniform float u_time;
uniform vec2 u_resolution;

float random(float x){
	return fract(sin(x) * 1e4);
}

float random(vec2 st){
	return fract(sin(dot(st, vec2(12.1415, 23.1414))) * 1e3);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float grid = 30.0;

	vec2 iIndex = floor(st * grid);
	vec2 fIndex = fract(st * grid);

	float v;
	// Linear interpolation
	v = mix(random(iIndex), random(iIndex + 1.0), fIndex.x * fIndex.y);
	// Smoother interpolation
	v = mix(random(iIndex), random(iIndex + 1.0), smoothstep(0., 1., fIndex.x * fIndex.y));

	float color = v;
	gl_FragColor = vec4(vec3(color), 1.0);
}