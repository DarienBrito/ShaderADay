/*
YUV Color
From "The book of shaders"
--------------------
Shader-a-day
Darien Brito, 27, March, 2017
*/

uniform float u_time;
uniform vec2 u_resolution;

mat3 yuv2rgb = mat3(1.0, 0.0, 1.13983,
					1.0, -0.39465, -0.58060,
					1.0, 2.03211, 0.0);

mat3 rgb2yuv = mat3(0.2126, 0.7152, 0.0722,
					-0.09991, -0.33609, 0.43600,
					0.615, -0.5586, -0.05639);

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	// Transform to -1.0, 1.0 range
	st  = st * 2.0 - 1.0;
	vec3 color = vec3(0.0);

	color = yuv2rgb * vec3(0.5, st.x, st.y);

	gl_FragColor = vec4(color, 1.0);
}