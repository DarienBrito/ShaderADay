uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.141592653589

vec2 rotation(vec2 st, float a){
	st -= 0.5;
	st *= mat2(cos(a), -sin(a), sin(a), cos(a));
	st += 0.5;
	return st;
}

vec2 tilePattern(vec2 st) {
	st *= 2.0; 
	float index = 0.;
	index += step(1., mod(st.x, 2.)); // 0, 1
	index += step(1., mod(st.y, 2.)) * 2.0; // 2, 3

	float evenOdd = step(1.0, mod(st.x, 2.0));
	float m = (evenOdd > 0.) ? 1. : -1.;
	//st.y += 0.25 + u_time*m*0.4;
	st.x += 0.25 + u_time*0.5 * m;

	st = fract(st);

	if(index == 1.) {
		st = rotation(st, PI * -0.5);
	} else if(index == 2.) {
		st = rotation(st, PI * 0.5);
	} else if(index == 3.) {
		st = rotation(st, PI * 1.);
	}
	return st;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	st = fract(st * 5.0);
	st = tilePattern(st);
	vec3 color = vec3(smoothstep(st.x, st.x + 0.1, sin(st.y)));
	gl_FragColor = vec4(color, 1.0);
}

