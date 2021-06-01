function dragElement(elmnt: any) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, x, y, width, height;
    function dragMouseDown(e: any) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }
    function elementDrag(e: any) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        x = elmnt.offsetLeft - pos1;
        y = elmnt.offsetTop - pos2;
        width = elmnt.offsetWidth;
        height = elmnt.offsetHeight;
        if(x<0){x=0}
        else if(x>window.outerWidth-width){x=window.outerWidth-width};
        if(y<30){y=30}
        else if(y>window.outerHeight-height){y=window.outerHeight-height};
        // set the element's new position:
        elmnt.style.top = y + "px";
        elmnt.style.left = x + "px";
    }
    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
    $("#"+elmnt.id+">.drag-header>.title").mousedown(dragMouseDown);
}