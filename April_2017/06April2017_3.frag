/*
Exploring smooth noise (1D, 1axis)
--------------------
Shader-a-day
Darien Brito, 6 April, 2017
*/

uniform float u_time;
uniform vec2 u_resolution;

float random(float x){
	return fract(sin(x) * 1e4);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float grid = 30.0;

	float iIndex = floor(st.x * grid);
	float fIndex = fract(st.x * grid);

	float v;

	// Linear interpolation
	//v = mix(random(iIndex), random(iIndex + 1.0), fIndex);
	// Smoother interpolation
	v = mix(random(iIndex), random(iIndex + 1.0), smoothstep(0.0, 1.0, fIndex));

	float color = v;

	gl_FragColor = vec4(vec3(color), 1.0);
}