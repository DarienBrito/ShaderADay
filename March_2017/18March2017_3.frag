// Learning some fbm (fractional brownian nouse)

uniform vec2 u_resolution;
float noise(in vec2 x);

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec2 p = -1.0 + (2.0 * st); // -1 to 1

	float f = noise(1.0 * p);
	vec3 color = vec3(f);

	gl_FragColor = vec4(color, 1.0);
}