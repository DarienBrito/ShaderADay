/*
More FBM stuff, after Iñigo Quilez's article
on Domain warping from 2 fucking thousand and 2!
http://www.iquilezles.org/www/articles/warp/warp.htm

On this one I'm applying the second warping on top of
yesterday's code (if that wasn't fun enough)
--------------------
Shader-a-day
Darien Brito, 20 April, 2017
*/	

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.141592653589
#define TWO_PI 6.28318530718
#define OCTAVES 4
#define PATTERN 3
#define GAIN 5.0

// Some useful functionscolor = mix(vec3(0.1, 0.0, 0.0), vec3(0.8, 0.88, 0.6), color);
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

// Now let's make some FBM funcs with that nice simplex noise

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
	for(int i = 0; i < OCTAVES; i++){
		n += abs(snoise(st)) * a; // Get the abs value of signed noise!
		st *= 2.0;
		a *= 0.5;
	}
	return n;
}

// A simple version of ridge (not multifractal):
float ridge(vec2 st) {
    float n = 0.0;
    float a = 1.0;
    float offset = 1.0;
    for(int i = 0; i < OCTAVES; i++){
        n += abs(snoise(st)) * a; 
        st *= 2.0;
        a *= 0.5;
    }
    n = abs(n);
    n = offset - n;
    n *= n; // faster than pow?
    return n;       
}

///////////////////////////////////////////////////////
// A set of Warping functions of second degree
// This one has an extra level of warping that comes
// from using a double set of vec2 fbms to transform P
///////////////////////////////////////////////////////

float warpingFBM(in vec2 p, float scale) {
    vec2 q = vec2(  fbm(p + vec2(0.0)),
        // This displacement (arbitrary numbers) is done to avoid 
        // using the same random numbers generated by the simplex noise
                    fbm(p + vec2(5.2,1.3))); 
    vec2 r = vec2(  fbm(p + scale * q + vec2(0.51, 1.245)),
                    fbm(p + scale * q + vec2(2.15, 3.515))
                    );
    return fbm(p + (scale * r));
}

float warpingTurbulence(in vec2 p, float scale) {
    vec2 q = vec2(  turbulence(p + vec2(0.0)),
                    turbulence(p + vec2(5.2,1.3))); 
    vec2 r = vec2(  turbulence(p + scale * q + vec2(0.0)),
                    turbulence(p + scale * q + vec2(5.2,1.3))); 
    return turbulence(p + (scale * r));
}

float warpingRidge(in vec2 p, float scale) {
        vec2 q = vec2(  ridge(p + vec2(0.0)),
                        ridge(p + vec2(5.2,1.3))); 
        vec2 r = vec2(  ridge(p + scale * q + vec2(0.0)),
                        ridge(p + scale * q + vec2(5.2,1.3))); 
    return ridge(p + (scale * r));
}

float warpingHybrid(in vec2 p, float scale) {
    float speed = 0.005;
    vec2 q = vec2(  turbulence(p + vec2(0.0)),
                    turbulence(p + vec2(5.2 + cos(u_time * speed), 1.3 + sin(u_time * speed))));
    vec2 r = vec2(  turbulence(p + scale * q + vec2(0.0)),
                    turbulence(p + scale * q + vec2(5.2 + cos(u_time * speed * 2.0), 1.3 + sin(u_time * speed * 2.0)))); 
    return fbm(p + (scale * r));
}

float warpingHybrid2(in vec2 p, float scale) {
    float speed = 0.005;
    vec2 q = vec2(  ridge(p + vec2(0.0)),
                    ridge(p + vec2(5.2 + cos(u_time * speed), 1.3 + sin(u_time * speed)))); 
    vec2 r = vec2(  ridge(p + scale * q + vec2(0.0)),
                    ridge(p + scale * q + vec2(5.2 + cos(u_time * speed), 1.3 + sin(u_time * speed)))); 
    return fbm(p + (scale * r));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    st.x *= u_resolution.x/u_resolution.y;
    float c = 0.0;
    float scale = 2.0;

    if(PATTERN == 0) {
    	c = warpingFBM(st, scale);
    } else if (PATTERN == 1) {
        c = warpingTurbulence(st, scale);
    } else if (PATTERN == 2) {
        c = warpingRidge(st, scale);
    } else if (PATTERN == 3) {
        c = warpingHybrid(st, scale);
    } else if (PATTERN == 4) {
        c = warpingHybrid2(st, scale);
    } else {
        c = 1.0;
    }

    vec3 color = vec3(c);
	color = mix(vec3(0.08, 0.0, 0.0), vec3(0.8, 0.8, 0.6), color);
    color *= mix(vec3(0.0, 0.4, 0.62), vec3(0.8, 0.5, 1.0), color);
    color *= GAIN;
	gl_FragColor = vec4(color, 1.0);
}

// This is interesting, picking data from within the function out to use for colors!
  // float pattern( in vec2 p, out vec2 q, out vec2 r )
  // {
  //     q.x = fbm( p + vec2(0.0,0.0) );
  //     q.y = fbm( p + vec2(5.2,1.3) );

  //     r.x = fbm( p + 4.0*q + vec2(1.7,9.2) );
  //     r.y = fbm( p + 4.0*q + vec2(8.3,2.8) );

  //     return fbm( p + 4.0*r );
  // }
