// interaction events for trigger events
var interactionEvent = (navigator.userAgent.match(/iPad/i)) ? "touchend" : "click";
var mouseMoveEvent = (navigator.userAgent.match(/iPad/i)) ? "touchmove" : "mousemove";
var mouseDownEvent = (navigator.userAgent.match(/iPad/i)) ? "touchstart" : "mousedown";
var mouseUpEvent = (navigator.userAgent.match(/iPad/i)) ? "touchend" : "mouseup";
(function() {
    // to initialize the game
    function start() {

        var time = 0;
        var canvas = document.getElementById('canvas');
        var instances = [];
        var instanceCount = 5;
        var context = canvas.getContext('2d');
        canvas.width = 1024;
        canvas.height = 768;
        
        const collections = [{
            'image': 'media/images/bact.png',
            'cat': 'good',
            'x': Math.random() * canvas.width - 56,
            'y': -240,
            'w': 58,
            'h': 136,
            'name': 'bact'
        }, {
            'image': 'media/images/virus.png',
            'cat': 'bad',
            'x': Math.random() * canvas.width - 100,
            'y': -240,
            'w': 100,
            'h': 98,
            'name': 'virus'
        }, {
            'image': 'media/images/virus1.png',
            'cat': 'bad',
            'x': Math.random() * canvas.width - 100,
            'y': -240,
            'w': 100,
            'h': 91,
            'name': 'virus1'
        }, {
            'image': 'media/images/bact1.png',
            'cat': 'good',
            'x': Math.random() * canvas.width - 125,
            'y': -240,
            'w': 125,
            'h': 87,
            'name': 'bact1'
        }, {
            'image': 'media/images/bact2.png',
            'cat': 'good',
            'x': Math.random() * canvas.width - 125,
            'y': -240,
            'w': 125,
            'h': 93,
            'name': 'bact2'
        }];
        // to get X coordinates for desktop and touch screens
        function positionX(a) {
            return "originalEvent" in a && "touches" in a.originalEvent ? a.originalEvent.touches[0].pageX : a.pageX;

        }
        // to get Y coordinates for desktop and touch screens
        function positionY(b) {
            return "originalEvent" in b && "touches" in b.originalEvent ? b.originalEvent.touches[0].pageY : b.pageY;

        }
        // custructor objet to attach properties and methods
        function construct(obj) {
            this.cat = obj.cat;
            this.image = obj.image;
            this.posX = obj.x >= obj.w ? obj.x : obj.x + obj.w;
            this.posY = obj.y;
            this.velG = [-1 + 0.2 * 23, -1 + 0.2 * 22, -1 + 0.2 * 24, -1 + 0.2 * 20, -1 + 0.2 * 26];
            this.velB = [-1 + 0.2 * 25, -1 + 0.2 * 22, -1 + 0.2 * 26, -1 + 0.2 * 21, -1 + 0.2 * 23];
            this.w = obj.w;
            this.h = obj.h;
            this.badSpeed = Math.floor(Math.random() * this.velB.length);
            this.goodSpeed = Math.floor(Math.random() * this.velG.length);
            this.rotate = Math.floor(Math.random() * 360);
            this.name = obj.name;
            this.hrValues = [0, 0.2, -0.4, 0, 0.3, -0.1, -0.2, 0, 0.1, -0.3, 0.4, 0, -0.3];
            this.hrVel = this.hrValues[Math.floor(Math.random() * this.hrValues.length)];
        }
        
        // method added to cunstucted prototype
        construct.prototype.update = function() {
            if (this.posY >= canvas.height - 10) {
                if (this.cat == 'good') {
                    console.log('crossed');
                    gameOver();
                    $('.gameOver').removeClass('hide').addClass('active');
                    $('.content-over .head-text .bB').removeClass('hide');
                    $('.content-over .head-text .gB').addClass('hide');
                    $('.content-over').addClass('zoom-in');

                }

            } else {
                if (this.cat == 'good') {
                    if (this.posX < canvas.width - this.w)
                        this.posX += this.hrVel;
                    else
                        this.hrVel = -this.hrVel;
                    if (this.posX < 0)
                        this.hrVel = -this.hrVel;



                    this.posY += this.velG[this.goodSpeed];
                } else if (this.cat == 'bad') {
                    if (this.posX < canvas.width - this.w)
                        this.posX += this.hrVel;
                    else
                        this.hrVel = -this.hrVel;
                    if (this.posX < 0)
                        this.hrVel = -this.hrVel;

                    this.posY += this.velB[this.badSpeed];
                }
                context.beginPath();
                var image = new Image();
                image.src = this.image;
                context.drawImage(image, this.posX, this.posY, this.w, this.h);
            }



        }
        // custructor function to attach properties on user interaction with elements
        function splitConstructor(splitImage, instance) {
            this.splitImage = splitImage;
            this.velY = -1 + 0.2 * 20;
            this.yAxisUp = instance.posY + 20;
            this.yAxisDown = instance.posY - 20;
            this.instance = instance;
            this.animAlpha = 1.0;
            this.negative = -1;
            this.splitFlag = true;

        }
        // first time to store objects on page load
        for (var i = 0; i < instanceCount - 3; i++) {
            instances.push(new construct(collections[i]));
        }
        // draw function for to update every instance and to check properties values
        function draw() {
            
            context.clearRect(0, 0, context.width, context.height);
            for (var i = 0; i < instances.length; i++) {
                p = instances[i];
                p.update();
            }
            
        }


        var splitArr = [];
        // to slice object into two piece
        function splitImage(instance, index) {
            var splitImage;
            var inst = instance;
            instances.splice(index, 1);
            switch (inst.name) {
                case 'bact':
                    splitImage = new Image();
                    splitImage.src = "media/images/bact-split.png";
                    break;

                case 'bact1':
                    splitImage = new Image();
                    splitImage.src = "media/images/bact1-split.png";
                    break;
                case 'bact2':
                    splitImage = new Image();
                    splitImage.src = "media/images/bact2-split.png";
                    break;

            }
            splitArr.push(new splitConstructor(splitImage, inst));
            var audio = new Audio("media/sounds/chopping.mp3");
            audio.play();


        }
        // to kill current object on striking the item
        function kill(instance, ind) {
            instances.splice(ind, 1);
            var image = new Image();
            image.src = instance.image;
            var count = 50;
            var bounce = setInterval(function() {
                count--;
                if (count >= 0) {
                    context.globalCompositeOperation = 'lighter';
                    context.drawImage(image, instance.posX, instance.posY, count, count);
                } else {
                    clearInterval(bounce);
                    gameOver();
                    $('.gameOver').removeClass('hide').addClass('active');
                    $('.content-over').addClass('zoom-in');
                }
            }, 10)

        }
        // to detect strike coordinates and item coordinates collide on each other
        function collisionDetection(userX, userY) {
            for (var i = 0; i < instances.length; i++) {
                if (userX >= instances[i].posX && userX <= instances[i].posX + instances[i].w && userY >= instances[i].posY && userY <= instances[i].posY + instances[i].h) {
                    if (instances[i].cat == 'bad') {
                        console.log('bad detected');
                        $('.content-over .head-text .bB').addClass('hide');
                        $('.content-over .head-text .gB').removeClass('hide');
                        kill(instances[i], i);
                    } else {
                        console.log('good detected');
                        splitImage(instances[i], i);
                        //instances.splice(i,1);
                    }

                }
            }

        }
        // game over function when striking on virus and when bacteria crossed danzer zone
        function gameOver(value) {
            context.clearRect(0, 0, context.width, context.height);
            clearInterval(timing);
            clearInterval(timeCountInterval);
            clearInterval(fall);
            window.removeEventListener(mouseDownEvent, mouseDownFunc);
            window.removeEventListener(mouseMoveEvent, mouseMoveFunc);
            window.removeEventListener(mouseUpEvent, mouseUpFunc);

        }
        // invoking collision event for mouse interaction and touch interaction
        collisionEvent();

        var isDrawing, points = [];

        function mouseDownFunc(e) {
            isDrawing = true;
            points.push({
                x: positionX(e),
                y: positionY(e)
            });

        }
        // on mouse move draw a strike line
        function mouseMoveFunc(e) {
            //console.log('mouse move');
            context.lineWidth = 2;
            context.lineJoin = context.lineCap = 'round';
            context.strokeStyle = 'rgba(255,255,255,.5)';
            if (!isDrawing) return;
            collisionDetection(positionX(e), positionY(e));
            points.push({
                x: positionX(e),
                y: positionY(e)
            });
            context.beginPath();
            context.save();
            context.shadowBlur = 20;
            context.shadowColor = "rgba(255,255,255,1)";
            context.moveTo(points[0].x, points[0].y);
            for (var i = 1; i < points.length; i++) {
                context.lineTo(points[i].x, points[i].y);
                var nearPoint = points[i - 5];
                if (nearPoint) {
                    context.moveTo(nearPoint.x, nearPoint.y);
                    context.lineTo(points[i].x, points[i].y);
                }
            }
            context.stroke();
            context.restore();

        }

        function mouseUpFunc() {
            isDrawing = false;
            points.length = 0;
        }
        
        function collisionEvent() {
            window.addEventListener(mouseDownEvent, mouseDownFunc);
            window.addEventListener(mouseMoveEvent, mouseMoveFunc);
            window.addEventListener(mouseUpEvent, mouseUpFunc);

        }

        //var animAlpha = 1.0;

        var previousValue = [],
            inc = 0;
        // interval function for falling items from top
        var fall = setInterval(function() {
            var temp = collections[Math.floor(Math.random() * collections.length)];
            temp.x = (Math.random() * canvas.width) - temp.w;
            instances.push(new construct(temp));
            //console.log(instances[instances.length-1]);

        }, 500);
        //var neg = -1;
        var timing = setInterval(function() {
            if (ellapse > 25) {
                gameOver();
                $('.congrats').removeClass('hide').addClass('active');
                $('.content').addClass('zoom-in');
                return;
            }

            context.clearRect(0, 0, canvas.width, canvas.height);
            // context.globalCompositeOperation = 'lighter';
            draw();


            for (var i = 0; i < splitArr.length; i++) {
                //console.log(splitArr[i]);
                if (splitArr[i].splitFlag) {
                    // console.log(splitArr[i].animAlpha);
                    context.save();
                    context.globalAlpha = splitArr[i].animAlpha;
                    // console.log(splitArr[i].instance.posX);
                    context.drawImage(splitArr[i].splitImage, Number(splitArr[i].instance.posX), splitArr[i].instance.posY, splitArr[i].instance.w, splitArr[i].instance.h);
                    //context.drawImage(splitArr[i].downImage,Number(splitArr[i].instance.posX)+40,splitArr[i].instance.posY,66,65);
                    context.restore();
                    if (splitArr[i].animAlpha > 0.03) {
                        splitArr[i].animAlpha -= 0.03
                    } else {
                        splitArr[i].splitFlag = false;
                        splitArr[i].animAlpha = 1.0;
                        splitArr[i].negative = -1;
                        splitArr.splice(i, 1);
                    }

                }


            }
        }, 1000 / 60);


        var circlePath = 25; /* how long the timer runs for */
        var initialOffset = '198';
        var ellapse = 1
        var timeCountInterval = setInterval(function() {
            $('.circle_animation').css('stroke-dashoffset', initialOffset - (ellapse * (initialOffset / circlePath)));
            (ellapse > 9) ? document.getElementById('time').innerHTML = " " + ellapse: document.getElementById('time').innerHTML = "0" + ellapse;
            if (ellapse > 20)
                $('.circle_animation').css('stroke', '#f00');

            if (ellapse == 25) {
                clearInterval(timeCountInterval);
            }
            ellapse++;
        }, 1000);

    }
    $('html body').on(interactionEvent, '.try-again', function() {
        $('.landing-page').addClass('hide');
        $('.start-game').removeClass('hide');
        $('#time').text("00");
        $('.circle_animation').css({
            'stroke-dashoffset': '198',
            '-webkit-transition': 'stroke-dashoffset 0s linear'
        });
        $(this).parent().removeClass('zoom-in').parent().removeClass('active');
        start();
        setTimeout(function() {
            $('.circle_animation').removeAttr('style');
        }, 100);
    });
    $('html body').on(interactionEvent, '.replay', function() {
        $('.landing-page').addClass('hide');
        $('.start-game').removeClass('hide');
        $('#time').text("00");
        $('.circle_animation').css({
            'stroke-dashoffset': '198',
            '-webkit-transition': 'stroke-dashoffset 0s linear'
        });
        $(this).parent().removeClass('zoom-in').parent().removeClass('active');
        start();
        setTimeout(function() {
            $('.circle_animation').removeAttr('style');
        }, 100);
    });
    $(document).on(interactionEvent, '.begin', function() {
        $('.landing-page').addClass('hide');
        $('.start-game').removeClass('hide');
        start();
    });
})();