var tmp = "HI";
var flag = 0;
var _ = document;
var edit_obj = {};

function changeclr(event){
    if(edit_obj.style === undefined) return;
    edit_obj.style["border-color"] = showcolor();
};
function save(event){
    if(Object.keys(edit_obj).length==0) return;
    edit_obj.childNodes[0].nodeValue = $('opt_panel_tr').value;
}
function add(){
    var node = _.createElement("div");
    node.innerHTML = 'bye';
    node.className = 'rblk';
    node.addEventListener("mousedown",down);
    node.addEventListener("mouseup",up);
    node.addEventListener("mousemove",move);
    node.addEventListener("mouseleave",up);
    node.addEventListener("dblclick",function(event){
        edit_obj = event.currentTarget;
        console.log('dblclick');
        $('opt_panel').style.visibility = 'visible';
        $('opt_panel_tr').value = event.currentTarget.childNodes[0].nodeValue;
    })
    _.body.appendChild(node);

    var btn = _.createElement("button");
    btn.setAttribute('type','button');
    btn.setAttribute('class','top_right');
    btn.addEventListener("click",function(event){
        var that = event.currentTarget;
        var cur = that.parentNode;
        var par = cur.parentNode;
        par.removeChild(cur);
    });
    var btext = _.createTextNode('\u2715');
    btn.appendChild(btext);
    node.appendChild(btn);
}
function down(evt){
    evt.currentTarget.c_down = 1;
    flag = 1;

};

function up(evt){
    evt.currentTarget.c_down = 0;
    flag = 0;
};

function move(evt){
    //$('demo').innerHTML = $('test').getBoundingClientRect().left;
    //if(flag==1) $('test').style.left = $('test').getBoundingClientRect().left+evt.movementX+"px";
    //if(flag==1) $('test').style.top = $('test').getBoundingClientRect().top+evt.movementY+"px";
    var obj = evt.currentTarget;
    var down = obj.c_down;
    if(typeof down =='number' && down == 1){
        obj.style.left = obj.getBoundingClientRect().left+evt.movementX+"px";
        obj.style.top = obj.getBoundingClientRect().top+evt.movementY+"px";
    }
    //console.log("moving");
    //console.log(evt.currentTarget);
};

function $(id){
    return document.getElementById(id);
}

function panel_toggle(){
    var v = $('pal').style.visibility;
    if(v!='visible') $('pal').style.visibility = 'visible';
    else $('pal').style.visibility = 'hidden';
}
