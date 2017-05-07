/*
Studying cellular noise 
From "The Book of Shaders"
Simple Voronoi
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
		dot(p, vec2(122.125, 43.1155)),
		dot(p, vec2(322.513, 11.12451))
		)) * 1e4);
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
	
	float m_dist = 10.0; // The minimum boundary for distance between cells
	vec2 m_point; //Minimum point

	for(int y = -1; y <= 1; y++) { //Check left and right neighbors
		for(int x = -1; x <= 1; x++){ //Check up and bottom neighbours
			vec2 neighbour = vec2(float(x), float(y));
			vec2 p = random2(i + neighbour); // Generate random position
			p = 0.5 + 0.5 * sin(p*TWO_PI + u_time);

			vec2 diff = (p + neighbour) - f;
			float dist = length(diff);
			if(dist < m_dist){
				m_dist = dist;
				m_point = p; //Unique identifier for that point
			}
		}
	}

	// Assign a color using closest point
	color += dot(m_point, vec2(0.5));

	// Show isolines
    color -= abs(sin(40.0*m_dist))*0.07;

	//Draw center point
	color += 1.0 - step(0.02, m_dist);

	//Draw grid
	color.r += step(0.98, f.x) + step(0.98, f.y);

	gl_FragColor = vec4(color, 1.0);
}