/*
 * Author: Alex Gibson
 * https://github.com/alexgibson/shake.js
 * License: MIT license
 */

(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory(global, global.document);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(global, global.document);
    } else {
        global.Shake = factory(global, global.document);
    }
} (typeof window !== 'undefined' ? window : this, function (window, document) {

    'use strict';

    function Shake(options) {
        //feature detect
        this.hasDeviceMotion = 'ondevicemotion' in window;

        this.options = {
            threshold: 15, //default velocity threshold for shake to register
            timeout: 2000, //default interval between events
            angle: 50
        };

        if (typeof options === 'object') {
            for (var i in options) {
                if (options.hasOwnProperty(i)) {
                    this.options[i] = options[i];
                }
            }
        }

        //use date to prevent multiple shakes firing
        this.lastTime = new Date();

        //accelerometer values
        this.lastX = null;
        this.lastY = null;
        this.lastZ = null;

        //acceleration history
        this.accelX = null;
        this.accelY = null;
        this.accelZ = null;

        // nod semaphore 
        this.nodX = 0;
        this.nodY = 0;
        this.nodZ = 0;

        this.stop = false;


        //create custom event
        if (typeof document.CustomEvent === 'function') {
            this.event = new document.CustomEvent('shake', {
                bubbles: true,
                cancelable: true
            });
        } else if (typeof document.createEvent === 'function') {
            this.event = document.createEvent('Event');
            this.event.initEvent('shake', true, true);
        } else {
            return false;
        }
    }

    //reset timer values
    Shake.prototype.reset = function () {
        this.lastTime = new Date();
        this.lastX = null;
        this.lastY = null;
        this.lastZ = null;
        this.accelX = 0;
        this.accelY = 0;
        this.accelZ = 0;
        this.nodX = 0;
        this.nodY = 0;
        this.nodZ = 0;
    };

    //start listening for devicemotion
    Shake.prototype.start = function () {
        this.reset();
        if (this.hasDeviceMotion) {
            window.addEventListener('devicemotion', this, false);
        }
    };

    //stop listening for devicemotion
    Shake.prototype.stop = function () {
        if (this.hasDeviceMotion) {
            window.removeEventListener('devicemotion', this, false);
        }
        this.reset();
    };

    //calculates if shake did occur
    Shake.prototype.devicemotion = function (e) {

        var current = e.rotationRate;

        document.getElementById('x').innerHTML = Math.floor(current.alpha);
        document.getElementById('y').innerHTML = Math.floor(current.beta);
        document.getElementById('z').innerHTML = Math.floor(current.gamma);

        if( current.alpha > this.options.threshold ){
            document.getElementById('nod').innerHTML = document.getElementById('nod').innerHTML+", left";
        }else if( current.alpha < -this.options.threshold  ){
            document.getElementById('nod').innerHTML = document.getElementById('nod').innerHTML+", right";
        }

        if( current.beta > this.options.threshold  ){
            document.getElementById('nod').innerHTML = document.getElementById('nod').innerHTML+", down";
        }else if( current.beta < -this.options.threshold  ){
            document.getElementById('nod').innerHTML = document.getElementById('nod').innerHTML+", up";
        }

        return false;

        var current = e.accelerationIncludingGravity;
        var currentTime;
        var timeDifference;
        var deltaX = 0;
        var deltaY = 0;
        var deltaZ = 0;

        if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {
            this.lastX = current.x;
            this.lastY = current.y;
            this.lastZ = current.z;
            this.accelX = 0;
            this.accelY = 0;
            this.accelZ = 0;
            this.nodX = 0;
            this.nodY = 0;
            this.nodZ = 0;
            return;
        }

        deltaX = Math.abs(this.lastX - current.x);
        deltaY = Math.abs(this.lastY - current.y);
        deltaZ = Math.abs(this.lastZ - current.z);

        this.accelX += (this.lastX - current.x)*100;
        this.accelY += (this.lastY - current.y)*100;
        this.accelZ += (this.lastZ - current.z)*100;

        //currentTime = new Date();
        //timeDifference = currentTime.getTime() - this.lastTime.getTime();

        //if (timeDifference > 500) {
            document.getElementById('x').innerHTML = Math.floor(current.x);
            document.getElementById('y').innerHTML = Math.floor(current.y);
            document.getElementById('z').innerHTML = Math.floor(current.z);
            //this.lastTime = new Date();
        //}

        // if (((deltaX > this.options.threshold) && (deltaY > this.options.threshold)) || ((deltaX > this.options.threshold) && (deltaZ > this.options.threshold)) || ((deltaY > this.options.threshold) && (deltaZ > this.options.threshold))) {
        //     //calculate time in milliseconds since last shake registered
        //     currentTime = new Date();
        //     timeDifference = currentTime.getTime() - this.lastTime.getTime();

        //     if (timeDifference > this.options.timeout) {
        //         window.dispatchEvent(this.event);
        //         this.lastTime = new Date();
        //     }
        // }

        // Detect a swift motion up or down
        if( Math.abs(this.accelX) > this.options.angle && Math.abs(this.accelZ) > this.options.angle ){
            if( this.accelX > this.options.angle && this.accelZ < -this.options.angle ){
                currentTime = new Date();
                timeDifference = currentTime.getTime() - this.lastTime.getTime();

                if (timeDifference > this.options.timeout) {
                    //window.dispatchEvent(this.event);
                    document.getElementById('nod').innerHTML = document.getElementById('nod').innerHTML+", down";
                    this.lastTime = new Date();
                }
                
                // if( this.lastTime == null ){
                //     this.lastTime = new Date();
                // }
            }else if( this.accelX < -this.options.angle && this.accelZ > this.options.angle ){
                currentTime = new Date();
                timeDifference = currentTime.getTime() - this.lastTime.getTime();

                if (timeDifference > this.options.timeout) {
                    //window.dispatchEvent(this.event);
                    document.getElementById('nod').innerHTML = document.getElementById('nod').innerHTML+", up";
                    this.lastTime = new Date();
                }
                // if( this.lastTime != null ){
                //     currentTime = new Date();
                //     timeDifference = currentTime.getTime() - this.lastTime.getTime();

                //     if (timeDifference < 1000) {
                //         document.getElementById('nod').innerHTML = document.getElementById('nod').innerHTML+", nod";
                //         this.lastTime = null;
                //     }
                // }
            }
            // currentTime = new Date();
            // timeDifference = currentTime.getTime() - this.lastTime.getTime();

            // if (timeDifference > this.options.timeout) {
            //     this.lastTime = new Date();
            //     this.accelX = 0;
            //     this.accelY = 0;
            //     this.accelZ = 0;
            //     if( (this.nodX != 0 && this.nodZ != 0) && ((Math.abs(this.nodX+(this.lastX - current.x)) > 2) && (Math.abs(this.nodZ+(this.lastZ - current.z)) > 2))){
            //         alert('ck2');
            //         this.nodX = 0;
            //         this.nodY = 0;
            //         this.nodZ = 0;
            //     }else if(this.nodX == 0 && this.nodZ == 0){
            //         this.nodX = (this.lastX - current.x);
            //         this.nodZ = (this.lastZ - current.z);
            //         alert('ck1'+this.nodX+", "+this.nodZ);
            //     }
            // }
            
        }


        // // Detect a look up
        // if( this.accelZ > this.options.angle && this.accelX < -this.options.angle ){
        //     this.accelX = 0;
        //     this.accelY = 0;
        //     this.accelZ = 0;
        //     alert('up');
        //     if( this.nod == 1 ){
        //         this.nod = 0;
        //         document.getElementById('nod').innerHTML = document.getElementById('nod').innerHTML+' ,nod'
        //     }
        // }

        this.lastX = current.x;
        this.lastY = current.y;
        this.lastZ = current.z;

        // Degrade the acceleration over time
        this.accelX *= 0.00009;
        this.accelY *= 0.00009;
        this.accelZ *= 0.00009;

    };

    //event handler
    Shake.prototype.handleEvent = function (e) {
        if (typeof (this[e.type]) === 'function') {
            return this[e.type](e);
        }
    };

    return Shake;
}));
