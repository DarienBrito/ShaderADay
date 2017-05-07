/*
simple-doodle
--------------------
Shader-a-day
Darien Brito, 2 may 2017
*/

uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate2d(float x) {
	return mat2(cos(x), -sin(x),
				sin(x), cos(x));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st -= 0.5;
	st *= 4.0;

	st *= rotate2d(st.x + u_time);
	st *= rotate2d(st.y);

	float tiles = 5.0;
	float freq = 2.0;
	float f = fract(sin(st.x * tiles+ u_time) * cos(st.y * tiles + u_time) * freq);
	f = smoothstep(0.001, 0.999, f);
	f *= f * f;

	vec3 color = vec3(f);
	gl_FragColor = vec4(color, 1.0);

}