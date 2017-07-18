/*
Re-cap, tiling 
--------------------
Shader-a-day
Darien Brito, July 2017
*/

uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate2d(float a) {
	return mat2(cos(a), -sin(a),
				sin(a), cos(a));
}


vec2 tile(vec2 st, float s) {
	return fract(st * s);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st -= 0.5;

	st *= rotate2d(u_time * -0.1); //counter clockwise

	vec2 zoom = tile(st, 3.0);
	float x = step(0.5, zoom.x);
	float y = step(0.5, zoom.y);

	st *= rotate2d(u_time * 0.2); //clockwise

	float l = length(st);
	float a = atan(st.y, st.x);
	float f = sin(4.0); 
	float c = x + y + f;
	vec3 color = vec3(c);
	color += 0.5 * sin(a * 40.);

	color *= sin(color * 2.0);	
	gl_FragColor = vec4(color, 1.0);
}