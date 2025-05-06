uniform float time;
uniform float highlightShift;
uniform vec4 quaternion;
uniform sampler2D characterTexture;

varying vec3 vUv;

const float maxY = 0.475;
const float maxX = 0.475*.7;
const float pi = 3.1415926535;

// hue ranging from 0. to 1.
vec3 hueToRGB(float hue) {
    hue *= 6.;
    float r = max(0., min(1., abs(hue-3.)-1.));
    float g = max(0., min(1., 2.-abs(hue-2.)));
    float b = max(0., min(1., 2.-abs(hue-4.)));
    return vec3(r, g, b);
}

vec2 rotate2d(vec2 src, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c) * src;
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float perlin(vec2 uv) {
    vec2 i = floor(uv);
    vec2 f = fract(uv);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = smoothstep(0.,1.,f);

    return mix(a, b, u.x) +
    (c - a)* u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

// recursive Perlin noise
float recPerlin(vec2 uv, int iter) {
    float ret = 0.;
    float coeff = 1.;
    while (iter --> 0) {
        ret += perlin(uv);
        coeff *= 0.5;
        uv *= 2.;
    }
    return ret;
}

// Value noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(random(i + vec2(0., 0.)),
            random(i + vec2(1., 0.)), u.x),
        mix(random(i + vec2(0., 1.)),
            random(i + vec2(1., 1.)), u.x), u.y);
}

float lines(in vec2 pos, float b) {
    float scale = .3;
    pos *= scale;
    return smoothstep(0.,
        .5+b*.5,
        abs((sin(pi*pos.x)+b*2.))*.5);
}

float woodPattern(vec2 uv) {
    vec2 pos = uv.yx*vec2(10., 3.);
    pos = rotate2d(pos, noise(pos));
    return lines(pos, .1);
}

float pulse(float dist) {
    float w = 0.2;
    return smoothstep(-w, 0., dist) * (1.-smoothstep(0., w, dist));
}

vec3 color(vec2 uv) {
    uv = 5.*uv+cos(highlightShift*pi);
    return hueToRGB(perlin(uv));
}

vec3 highlight(vec2 uv) {
    float vertexHeight = woodPattern(3.*uv);
    float lightedHeight = 0.5 + 0.35*cos(highlightShift*pi);   
    float intensity = pulse(vertexHeight-lightedHeight);
    return intensity*color(uv);
}

vec2 distort(vec2 uv) {
    uv *= .5;
    vec2 uv2 = vec2(0.);
    for(int i=0; i < 5; i++) {
        uv2 += uv + cos(length(uv));
        uv  += 0.5*cos(0.5*uv2);
        uv  += sin(uv.x - uv.y) - cos(uv.x + uv.y);
    }
    return uv;
}

bool isCorner() {
    float radius = (0.5-maxY)*(0.5*0.71-maxX);
    float absX = abs(vUv.x);
    float absY = abs(vUv.y);
    return absX>maxX && absY>maxY && pow(absY-maxY, 2.) + pow(absX-maxX, 2.) > radius;
}

bool isEdge() {
    return abs(vUv.y) > maxY || abs(vUv.x) > maxX;
}

void main() {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = vUv.xy;
    uv = rotate2d(uv, 0.76);

    vec2 texPos = vUv.xy*1.5+vec2(0.5);
    vec2 texShift = -vec2(quaternion.y, -quaternion.x)*0.25;
    vec4 texPixel = texture2D(characterTexture, texPos + texShift);

    if (isCorner()) {
        gl_FragColor = vec4(0.);
    } else if (isEdge()) {
        float r = recPerlin(20.*vUv.xy, 6)/4.;
        float g = recPerlin(30.*vUv.xy, 6)/4.;
        float b = recPerlin(45.*vUv.xy, 6)/4.;
        vec3 color = vec3(r, g, b);
        float posMod = .7 + .2*cos(10.*(uv.x+uv.y));
        float shiftMod = .7 + .2*cos(3.*highlightShift);
        gl_FragColor = vec4(color*posMod*shiftMod, 1.);
    } else if (texPixel.w > 0.5) {
        // draw texture
        gl_FragColor = texPixel + 0.1*vec4(highlight(uv+texShift),0.1);

        // replace black with golden color
        if (length(texPixel.xyz) < 1.) {
            float posMod = (0.7+0.3*cos(10.*(uv.x+uv.y)));
            float shiftMod = (0.6+0.4*cos(3.*highlightShift));
            gl_FragColor = vec4(1.,0.84,0.,1.)*posMod*shiftMod;
        }
    } else {
        // add background
        uv -= rotate2d(texShift, 0.76);
        vec2 uv2 = uv*20.;
        float bg = .6;
        vec3 col1 = vec3(1., 0., 1.);
        vec3 col2 = vec3(0., 1., 1.);
        vec3 background = vec3(0.5);
        for (int i=0; i<8; i++) {
            background += bg*vec3(perlin(uv2)-0.2);
            bg *= 0.5;
            uv2 *= 2.;
        }
        background *= mix(col1, col2, perlin(3.*uv));
        gl_FragColor = vec4(background+highlight(uv), 1.);
    }
}
