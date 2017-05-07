/*
Distance-fields re-cap
--------------------
Shader-a-day
Darien Brito, 13 April, 2017
*/

uniform vec2 u_resolution;
uniform float u_time;

vec2 random2(vec2 p) {
	return fract(sin(vec2(
		dot(p, vec2(12.15125, 431.15155)),
		dot(p, vec2(32.52513, 44.124151))
		)) * 12412.57123);
}

float random(float x) {
	return fract(sin(x) * 1e4);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec3 color = vec3(0.0);

	//Scale grid to n cells
	st *= 3.0;

	//Get coordinates
	vec2 i = floor(st);
	vec2 f = fract(st);

	//Calculate points and distances
	vec2 p = random2(i);
	vec2 t = vec2(cos(u_time * random(i.x)) * 0.25, sin(u_time * random(i.y)) * 0.25);
	vec2 diff = p - (f + t);
	float dist = length(diff);

	//Draw center point
	dist += step(0.05, dist);

	//Draw concentric boundaries
	dist = sin(dist * 30.0 - u_time * 4.0);

	color = vec3(dist);
	gl_FragColor = vec4(color, 1.0);
}