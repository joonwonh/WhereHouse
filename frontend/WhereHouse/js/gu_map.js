window.onload = function () {

    var showBtn = document.getElementById("showBtn");

    showBtn.addEventListener("click", openWindow)

    var container = document.getElementById("map");
    var options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
    };

    var map = new kakao.maps.Map(container, options);

    //패널 열고 닫기
    var info = document.querySelector("#information");
    var func = document.querySelector("#btn");

    func.addEventListener("click", panelFunc);

    function panelFunc() {
        if (info.style.left == "0px") {
            info.style.left = "-333px";
            func.innerText = "▶";
        } else {
            info.style.left = "0px";
            func.innerText = "◀";
        }
    }
}

function openWindow() {
    window.open('detail_window.html', 'detail_window',
        "top=10, left=10, width=500, height=600, status=no, menubar=no, toolbar=no, resizable=no, location=no");
}