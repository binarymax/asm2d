function CircleModule(stdlib, foreign, heap) {
	"use asm"; 

	var width  = 0;
	var height = 0;

	var floor= stdlib.Math.floor;
	var sin  = stdlib.Math.sin;
	var rnd  = stdlib.Math.random;
	var sqrt = stdlib.Math.sqrt;
	var imul = stdlib.Math.imul;
	var sqr = function(x)   { return imul(x,x);   };
	var min = function(x,y) { return (x<y?x:y)|0; };
	var max = function(x,y) { return (x>y?x:y)|0; };

	var rand1 = function(max){ max=max|0; return (floor(rnd()*max))|0; };
	var rand2 = function(min,max){ min=min|0;max=max|0; return (floor(rnd() * (max - min + 1)) + min)|0; };

	function init(w,h,r) {
		width=w|0;height=h|0;
		var buf = new ArrayBuffer( (width|0) * (height|0) * 4);
		var img = new Uint8Array(buf);
		return img;
	}

	function putpixel(img,x,y,r,g,b,a) {
		x=x|0;y=y|0;r=r|0;g=g|0;b=b|0;a=a|0;
		if(x>=0 && y<height) {
			var idx = ((x*4)+(y*width*4))|0;
			img[idx+0] = r;
			img[idx+1] = g;
			img[idx+2] = b;
			img[idx+3] = a;
		}
	};
	
	function putover(img,x,y,r,g,b,a) {
		x=x|0;y=y|0;r=r|0;g=g|0;b=b|0;a=a|0;
		if(x>=0 && y<height) {
			var idx = ((x*4)+(y*width*4))|0;
			if(a===255) {
				img[idx+0] = r;
				img[idx+1] = g;
				img[idx+2] = b;
				img[idx+3] = 255;
			} else {
				var z = +(a/255);
				img[idx+0] = min((img[idx+0] + (r*z))|0,255);
				img[idx+1] = min((img[idx+1] + (g*z))|0,255);
				img[idx+2] = min((img[idx+2] + (b*z))|0,255);
				img[idx+3] = 255;
			}
		}
	};

	function circle(img,cx,cy,rad,r,g,b,a) {
		cx=cx|0;cy=cy|0;rad=rad|0,r=r|0;g=g|0;b=b|0;a=a|0;
		var idx = 0;   //xy to buffer index offset
		var dst = 0.0; //xy distance from center
		var top = (cy-rad)|0;
		var lft = (cx-rad)|0;
		var bot = (cy+rad)|0;
		var rgt = (cx+rad)|0;
		var alp = 255;
		if (top<0) top = 0;
		if (lft<0) lft = 0;
		if (bot>height) bot = height;
		if (rgt>width)  rgt = width;
		for(var y=top;y<bot;y++) {
			for(var x=lft;x<rgt;x++) {
				dst = +sqrt(sqr(x-cx) + sqr(y-cy));
				if(dst<rad) {
					alp = (a>0 && (dst>rad-a))?(255-(((dst-rad)+a)*(255/a))|0):255;
					putover(img,x,y,r,g,b,alp);
				}
			}
		}
	}

	function draw(img,w,h,n) {
		w=w|0;h=h|0;n=n|0;
		width=w|0;height=h|0;
		var idx = 0;
		var x=0,y=0,r=0,c=0;
		for(var i=0;i<n;i++) {
			x=rand1(w);
			y=rand1(h);
			r=rand2(2,30);
			switch(rand2(0,2)) {
				case 0:circle(img,x,y,r,255,0,0,2); break;
				case 1:circle(img,x,y,r,0,255,0,2); break;
				case 2:circle(img,x,y,r,0,0,255,2); break;
			};
			
		}
		return img;
	}
	
	function fractal(img,w,h,z) {
		width=w=w|0;height=h=h|0;z=z|0
		var idx = 0;
		for(var y=0;y<h;y++) {
			for(var x=0;x<w;x++) {
				img[idx+0] = ((sin(x*y)*255*z)|0)%255;
				img[idx+1] = ((sin(x&y)*255*z)|0)%255;
				img[idx+2] = ((sin(x|y)*255*z)|0)%255;
				img[idx+3] = 255;
				idx += 4;
			}
		}
	}	
	
	var getPixelDifference = function(r1,g1,b1,r2,g2,b2) { return (sqr(r1|0-r2|0) + sqr(g1|0-g2|0) + sqr(b1|0-b2|0))|0; };
	var getImageDifference = function(left,right) {
		var difference = 0, size = width|0*height|0*4;
		for(var r=0,g=1,b=2;r<_size;r+=4,g+=4,b+=4) difference += getPixelDifference(left[r],left[g],left[b],right[r],right[g],right[b]);
		return difference|0;	
	};
	
	
	function mimic(img,w,h) {
		width=w=w|0;height=h=h|0;
		w=w|0;h=h|0;
		var idx = 0;
		var x=0,y=0,r=0,c=0;
		for(var i=0;i<1000;i++) {
			x=rand1(w);
			y=rand1(h);
			r=rand2(2,30);
			switch(rand2(0,2)) {
				case 0:circle(img,x,y,r,255,0,0,2); break;
				case 1:circle(img,x,y,r,0,255,0,2); break;
				case 2:circle(img,x,y,r,0,0,255,2); break;
			};
			
		}
	};
	
	return {draw:draw,mimic:mimic,fractal:fractal,circle:circle,rand1:rand1,rand2:rand2};

};