var ui = (function(){
		"use strict";

		//ASM.js modules
		var asm = {
			graphics : CircleModule({ Math: Math })
		}

		//------------------------------------------------------------------
		//Initializes a canvas width and height
		var initCanvas = function(canvas,width,height) {
			if (typeof canvas === "string") canvas = document.getElementById(canvas);
			canvas.width  = width;
			canvas.height = height;
			canvas.style.width  = canvas.width + 'px';
			canvas.style.height = canvas.height + 'px';
			return canvas;
		};
		
		//------------------------------------------------------------------
		//Initializes the context of a canvas
		var initContext = function(canvas) {
			var context = canvas.getContext("2d");
			context.fillStyle="#ffffff";
			context.fillRect(0, 0, canvas.width, canvas.height);
			return context;
		};
			
		//------------------------------------------------------------------	
		//Random number helpers
		var rand1 = function(max){ return Math.floor(Math.random()*max); }
		var rand2 = function(min,max){ return Math.floor(Math.random() * (max - min + 1)) + min; }

		//------------------------------------------------------------------	
		//Copy one ByteArray to Another
		var copyImage = function(source,target) {
			for(var i=0,l=source.length;i<l;i++) {
				target[i] = source[i];
			}
		}

		//------------------------------------------------------------------	
		//Native Canvas Circle
		var d360=2*Math.PI;
		var circle = function(ctx,x,y,r,c) {
			ctx.beginPath();
			ctx.fillStyle = c;
			ctx.arc(x, y, r, 0, d360, false);
			ctx.closePath();
			ctx.fill();
		}

		//------------------------------------------------------------------	
		//Draw n Native Circles
		function draw(img,w,h,n) {
			w=w|0;h=h|0;n=n|0;
			var idx = 0;
			var x=0,y=0,r=0,c=0;
			for(var i=0;i<n;i++) {
				x=rand1(w);
				y=rand1(h);
				r=rand2(2,30);
				switch(rand2(0,2)) {
					case 0:circle(img,x,y,r,'rgba(255,0,0,1)'); break;
					case 1:circle(img,x,y,r,'rgba(0,255,0,1)'); break;
					case 2:circle(img,x,y,r,'rgba(0,0,255,1)'); break;
				};
			}
		}
		
		//------------------------------------------------------------------	
		// Benchmark for asm.js
		var benchasm = function(ctx1,w,h,n) {
			var time = new Date();
			var target1 = ctx1.getImageData(0,0,w,h);			
			asm.graphics.draw(target1.data,w,h,n);
			ctx1.putImageData(target1, 0, 0);
			return new Date() - time; 
		}
		
		// Benchmark for native canvas
		var benchnat = function(ctx2,w,h,n) {
			// Benchmark the Native Circles
			var time = new Date();
			draw(ctx2,w,h,n);
			return new Date() - time;
		}

		//------------------------------------------------------------------	
		// Run the benchmarks
		var bench = function() {
			
			var inc = 500;
			var max = 20000/inc;
			
			var w = 800;
			var h = 600;

			var testsnum = [];
			var testsasm = [];
			var testsnat = [];

			var can1 = initCanvas("c_asm",w,h);
			var ctx1 = initContext(can1);

			var can2 = initCanvas("c_native",w,h);
			var ctx2 = initContext(can2);

			for(var i=0,j=inc;i<max;i++) {
				testsnum.push(j);
				testsasm.push(benchasm(ctx1,800,600,j));
				j+=inc;
			}
			
			for(var i=0,j=inc;i<max;i++) {
				testsnat.push(benchnat(ctx2,800,600,j));
				j+=inc;
			}

			return {testsnum:testsnum,testsasm:testsasm,testsnat:testsnat};
			
		}			

		var run = function(){

			var marks = bench();

			$('#container').highcharts({
	            title: {
	                text: 'ASM vs Canvas',
	                x: -20 //center
	            },
	            xAxis: {
	                title: {
	                    text: 'Circles'
	                },
	                categories: marks.testsnum
	            },
	            yAxis: {
	                title: {
	                    text: 'Milliseconds'
	                },
	                plotLines: [{
	                    value: 0,
	                    width: 1,
	                    color: '#808080'
	                }]
	            },
	            tooltip: {
	                valueSuffix: 'Circles'
	            },
	            legend: {
	                layout: 'vertical',
	                align: 'right',
	                verticalAlign: 'middle',
	                borderWidth: 0
	            },
	            series: [{
	                name: 'ASM',
	                data: marks.testsasm
	            }, {
	                name: 'Native',
	                data: marks.testsnat
	            }]
	        });

			
		};

		return {run:run};

})();

ui.run();