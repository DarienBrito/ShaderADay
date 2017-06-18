/*
Studying a gaussian filter (very expensive)
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


float normpdf(in float x, in float sigma) {
	return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;
}

void main() {
	//declare stuff
		const int mSize = 11;
		const int kSize = (mSize-1)/2;
		float kernel[mSize];
		vec3 final_colour = vec3(0.0);
		
		//create the 1-D kernel
		float sigma = 7.0;
		float Z = 0.0;
		for (int j = 0; j <= kSize; ++j) {
			kernel[kSize+j] = kernel[kSize-j] = normpdf(float(j), sigma);
		}
		
		//get the normalization factor (as the gaussian has been clamped)
		for (int j = 0; j < mSize; ++j)
		{
			Z += kernel[j];
		}
		
		//read out the texels
		for (int i=-kSize; i <= kSize; ++i)
		{
			for (int j=-kSize; j <= kSize; ++j)
			{
				final_colour += kernel[kSize+j]*kernel[kSize+i]*texture2D(u_tex0, (gl_FragCoord.xy+vec2(float(i),float(j))) / u_resolution.xy).rgb;
	
			}
		}
		
		
		gl_FragColor = vec4(final_colour/(Z*Z), 1.0);

}

