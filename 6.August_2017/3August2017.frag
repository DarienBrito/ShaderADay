/*
Simmetries A
--------------------
Shader-a-day
Darien Brito, August 3 2017
*/

uniform vec2 u_resolution;
uniform float u_time;

mat2 rota2d(float a){
	return mat2(
			cos(a), -sin(a),
			sin(a), cos(a)
		);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution; 
	st.x = (st.x > 0.5) ? 1.0 - st.x : st.x;
	st.y = (st.y > 0.5) ? 1.0 - st.y : st.y;
	st *= rota2d(u_time * 0.01);
	float a = atan(st.y, st.x);
	float c = length(st - vec2(0.5)) * 2.;
	float f = 10.0;
	float v = sin(c * a * f + u_time);
	vec3 color = smoothstep(0.4, 0.59, vec3(v + 0.9 * abs(sin(u_time)) ));
	gl_FragColor = vec4(color, 1.0);
}