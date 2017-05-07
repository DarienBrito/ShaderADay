/*
Still drilling with this... it's so much fun!
--------------------
Shader-a-day
Darien Brito, 13 April, 2017
*/

uniform vec2 u_resolution;
uniform float u_time;

#define TWO_PI 6.28318530718
#define INVERT 1

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// Value Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float gradientNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st.x *= u_resolution.x/u_resolution.y;
	vec3 color = vec3(0.0);

	 st -= 0.5;
	// st *= rotate2d(sin(TWO_PI + (u_time * 0.1)));
	 st += 0.5;

	//Scale grid to n cells
	st *= 20.0;

	float a = atan(st.y, st.x);
	float v = sin(a * 2.0 + u_time);

	//Get coordinates
	vec2 i = floor(st);
	vec2 f = fract(st);
	
	float m_dist = 10.0; // The minimum boundary for distance between cells
	vec2 m_point; //Minimum point

	for(int y = -1; y <= 1; y++) { //Check left and right neighbors
		for(int x = -1; x <= 1; x++){ //Check up and bottom neighbours
			vec2 neighbour = vec2(float(x), float(y));
			vec2 p = random2(i + neighbour); // Generate random position
	//		p = 0.5 + 0.5 * sin(p*TWO_PI + ((cos(u_time) * 40.0 + 40.0) * gradientNoise(st * 0.25))); // Apply some distortion to phase
			p = 0.5 + 0.5 * sin(p*TWO_PI + (80.0 * gradientNoise(st * 0.25))); // Apply some distortion to phase

			vec2 diff = (p + neighbour) - f;
			float dist = length(diff);
			if(dist < m_dist){
				m_dist = dist;
				m_point = p; //Unique identifier for that point
			}
		}
	}

	m_point += v * 0.3;

	// Assign a color using closest point
	//color += dot(m_point, vec2(0.5));
	//color += vec3(m_point, sin(u_time)*.5+.5);

	// Show isolines
    //color -= abs(sin(40.0*m_dist))*0.07;

	//Draw center point
	color += 1.0 - step(0.35, m_dist);

	//Draw grid
	color.r += step(0.98, f.x) + step(0.98, f.y);

	gl_FragColor = vec4(color, 1.0);
}