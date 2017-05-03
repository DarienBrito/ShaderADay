/*-------------------------------------
Inigo Quilez's functions
Shaping Functions

http://www.iquilezles.org/www/articles/functions/functions.htm
--------------------------------------*/

uniform vec2 u_resolution;
uniform float u_time;

// Plotter
float plotter(vec2 st, float x) {
	return 	smoothstep(x - 0.01, x, st.y) -
			smoothstep(x, x + 0.01, st.y);
}

float almostIdentity( float x, float m, float n )
{
    if( x>m ) { return x; } 
    else {

     float a = 2.0 * n - m;
     float b = 2.0 * m - 3.0 * n;
     float t = x/m;
 }

    return (a*t + b)*t*t + n;
}

float impulse( float k, float x )
{
    const float h = k*x;
    return h*expf(1.0-h);
}


float cubicPulse( float c, float w, float x )
{
    x = fabsf(x - c);
    if( x>w ) return 0.0;
    x /= w;
    return 1.0 - x*x*(3.0-2.0*x);
}


float expStep( float x, float k, float n )
{
    return expf( -k*powf(x,n) );
}


float parabola( float x, float k )
{
    return powf( 4.0*x*(1.0-x), k );
}


float pcurve( float x, float a, float b )
{
    float k = powf(a+b,a+b) / (pow(a,a)*pow(b,b));
    return k * powf( x, a ) * powf( 1.0-x, b );
}


void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	float color = st.x;
	gl_FragColor = vec4(vec3(color), 1.0);
}