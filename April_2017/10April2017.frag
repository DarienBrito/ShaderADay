// Circular texture

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.141592653589

vec2 random(vec2 st) {
	vec2 r = fract(sin(vec2(dot(st, vec2(12.1414,123.1123)), dot(st, vec2(11.513, 312.311)))) * 28123.8); 
	return r * 2.0 - 1.0; // -1.0 to 1.0 range
}

float noise(vec2 st) {
	vec2 i = floor(st);
	vec2 f = fract(st);

	vec2 h = f*f*(3.0 - 2.0 * f);
	return mix(
			mix( dot(random(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
				 dot(random(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), h.x),
			mix( dot(random(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
				 dot(random(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), h.x),
			h.y
	);
}

mat2 rotate2D(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st -= 0.5;
	float n = noise(st * 20.0);
	float r = length(st);
	st *= rotate2D(n + (u_time * 0.05));
	//st += 0.5;

	float q = noise(st * 20.0);
	float a = atan(st.y, st.x);
	float sides = 120.0;
	float speed = 1.1;
	q += 0.1 * sin(a * sides + (u_time * speed));
	q += 0.5;

	float radius = 0.3;
	r = 1.0 - smoothstep(radius, radius + 0.2, r);

	q *= r;

	vec3 color = vec3(q);
	gl_FragColor = vec4(color, 1.0);
}