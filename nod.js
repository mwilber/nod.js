/*
 * Author: Matthew Wilber
 * https://github.com/mwilber/nod.js
 * License: MIT license
 * 
 * Based on shake.js, created by Alex Gibson: https://github.com/alexgibson/shake.js
 */

(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory(global, global.document);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(global, global.document);
    } else {
        global.Nod = factory(global, global.document);
    }
} (typeof window !== 'undefined' ? window : this, function (window, document) {

    'use strict';

    function Nod(options) {
        //feature detect
        this.hasDeviceMotion = 'ondevicemotion' in window;

        this.options = {
            threshold: 5, //default velocity threshold for nod to register
            timeout: 1000 //default interval between events
        };

        if (typeof options === 'object') {
            for (var i in options) {
                if (options.hasOwnProperty(i)) {
                    this.options[i] = options[i];
                }
            }
        }

        //use date to prevent multiple events firing
        this.lastTime = new Date();


        //create custom event
        if (typeof document.CustomEvent === 'function') {
            this.event = new document.CustomEvent('nod', {
                bubbles: true,
                cancelable: true
            });
        } else if (typeof document.createEvent === 'function') {
            this.event = document.createEvent('Event');
            this.event.initEvent('nod', true, true);
        } else {
            return false;
        }

		this.event.direction = "";
    }

    //reset timer values
    Nod.prototype.reset = function () {
        this.lastTime = new Date();
    };

    //start listening for devicemotion
    Nod.prototype.start = function () {
        this.reset();
        if (this.hasDeviceMotion) {
            window.addEventListener('devicemotion', this, false);
        }
    };

    //stop listening for devicemotion
    Nod.prototype.stop = function () {
        if (this.hasDeviceMotion) {
            window.removeEventListener('devicemotion', this, false);
        }
        this.reset();
    };

    //calculates if nod did occur
    Nod.prototype.devicemotion = function (e) {
        var current = e.rotationRate;
        var currentTime;
        var timeDifference;

		if( (Math.abs(current.alpha) > this.options.threshold) || (Math.abs(current.beta) > this.options.threshold) ){
			
			//calculate time in milliseconds since last event registered
            currentTime = new Date();
            timeDifference = currentTime.getTime() - this.lastTime.getTime();

            if (timeDifference > this.options.timeout) {
				if( current.alpha > this.options.threshold ){
					this.event.direction = "left";
					window.dispatchEvent(this.event); // left
				}else if( current.alpha < -this.options.threshold  ){
					this.event.direction = "right";
					window.dispatchEvent(this.event); // right
				}

				if( current.beta > this.options.threshold  ){
					this.event.direction = "down";
					window.dispatchEvent(this.event); //down
				}else if( current.beta < -this.options.threshold  ){
					this.event.direction = "up";
					window.dispatchEvent(this.event); // up
				}
				
                this.lastTime = new Date();

			}
		}

    };

    //event handler
    Nod.prototype.handleEvent = function (e) {
        if (typeof (this[e.type]) === 'function') {
            return this[e.type](e);
        }
    };

    return Nod;
}));