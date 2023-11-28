window.onload = function () {
    var menu_gu_icon = document.getElementById("menu_gu_icon");
    var menu_dong_icon = document.getElementById("menu_dong_icon");
    var menu_detail_icon = document.getElementById("menu_detail_icon");
    var menu_suggest_icon = document.getElementById("menu_suggest_icon");

    menu_gu_icon.addEventListener("click", () => clickMenu(1));
    menu_dong_icon.addEventListener("click", () => clickMenu(2));
    menu_detail_icon.addEventListener("click", () => clickMenu(3));
    menu_suggest_icon.addEventListener("click", () => clickMenu(4));

    function clickMenu(sel) {
        menu_gu_icon.style.backgroundColor = "rgba(11, 94, 215, 1)";
        menu_dong_icon.style.backgroundColor = "rgba(11, 94, 215, 1)";
        menu_detail_icon.style.backgroundColor = "rgba(11, 94, 215, 1)";
        menu_suggest_icon.style.backgroundColor = "rgba(11, 94, 215, 1)";

        if (sel === 1) {
            menu_gu_icon.style.backgroundColor = "rgba(34, 34, 34, 0.3)";
            //구 지도 ifram 변경 로직 추가
        } else if (sel === 2) {
            menu_dong_icon.style.backgroundColor = "rgba(34, 34, 34, 0.3)";
            //동 지도 ifram 변경 로직 추가
        } else if (sel === 3) {
            menu_detail_icon.style.backgroundColor = "rgba(34, 34, 34, 0.3)";
            //상세 지도 ifram 변경 로직 추가
        } else if (sel === 4) {
            menu_suggest_icon.style.backgroundColor = "rgba(34, 34, 34, 0.3)";
            //주거지 추천 ifram 변경 로직 추가
        }
    }
}

