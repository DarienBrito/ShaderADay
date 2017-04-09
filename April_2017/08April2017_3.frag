/*
Using rotation to draw a pattern
with lines
From "The Book of Shaders"
--------------------
Shader-a-day
Darien Brito, 8 April, 2017
*/

uniform vec2 u_resolution;
uniform float u_time;

float random (in vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233))) 
                * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( random( i + vec2(0.0,0.0) ), 
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ), 
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

mat2 rotate2d(float angle) {
	return mat2(cos(angle), -sin(angle),
				sin(angle), cos(angle));
}

float lines(in vec2 pos, float b){
    float scale = 10.0;
    pos *= scale;
    return smoothstep(0.0,
                    .5+b*.5,
                    abs((sin(pos.x*3.1415) + b *2.0))*.5);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

	vec2 pos = st * vec2(5.0, 4.5);
	pos = rotate2d(noise(pos)) * pos + u_time * 0.25; // Aha! Using noise as an angle for rotation
	float pattern = lines(pos, 0.5);
	vec3 color = vec3(pattern);
	gl_FragColor = vec4(color, 1.0);
}