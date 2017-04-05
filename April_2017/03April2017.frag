uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.14159265359

float circle(in vec2 st, float scale) {
	return smoothstep(scale, scale+0.005, 
			1.0 - length(st - vec2(0.5)));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

	st += vec2(0.0, -0.2);

	float c = circle(st, 0.8);
	float c2 = circle(st - vec2(0.19, -0.34), 0.8);
	float c3 = circle(st - vec2(-0.19, -0.34), 0.8);

	vec3 color = vec3(c + c2 + c3);
	gl_FragColor = vec4(color, 1.0);
}