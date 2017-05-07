/*
FBM stuff (kind of marble???)
--------------------
Shader-a-day
Darien Brito, 18 April, 2017
*/	

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define OCTAVES 5

// Some useful functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

//
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : 
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
// 
float snoise(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  
                        // -1.0 + 2.0 * C.x
                        0.024390243902439); 
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0), 
                        dot(x1,x1), 
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients: 
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple 
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.792842914001259 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

float fbm(vec2 st) {
	float n = 0.0;
	float a = 0.55;
	for(int i = 0; i < OCTAVES; i++) {
		n += snoise(st) * a;
		st *= 2.0;
		a *= 0.5;
	}
	return n;
}

float turbulence(vec2 st) {
	float n = 0.0;
	float a = 0.5;
    float increment = 0.1;
	for(int i = 0; i < OCTAVES; i++){
		n += abs(snoise(st)) * a; // Get the abs value of signed noise!
		st *= 2.0;
		a *= 0.5;
	}
	return n;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    st.x *= u_resolution.x/u_resolution.y;
	st -= 0.5; // Move to center
	float gridScale = 3.0;
	float modulationScale = 3.0;
    vec2 motion = vec2(u_time * 0.2, 0.0);
	vec3 color = vec3(fbm(st * (fbm((st + motion) * modulationScale) * gridScale)));
	color = mix(vec3(0.01, 0.2, 0.1), vec3(0.76, 0.88, 0.9), color);
	color = mix(color, vec3(0.9, 0.4, 0.1), length(st));
    color = 1.0 - color;
    color *= color;
	gl_FragColor = vec4(color, 1.0);
}