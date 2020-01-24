(function(){
    var $wrapper = $('#container');
    var $gridItem = $('<div class="bacteria" />');
    var canvas = document.getElementById('canvas'); 
    var context = canvas.getContext('2d');
    var items = [];
    var bacteriaCount=[];
    canvas.width = 1024;
    canvas.height = 768;
    var jsonData={
        "images":[
            'media/images/bact_1.png',
            'media/images/bact_2.png',
            'media/images/virus_2.png',
            'media/images/bact_3.png',
            'media/images/virus_1.png'
        ],
        "duration":($('#container').height() * 10) + (Math.random() * 2000),
        "randomString":function(){return Math.random().toString(36).slice(-7)},
        "randomRotate":function(){return Math.random() * 30 - 5},
        "lastIndex":function(name,char1,char2){
            var array = name;
            array = array.split(char1);
            array = array[array.length-1];
            return array.split(char2)[0];
        },
        "positionX":function(a){
            return "originalEvent" in a && "touches" in a.originalEvent ? a.originalEvent.touches[0].pageX : a.pageX;
        },
        "positionY":function(b){
            return "originalEvent" in b && "touches" in b.originalEvent ? b.originalEvent.touches[0].pageY : b.pageY;
        },
        "playSound":function(url){
            var audio = new Audio(url);
            audio.play();
        },
        "falling":function(objCount){
            console.log(arguments.length);
            var bool = arguments.length==0?true:$('.bacteria').length<Number(objCount);
            if(bool){
                var element = (this.images[Math.floor(Math.random() * this.images.length)]);
                $gridItem.html('<img src="' + element + '" class="item" data-notify="'+this.lastIndex(element,"/","_")+'" id="'+this.randomString()+'" data-image="'+this.lastIndex(element,"/",".")+'">');
                var wrapperWidth = $wrapper.width(),
                    wrapperHeight = $wrapper.height(),
                    duration = (wrapperHeight * 10) + (Math.random() * 2000),
                    startPosition = (Math.random() * wrapperWidth) - 100;
                $gridItem.clone().appendTo($wrapper).css({
                    'left': startPosition
                }).css('-webkit-transform', 'rotate(' + this.randomRotate() + 'deg)').animate({
                    top: wrapperHeight - 40 +(Math.random() * 100),
                    left: (startPosition - 100) + (Math.random() * 200)
                }, Number(this.duration), 'linear', function() {
                    $(this).remove();
                });
            }
        }
    };
    // cunstructor for create dynamic object
    function  ObjDetails(obj,notify,itemId,eleClass){
        this.notify  = notify;
        this.itemId  = itemId;
        this.elHeight  = obj.height;
        this.elWidth  = obj.width;
        this.posX  = obj.left;
        this.posY  = obj.top;
        this.eleClass  = eleClass;
    }
    // kill elements on detection
    ObjDetails.prototype.killItem = function(){
        var currentId=this.itemId;
        var chop = '<img src="media/images/'+this.eleClass+'_1.png" class="slice">';
        var $this=this;
        $.each($('.bacteria .item'),function(item){
            if($this.notify == "virus" && currentId ==$(this).attr('id')){
                $('#'+currentId).parent().html(chop);
                jsonData.playSound('Chopping.mp3');
                $('#'+currentId).remove();
                eventEnd();
            }else if($this.notify == "bact" && currentId ==$(this).attr('id')){
                jsonData.playSound('Chopping.mp3');
                $('#'+currentId).parent().css({'opacity': '0.4','-webkit-transition': 'opacity 5s ease'});
                $('#'+currentId).parent().html(chop);
                $('#'+currentId).remove();
            }
        });
    }
    var isDrawing, points = [];   
    function interactionStart(e){
        isDrawing = true;
        points.push({ x: jsonData.positionX(e), y:  jsonData.positionY(e) });
    }
    function eventStart(){
        canvas.addEventListener('mousedown',interactionStart);	
        canvas.addEventListener('mousemove',interactionOnGoing);	
        canvas.addEventListener('mouseup',interractionEnd);
    }
    function eventEnd(){
        gameOver();
        canvas.removeEventListener('mousedown',interactionStart);	
        canvas.removeEventListener('mousemove',interactionOnGoing);	
        canvas.removeEventListener('mouseup',interractionEnd);
    }
    eventStart();
    // user detection when strike on elements
    function collisionDetection(userX,userY){
        for(var i=0;i<items.length;i++){
            if(userX >= items[i].posX && userX <= items[i].posX+items[i].elWidth  &&  userY>=items[i].posY && userY<=items[i].posY+items[i].elHeight){
                items[i].killItem();
            }
        }
    }

    function interactionOnGoing(e){
        context.lineWidth = 2;
        context.lineJoin = context.lineCap = 'round';
        context.strokeStyle = 'rgba(255,255,255,.5)';
        if (!isDrawing) return;
        $.each($('.bacteria .item'),function(item){
            items.push(new ObjDetails(document.getElementById($(this).attr('id')).getBoundingClientRect(),$(this).attr('data-notify'),$(this).attr('id'),$(this).data('image')));
        });
        collisionDetection(jsonData.positionX(e),jsonData.positionY(e));
        points.push({ x: jsonData.positionX(e), y: jsonData.positionY(e) });
        context.beginPath();
        context.save();
        context.shadowBlur=20;
        context.shadowColor="rgba(255,255,255,1)";
        context.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
            var nearPoint = points[i-5];
            if (nearPoint) {
                context.moveTo(nearPoint.x, nearPoint.y);
                context.lineTo(points[i].x, points[i].y);
            }
        }
        context.stroke();	
        context.restore(); 
    }
    
    function interractionEnd(){
        isDrawing = false;
        points.length = 0;
        context.clearRect(0,0,canvas.width,canvas.height);
        items =[];
    }
    var interval = setInterval(function() {
        jsonData.falling(8)
    }, 500);
    var time =0;
    var clearTime=setInterval(function(){
        time++;
        if(time >25){
            gameOver();
        }
    },1000)
    function gameOver(){
        clearInterval(interval);
        clearInterval(clearTime);
        items=[];
        bacteriaCount=[];
        $('.bacteria').stop();
    }
    

})();