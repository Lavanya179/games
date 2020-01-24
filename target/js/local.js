// --- local.js --- //
var startEvent = (navigator.userAgent.match(/iPad/i)) ? "touchstart" : "mousedown";
var moveEvent = (navigator.userAgent.match(/iPad/i)) ? "touchmove" : "mousemove";
var realLeaveEvent = (navigator.userAgent.match(/iPad/i)) ? "touchend" : "mouseup";
var rotated = 0;
var v = 0;
var count = 0;
var rightRotate;
var leftRotate;
$(document).ready(function(e) {
    draggElement();
    $.each($(".handle_drag"),function(){
        $(this).swipeLeftRight();
    })
    

});
$.fn.swipeLeftRight = function() {
    var scope = $(this),
        ns = (Math.random() + '').replace('.', ''),
        viewPort = $(window),
        adjX = 0;
    var minimumX = 71;
    var maximumX = 480;
    scope.on(startEvent, function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var pos = scope.offset();
        var startX = "originalEvent" in ev && "touches" in ev.originalEvent ? ev.originalEvent.touches[0].pageX : ev.pageX;
        var ox = (startX - pos.left);
        var sPOffsetLeft = $(this).parent().offset().left;
        scope.data(ns, {
            x: ox
        });
        viewPort.on(moveEvent, function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var moveX = "originalEvent" in ev && "touches" in ev.originalEvent ? ev.originalEvent.touches[0].pageX : ev.pageX;
            var offset = scope.data(ns);
            var leftPos = moveX - adjX - offset.x
            if (leftPos < minimumX) {
                leftPos = minimumX;
            }
            if (leftPos > maximumX) {
                leftPos = maximumX;
            }
            scope.parent().parent().css("left", leftPos);
        });
        viewPort.on(realLeaveEvent, function() {
            ev.preventDefault();
            ev.stopPropagation();
            viewPort.off(moveEvent + ' ' + realLeaveEvent).removeData(ns);
        });
    });

    return this;
};

function draggElement() {
    var i = 1;
    var wh = 60;
    var hh = 147;
    $('.draggable').draggable({
        containment: ".drag-arrow-section",
        start: function(event, ui) {
            var left = parseInt($(this).css('left'), 10);
            left = isNaN(left) ? 0 : left;
            var top = parseInt($(this).css('top'), 10);

            top = isNaN(top) ? 0 : top;
            recoupLeft = left - ui.position.left;
            recoupTop = top - ui.position.top;

        },
        drag: function(event, ui) {
            ui.position.left += recoupLeft;
            ui.position.top += recoupTop;
            getTop = ui.position.top;
            $(this).find('.hand').removeClass('hand');
        },
        stop: function(ui, event) {
            console.log($(this).offset().top + " kr");

            if (getTop < 30 && getTop >= 20) {
                getTop = 185 - $(this).offset().top;
            } else if (getTop < 30 && getTop >= 20) {
                getTop = 185 - $(this).offset().top;
            } else if (getTop < 31 && getTop >= 21) {
                getTop = 180 - $(this).offset().top;
            } else {
                getTop = 296 - $(this).offset().top - getTop;
            }
            if ('transform' in document.body.style) {
                rotate = document.querySelector('#' + $(this).attr('id')).style.transform;
            }
            if ('-webkit-transform' in document.body.style) {
                rotate = document.querySelector('#' + $(this).attr('id')).style.webkitTransform;
            }


            $(this).css({
                '-webkit-transform': '',
                'transform': ''
            });

            $(this).parent().css({
                '-webkit-transform': rotate,
                '-moz-transform': rotate,
                '-ms-transform': rotate,
                '-o-transform': rotate,
                'transform': rotate,
            });
            $(this).animate({
                top: getTop
            }, {
                duration: 500,
                easing: "linear",
                step: function(x) {
                    $(this).css('transform', 'rotateX(' + i + 'deg)');
                    $(this).css('width', wh + 'px');
                    $(this).css('height', hh + 'px');
                    if (i < 100)
                        i += 2.3;
                    wh -= .1;
                    hh -= .1;


                }

            }).promise().done(function() {
                var posX = 232 - $(this).find('.handle_drag').offset().left;
                var posY = 227 - $(this).find('.handle_drag').offset().top;
                var z = (posX * posX) + (posY * posY);
                console.log(" left is " + $('.handle_drag').offset().left, " right is " + $('.handle_drag').offset().top, " and multiply is " + z + " 1089 ");
                count++;
                if (z < 895) {
                    v++;
                    $('.value').text(v);
                    $($(this).data('target')).addClass('green_box');

                } else {
                    $($(this).data('target')).addClass('red_box');
                }
                var id = $(this).attr('id');
                var pid = $(this).parent().next().attr('id');
                $(this).parent().css('z-index', '100').find('.set_img').hide(1000);
                $('#' + pid).show(1000).css('z-index', '9999').find('.draggable').removeClass('disabled');
                $($(this).data('arrow') + ' .arrow').addClass('gray_arrow'); // for arrow gray color

                if (count == 4) {
                    if (v == 4 && count == 4) {
                        alert("trigger success popup");
                    } else {
                        alert("failed popup");
                    }

                }
                draggElement();
            });
            $(this).removeClass('ui-draggable ui-draggable-handle').addClass('disabled');
            $(this).enableSelection()
                .removeData("draggable")
                .unbind(".draggable")
                .removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");
        }
    });
}

jQuery.fn.rotate = function(degrees) {
    $(this).css({
        '-webkit-transform': 'rotate(' + degrees + 'deg)',
        '-moz-transform': 'rotate(' + degrees + 'deg)',
        '-ms-transform': 'rotate(' + degrees + 'deg)',
        'transform': 'rotate(' + degrees + 'deg)'
    });
};

var int00;
var int000;

function ani() {
    $('.arrow.active:not(.disabled)').rotate(++rotated);
}

function ani2() {
    $('.arrow.active:not(.disabled)').rotate(--rotated);
}

$('.btnPlus').on('touchstart mousedown', function() {
    int00 = int00 || setInterval(function() {
        ani();
    }, 50);
});

$('.btnPlus').on('touchend mouseup', function() {
    clearInterval(int00);
    int00 = undefined;
});

$('.btnMinus').on('touchstart mousedown', function() {
    int000 = int000 || setInterval(function() {
        ani2();
    }, 50);
});

$('.btnMinus').on('touchend mouseup', function() {
    clearInterval(int000);
    int000 = undefined;
});