window.onload = function () {
    var menu_suggest_icon = document.getElementById("menu_suggest_icon");
    var menu_gu_icon = document.getElementById("menu_gu_icon");
    var menu_detail_icon = document.getElementById("menu_detail_icon");

    var kakaoMap = document.getElementById("kakao_map");

    menu_suggest_icon.addEventListener("click", () => clickMenu(1));
    menu_gu_icon.addEventListener("click", () => clickMenu(2));
    menu_detail_icon.addEventListener("click", () => clickMenu(3));

    function clickMenu(sel) {
        menu_gu_icon.style.backgroundColor = "rgba(11, 94, 215, 1)";
        menu_detail_icon.style.backgroundColor = "rgba(11, 94, 215, 1)";
        menu_suggest_icon.style.backgroundColor = "rgba(11, 94, 215, 1)";

        if (sel === 1) {
            menu_suggest_icon.style.backgroundColor = "rgba(34, 34, 34, 0.3)";
            //추천 iframe 로직
            // kakaoMap.src = "pages/main.html";
        } else if (sel === 2) {
            menu_gu_icon.style.backgroundColor = "rgba(34, 34, 34, 0.3)";
            //구 iframe 로직
        } else if (sel === 3) {
            menu_detail_icon.style.backgroundColor = "rgba(34, 34, 34, 0.3)";
            //상세 지도 ifram 로직
        }
    }
}

