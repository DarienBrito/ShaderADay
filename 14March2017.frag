uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.141592

// Black and white pattern

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float color = step(0.5 * (sin(u_time * 10.0) * 0.5 + 0.5), sin(st.x * PI * 20.0 + u_time * 10.0));
	gl_FragColor = vec4(vec3(color), 1.0);
}