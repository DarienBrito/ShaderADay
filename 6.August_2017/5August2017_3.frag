/*
PixelSpirit - The High Priestess
--------------------
Shader-a-day
Darien Brito, August 5 2017
*/

uniform vec2 u_resolution;

float circle(vec2 st, float r) {
	float l = length(st - 0.5);
	float c = smoothstep(r, r + 0.001, l);
	return c;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float r = 0.2;
	vec3 color = 1.0 - vec3(circle(st, r));
	color += circle(st, r + 0.02);
	gl_FragColor = vec4(1.0 - vec3(color), 1.0);
}