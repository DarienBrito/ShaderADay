// distance fields
uniform vec2 u_resolution;
uniform float u_time;

// Generate random points
vec2 random2(vec2 p) {
	return fract(sin(vec2(
		dot(p, vec2(121.1314, 43.3123)), 
		dot(p, vec2(44.1451, 12.1314)) 
		)) * 12531.55);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec3 color = vec3(0.0);
	bool GUIDES = true; // Select to select guides or not

	// Scale coordinate system
	st *= 10.0;

	// Get indexes
	vec2 i = floor(st);
	vec2 f = fract(st);

	// Get distance
	vec2 point = random2(i); // A random point withing the specified cell
	vec2 diff = point - f; // Get the difference to current cell 
	float dist = length(diff); //Calculate the distance

	// Draw gradients
	color += dist;

	if(GUIDES) {
		// Draw point centres
		color += 1.0 - step(0.01, dist);
		// Draw grid
		color.r += step(0.98, f.x);
		color.r += step(0.98, f.y);
	}

	gl_FragColor = vec4(color, 1.0);
}