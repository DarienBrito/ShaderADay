/*
Studying a vec2 version of random
to get smoother noise
From "The book of shaders"
--------------------
Shader-a-day
Darien Brito, 8 April, 2017
*/

uniform float u_time;
uniform vec2 u_resolution;

vec2 random2(vec2 st) {
	vec2 r = vec2(	dot(st, vec2(125.1212, 65.5263)),
					dot(st, vec2(45.65472, 97.4513)));
	return 1.0 - 2.0 * fract(sin(r) * vec2(16231.12112, 531414.123)); //Range from -1.0 to 1.0
}

// Value noise (smoother version)
float noise(vec2 st) {
	vec2 i = floor(st);
	vec2 f = fract(st);
	vec2 h = f * f * (3.0 - 2.0 * f);
	return 	mix(
				mix(dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
					dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), h.x),
				mix(dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
					dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), h.x),
				h.y);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec3 color = vec3(0.0);

	float zoom = 20.0;
	vec2 pos = vec2(st * zoom);
	float n = noise(pos + vec2(0.0, u_time)); // Still in the range of -1.0 to 1.0!
	n = n * 0.5 + 0.5; // So here we correct that!
	n = pow(n, 1.5); // Get a little bit more contrast
	color = vec3(n); 
	gl_FragColor = vec4(color, 1.0);
}