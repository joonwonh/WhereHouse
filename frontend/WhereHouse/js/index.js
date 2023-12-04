window.onload = function () {
    var menu_suggest_icon = document.getElementById("menu_suggest_icon");
    var menu_gu_icon = document.getElementById("menu_gu_icon");
    var menu_detail_icon = document.getElementById("menu_detail_icon");

    var iframeSection = document.getElementById("iframe_section");

    menu_suggest_icon.addEventListener("click", () => clickMenu(1));
    menu_gu_icon.addEventListener("click", () => clickMenu(2));
    menu_detail_icon.addEventListener("click", () => clickMenu(3));

    function clickMenu(sel) {
        menu_gu_icon.style.backgroundColor = "rgba(11, 94, 215, 1)";
        menu_detail_icon.style.backgroundColor = "rgba(11, 94, 215, 1)";
        menu_suggest_icon.style.backgroundColor = "rgba(11, 94, 215, 1)";

        if (sel === 1) {
            menu_suggest_icon.style.backgroundColor = "rgba(34, 34, 34, 0.3)";
            iframeSection.src = "pages/house_rec.html";
        } else if (sel === 2) {
            menu_gu_icon.style.backgroundColor = "rgba(34, 34, 34, 0.3)";
            iframeSection.src = "pages/main.html";
        } else if (sel === 3) {
            menu_detail_icon.style.backgroundColor = "rgba(34, 34, 34, 0.3)";
            //상세 지도 ifram 로직
        }
    }
}

