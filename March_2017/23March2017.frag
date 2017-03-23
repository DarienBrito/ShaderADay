/*
Rectangles
--------------------
Shader-a-day
Darien Brito, 23_mar_2017
*/

uniform float u_time;
uniform vec2 u_resolution;

// One method to create a rectangle with smooth edges...
float rectSmooth(vec2 st, vec2 dim, vec2 p, float s) {
	vec2 q = st - p;
	// Left side
	vec2 ls = smoothstep(vec2(dim.x, dim.y), vec2(dim.x +s, dim.y + s), q);
	float l = ls.x * ls.y;

	vec2 rs = smoothstep(vec2(dim.x, dim.y), vec2(dim.x +s, dim.y + s), 1.0 - q);
	float r = rs.x * rs.y;
	return l * r;
}

// Another method for one with hard edges
float rectHard(vec2 st, vec2 dim, vec2 pos) {
	vec2 q = st - pos;
	// left-bottom side
	vec2 lb = step(dim, q); // step pm 2 sides at once
	float l = lb.x * lb.y;
	// right-top side
	vec2 rt = step(dim, 1.0 - q);
	float r = rt.x * rt.y;
	// Combined
	return l * r;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	// st, dim, pos, detail
	//float color = rectSmooth(st, vec2(0.1, 0.45), vec2(0.0, 0.0), 0.001);
	
	float g = cos(u_time);
	// Rect 1
	float sY = g * 0.05 + 0.45;
	float rect1 = rectHard(st, vec2(0.1,sY), vec2(0.0, 0.25));
	vec3 cRect1  = rect1 * vec3(1.0, 0.0, 0.0); // Red rect
	// Rect 2
	float sX = g * 0.05 + 0.4;
	float rect2 = rectHard(st, vec2(sX,0.4), vec2(0.0, 0.0));
	vec3 cRect2  = rect2 * vec3(1.0, 1.0, 0.0); // Yellow rect
	// Rect 3
	float rect3 = rectHard(st, vec2(0.1,sY), vec2(0.0, -0.25));
	vec3 cRect3  = rect3 * vec3(0.0, 0.0, 1.0); // blue rect

	vec3 c = cRect1 + cRect2 + cRect3;

	gl_FragColor = vec4(c, 1.0);
}