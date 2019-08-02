

function domContain(dom, child) {
    if (dom === child)
        return true;
    if (!child)
        return false;
    return domContain(dom, child.parentElement);
}
//添加一个发生在dom元素外部的事件
function addOutterEventListener(dom, name, callback) {

    return document.body.addEventListener(name, e => {
        e = e || event;
        //判断event是否发生在dom内部
        if (!domContain(dom, e.target)) {
            if (callback)
                callback(dom);
        }
    });
}


export {
    addOutterEventListener
}