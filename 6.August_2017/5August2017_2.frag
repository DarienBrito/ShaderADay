/*
PixelSpirit - The hanged man
--------------------
Shader-a-day
Darien Brito, August 5 2017
*/

uniform vec2 u_resolution;

mat2 rotate2d(float a) {
	return mat2(
			cos(a), -sin(a),
			sin(a), cos(a)
		);
}

float diagonal(vec2 st, float d){
	float color = 1.0 - smoothstep(d, d+0.001, st.y - st.x);
	color -= 1.0 - smoothstep(-d, -d+0.001, st.y - st.x);
	return color;
}


void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float color = diagonal(st, 0.05);
	color += diagonal((st - 0.5) * rotate2d(radians(90.)), 0.05);
	gl_FragColor = vec4(vec3(color), 1.0);
}

