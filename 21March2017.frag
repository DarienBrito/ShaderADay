// The book of shaders, shapes
// Sublime tip: ctlr + cmd + g highlights all variables of same name

uniform vec2 u_resolution;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	
	float margin = 0.3;

	// Left side
	vec2 le = step(vec2(margin), st);
	float c = le.x * le.y;

	// Right side
	vec2 ri = step(vec2(margin), 1.0 - st);
	c*= ri.x * ri.y;

	gl_FragColor = vec4(vec3(c), 1.0);
}