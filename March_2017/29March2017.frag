/*
Polar shapes
--------------------
Shader-a-day
Darien Brito, 24 March 2017
*/

#define PI 3.14159265359
uniform vec2 u_resolution;
uniform float u_time;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec2 stCenter = st - vec2(0.5, 0.5);

	float d = 3.0;  //distance field multiplier
	float q = pow(length(st - vec2(0.5)) * d, 6.0);
	float a = atan(stCenter.y, stCenter.x);
	q += sin(a * 4.0 + u_time) * 0.5;
 	q = abs(cos(q - u_time));
 //	q *= cos(a * 3.0 - (u_time  * 2.0));
	q = smoothstep(0.25, 0.75, q);
	gl_FragColor = vec4(vec3(q), 1.0);
}