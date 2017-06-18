/*
Modulating colors from a texture
--------------------
Shader-a-day
Darien Brito, 11 June 2017

NOTE: glslViewer requires that the name of the sampler2D is passed from the terminal
with the command: 

glslViewer 11June2017.frag 1.jpg

for example. Otherwise will compile to a black screen. 

*/


uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;
uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.141592653589

float gaussian(float x) {
	float mean = 0.0;
	float sigma = 1.0; // standard deviation
	float gauss = ((pow(x - mean, 2.0) / (2.0 * pow(sigma, 2.0))) * -1.0) * 
	(1.0 / (sigma * sqrt(2.0 * PI)));
	return gauss;
}

void main() {
    vec2 currentCoord = vec2(gl_FragCoord.x / u_tex0Resolution.x, gl_FragCoord.y / u_tex0Resolution.y);
    vec3 pixel = texture2D(u_tex0, currentCoord).rgb;
    float 
    	r = pixel.r * cos(u_time) * 0.5 + 0.5, 
    	g = pixel.g * sin(u_time) * 0.5 + 0.5, 
    	b = pixel.b * tan(u_time * 0.25)
    ;
    gl_FragColor = vec4(vec3(r,g,b), 1.0);
}