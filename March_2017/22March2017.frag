/*
Some Gaussian fun...
--------------------
Shader-a-day
Darien Brito, 22_mar_2017
*/

#define PI 3.14159265359
uniform vec2 u_resolution;
uniform float u_time;

float gaussian(float x, float mean, float stddev) {
	return 	exp(
		-1.0 * ((pow(x - mean, 2.0) / (2.0 * pow(stddev, 2.0))) *
		(1.0 / (stddev * sqrt(2.0 * PI))))
			);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec2 q = st * 2.0 - 1.0;

	float deviation = 0.2;
	float color = gaussian(st.x, cos(u_time) * 0.5 + 0.5 , deviation);
	color *= gaussian(st.y, sin(u_time) * 0.5 + 0.5, deviation);

	float amp = 0.4;
	float freq = 2.0;
	color +=  amp * cos(atan(q.y, q.x) * freq + u_time);

	gl_FragColor = vec4(vec3(color), 1.0);
}