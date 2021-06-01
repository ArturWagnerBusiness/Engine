function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, x, y, width, height;
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        x = elmnt.offsetLeft - pos1;
        y = elmnt.offsetTop - pos2;
        width = elmnt.offsetWidth;
        height = elmnt.offsetHeight;
        if (x < 0) {
            x = 0;
        }
        else if (x > window.outerWidth - width) {
            x = window.outerWidth - width;
        }
        ;
        if (y < 30) {
            y = 30;
        }
        else if (y > window.outerHeight - height) {
            y = window.outerHeight - height;
        }
        ;
        elmnt.style.top = y + "px";
        elmnt.style.left = x + "px";
    }
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
    $("#" + elmnt.id + ">.drag-header>.title").mousedown(dragMouseDown);
}
