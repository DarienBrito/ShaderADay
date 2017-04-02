/*
Checking even-odds to get positions
--------------------
Shader-a-day
Darien Brito, 31 March 2017
*/

#define PI 3.14159235659
uniform vec2 u_resolution;
uniform float u_time;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st *= 7.0; // 7x7 matrix
	vec2 check = mod(st, vec2(2.0)); // Will return 0 or 1
	check = step(1.0, check); // 0 if odd 1 if even
	st = fract(st);
	float d = length(st - vec2(0.5));
	d = sin(d * PI + (u_time * (check.x + 1.0))) * 0.5 + 0.5;
	d = cos(d * PI + (u_time * (check.y + 1.0)));

	gl_FragColor = vec4(vec3(d), 1.0);
}