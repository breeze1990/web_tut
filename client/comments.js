var tmp = "HI";
var flag = 0;
var _ = document;
var edit_obj = {};
var blk_count = 0;
var blkPool = {};

window.onload = function(){
    setMovable($('pal'));
    setMovable($('test'));
}

function changeclr(event){
    if(edit_obj.style === undefined) return;
    edit_obj.style["border-color"] = showcolor();
    edit_obj.children[0].children[0].style["background-color"] = showcolor();

};
function save(event){
    if(Object.keys(edit_obj).length==0) return;
    edit_obj.childNodes[1].innerHTML = $('opt_panel_tr').value;
}

function setMovable(node){
    //add listeners to the element denoted by 'node' variable
    //so that it can move around with mouse in the web page
    node.style.position = 'absolute';
    node.addEventListener("mousedown",down);
    node.addEventListener("mouseup",up);
    node.addEventListener("mousemove",move);
    node.addEventListener("mouseleave",up);
}

function rmBlk(event){
    var that = event.currentTarget;
    var cur = that.parentNode;
    var par = cur.parentNode;
    par.removeChild(cur);
}
function add(){
    var node = _.createElement("div");
    node._id = CMT_IDM.getNext();
    blkPool[node._id] = node;
    blk_count++;
    node.innerHTML = '<div class="rblk_card"><div class="label">Hello World</div>' +
    '<div class="top_right btn btn-small""><p>&#x2715;</p></div>' +
    '</div><div class="rblk_card">drag me</div>';
    node.className = 'rblk';
    var thisid = node._id;
    node.children[0].children[1].pid = node._id;
    node.children[0].children[1].addEventListener('click',function(event){
        var that = event.currentTarget;
        console.log(that.pid);
        var cur = blkPool[that.pid];
        CMT_IDM.rmId(cur._id);
        restack(cur);
        blk_count--;
        _.body.removeChild(blkPool[cur._id]);
        delete blkPool[cur._id];
        hide_conf();
    });
    setMovable(node);
    node.addEventListener("dblclick",function(event){
        edit_obj = event.currentTarget;
        $('opt_panel').style.visibility = 'visible';
        $('opt_panel_tr').value = event.currentTarget.childNodes[1].innerHTML;
    })
    _.body.appendChild(node);

    node.style.zIndex = blk_count;
}
function hide_conf(){
    edit_obj = {};
    $('pal').style.visibility = 'hidden';
    $('opt_panel').style.visibility = 'hidden';
}
function down(evt){
    evt.currentTarget.c_down = 1;
    flag = 1;
    var cur = evt.currentTarget;
    restack(cur);
    cur.style.zIndex = blk_count.toString();
};

function up(evt){
    evt.currentTarget.c_down = 0;
    flag = 0;
};

function move(evt){
    var obj = evt.currentTarget;
    var moveX = evt.movementX || evt.mozMovementX;
    var moveY = evt.movementY || evt.mozMovementY;
    var down = obj.c_down;

    if(typeof down =='number' && down == 1){
        obj.style.left = (obj.getBoundingClientRect().left+moveX)+"px";
        obj.style.top = (obj.getBoundingClientRect().top+moveY)+"px";
    }
};

function $(id){
    return document.getElementById(id);
}

function panel_toggle(){
    var v = $('pal').style.visibility;
    if(v!='visible') $('pal').style.visibility = 'visible';
    else $('pal').style.visibility = 'hidden';
}
function move_stop_prop(evt){
    evt.stopPropagation();
}
function restack(cur){
    var cval = parseInt(cur.style.zIndex);
    var lst = _.getElementsByClassName('rblk');
    for(var it=0;it<=blk_count;it++){
        var el = lst[it];
        var val = parseInt(el.style.zIndex);
        if(!isNaN(val) && val>cval) el.style.zIndex=(val-1).toString();
    }
}
function output(){
    var content = {};
    var lst = _.getElementsByClassName('rblk');
    for(var it=0;it<=blk_count;it++){
        content[it] = lst[it].children[1].innerHTML;
    }
    $('output').innerHTML = JSON.stringify(content)
}
