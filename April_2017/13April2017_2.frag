/*
Studying cellular noise 
From "The Book of Shaders"
--------------------
Shader-a-day
Darien Brito, 13 April, 2017
*/

uniform vec2 u_resolution;
uniform float u_time;

#define TWO_PI 6.28318530718
#define INVERT 0

vec2 random2(vec2 p) {
	return fract(sin(vec2(
		dot(p, vec2(12.15125, 431.15155)),
		dot(p, vec2(32.52513, 44.124151))
		)) * 12412.57123);
}

float random(float x) {
	return fract(sin(x) * 1e4);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st.x *= u_resolution.x/u_resolution.y;
	vec3 color = vec3(0.0);

	//Scale grid to n cells
	st *= 10.0;

	//Get coordinates
	vec2 i = floor(st);
	vec2 f = fract(st);
	float m_dist = 1.0; // The minimum boundary for distance between cells

	/*
	We need to check the distances to the points in the surrounding tiles, not 
	just the one in the current tile. For that we need to iterate through the neighbor tiles. 
	That means from -1 (left) to 1 (right) tile in x axis and -1 (bottom) to 1 (top) in y axis. 
	A 3x3 region of 9 tiles can be iterated through using a double for loop like this one:
	*/

	for(int y = -1; y <= 1; y++) { //Check left and right neighbors
		for(int x = -1; x <= 1; x++){ //Check up and bottom neighbours
			
			vec2 neighbour = vec2(float(x), float(y));
			// Now, we can compute the position of the points on each one of the 
			// neighbors in our double for loop by adding the neighbor tile offset 
			// to the current tile coordinate.
			vec2 p = random2(i + neighbour); // Generate random position
			p += sin(u_time + TWO_PI * p) * 0.25 + 0.25; // add some movement to the points
	
			vec2 diff = p + neighbour - f;
			float dist = length(diff);
			// Keep the closer distance
			//m_dist = min(m_dist, dist);
			m_dist = (dist > m_dist) ? m_dist : dist; // another way, same result
		}
	}

	//Draw center point
	m_dist += 1.0 - step(0.01, m_dist);

	//Draw concentric boundaries
//	m_dist = sin(m_dist * 30.0 - u_time * 4.0);

	if(INVERT < 1) {
		color += vec3(m_dist);
	} else {
		color += 1.0 - vec3(m_dist);
	}
	gl_FragColor = vec4(color, 1.0);
}