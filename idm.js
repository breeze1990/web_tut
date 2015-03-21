var CMT_IDM = {};
CMT_IDM.MAX_COUNT = 100;
CMT_IDM.que = [];
CMT_IDM.cur_max = 0;

CMT_IDM.getNext = function(){
    if (CMT_IDM.que.length > 0){
        return CMT_IDM.que.shift();
    }
    CMT_IDM.cur_max += 1;
    return CMT_IDM.cur_max;
};

CMT_IDM.rmId = function(id){
    var pos = CMT_IDM.find(id,CMT_IDM.que);
    if(CMT_IDM.que[pos] == id || id>CMT_IDM.cur_max) {
        console.error('id error');
        return;
    }
    CMT_IDM.que.splice(pos,0,id);
    while(CMT_IDM.que.length>0 && CMT_IDM.que[CMT_IDM.que.length-1] == CMT_IDM.cur_max){
        CMT_IDM.cur_max -= 1;
        CMT_IDM.que.pop();
    }
};

CMT_IDM.find = function(id,arr){
    var l = 0;
    var r = arr.length-1;
    if(arr[r]<id) return r+1;
    while(l<r){
        var m = (l+r)/2>>0;
        if(arr[m]>=id) r = m;
        else l = m+1;
    }
    return r;
};
