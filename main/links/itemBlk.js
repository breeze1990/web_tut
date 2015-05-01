var ItemManager = (function(){
    "use strict";

var myExport = {};
var edit_obj = {};

$( document ).ready(function(){
    addItem();

    $('html').click(function(event) {
        //Hide the menus if visible
        if (!$(event.target).closest('#edit-container').length && $("#edit-container").is(":visible")) {
        // Hide the menus.
            $("#edit-container").hide();
            $("div").removeClass("blur-bg");
        }
    });

    $("ul.navbar-right>li").click(addItem);

    $("#edit-container").find("button").eq(0).click(function(event){
        var t = $("#edit-container").find("input").val();
        var c = $("#edit-container").find("textarea").val();
        edit_obj.setTitle(t);
        edit_obj.setContent(c);
    });

    $("#edit-container").find("button").eq(1).click(function(event){
        $("#edit-container").find("input").val("");
        $("#edit-container").find("textarea").val("");
    });

    // $("#navbar").find("ul li ul li:contains('Blur')").click(toggleBlur);
    $(".user-container-handle").data("toggleSt",true);
    $(".user-container-handle").click(function(){
        if($(this).data("toggleSt")){
            $("#user-container").transition({"transform": "translate(100%, -50%)"});
            $(this).data("toggleSt",false);
        }else {
            $("#user-container").transition({"transform": "translate(0, -50%)"});
            $(this).data("toggleSt",true);
        }
    });

    $("#user-container").find("button:contains('Rename')").click(function(event){
        var name = $(this).parent().siblings().val();
        serverConn.setName(name);
    });
    $("#user-container").find("button:contains('Send')").click(function(event){
        var word = $(this).parent().siblings().val();
        if(word === "") return;
        var old = $(".user-chat").val();
        $(".user-chat").val(old + "\n" + word);
        serverConn.sendMsg(word);
    });
});

var blk_count = 0;
var ItemCreator = (function(){

    var ItemCreator = function(opt){
        if(!opt) opt = {};
        var n = $("<div class='item-blk'>"+
        "<div class='item-title'><span class='item-title-text'>" + (opt.ititle || "untitled") + "</span>"+
        "<span class='glyphicon glyphicon-remove btn-close'></span></div>"+
        "<div class='item-content'>"+ (opt.icontent || "hello world") + "</div></div>");
        n._dom_obj = this;
        n.css({
            "left": "50px",
            "top": "50px",
        });
        n.find(".btn-close").click(function(){
            n.remove();
            blk_count--;
        });
        setMovable(n);
        n.dblclick(function(){
            edit_obj = n._dom_obj;
            toggleBlur();
            $("#edit-container").show();
            $("#edit-container").css("zIndex",(blk_count+1).toString());
            $("#edit-container").find("input").val(n._dom_obj.getTitle());
            $("#edit-container").find("textarea").val(n._dom_obj.getContent());
        });
        this._$el = n;
    }
    ItemCreator.prototype.getTitle = function() {
        return this._$el.find(".item-title-text").text();
    }
    ItemCreator.prototype.getContent = function() {
        return this._$el.find(".item-content").text();
    }
    ItemCreator.prototype.setTitle = function(t) {
        this._$el.find(".item-title-text").text(t);
    }
    ItemCreator.prototype.setContent = function(t) {
        this._$el.find(".item-content").text(t);
    }
    return ItemCreator;
})();

function addItem(){
    var n = new ItemCreator();

    $("body").append(n._$el);
    blk_count++;
}

function restack(cval){
    var lst = $('.item-blk');
    for(var it=0;it<lst.length;it++){
        var el = lst[it];
        var val = parseInt(el.style.zIndex);
        if(!isNaN(val) && val>cval) el.style.zIndex=(val-1).toString();
    }
}

function down(evt){
    this.pressed = true;
    this.posX = evt.pageX;
    this.posY = evt.pageY;
    restack(parseInt(this.style.zIndex));
    this.style.zIndex = blk_count.toString();
};

function up(evt){
    this.pressed = false;
};

function move(evt){
    if(this.pressed){
        var dx = evt.pageX-this.posX;
        var dy = evt.pageY-this.posY;
        this.posX = evt.pageX;
        this.posY = evt.pageY;
        this.style.left = (this.getBoundingClientRect().left+dx)+"px";
        this.style.top = (this.getBoundingClientRect().top+dy)+"px";
    }
};
function setMovable(node){
    //add listeners to the element denoted by 'node' variable
    //so that it can move around with mouse in the web page
    node.mousedown(down);
    node.mouseup(up);
    node.mouseleave(up);
    node.mousemove(move);
}
function toggleBlur(){
    $("div").not("#edit-container").toggleClass("blur-bg");
}

myExport.blur = toggleBlur;

return myExport;

})();
