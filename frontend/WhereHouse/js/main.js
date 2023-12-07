var menu_home;
var menu_suggest_icon;
var menu_gu_icon;
var menu_detail_icon;
var iframeSection;

window.onload = function () {
    menu_home = document.getElementById("menu_home");
    menu_suggest_icon = document.getElementById("menu_suggest_icon");
    menu_gu_icon = document.getElementById("menu_gu_icon");
    menu_detail_icon = document.getElementById("menu_detail_icon");
    iframeSection = document.getElementById("iframe_section");
    // iframe 초기 값 설정
    initIframe();

    menu_home.addEventListener("click", function () {
        window.open("../index.html", "_parent");
    })

    menu_suggest_icon.addEventListener("click", () => clickMenu(1));
    menu_gu_icon.addEventListener("click", () => clickMenu(2));
    menu_detail_icon.addEventListener("click", () => clickMenu(3));

    function clickMenu(sel) {
        menu_gu_icon.style.backgroundColor = "rgba(11, 94, 215, 1)";
        menu_detail_icon.style.backgroundColor = "rgba(11, 94, 215, 1)";
        menu_suggest_icon.style.backgroundColor = "rgba(11, 94, 215, 1)";

        if (sel === 1) {
            menu_suggest_icon.style.backgroundColor = "rgba(34, 34, 34, 0.3)";
            iframeSection.src = "house_rec.html";
        } else if (sel === 2) {
            menu_gu_icon.style.backgroundColor = "rgba(34, 34, 34, 0.3)";
            iframeSection.src = "gu_map.html";
        } else if (sel === 3) {
            menu_detail_icon.style.backgroundColor = "rgba(34, 34, 34, 0.3)";
            //상세 지도 ifram 로직
        }
    }
}

function initIframe() {
    // 로컬스토리지에 있는 값 확인 후 iframe화면 띄워주기
    var iframe_target = JSON.parse(localStorage.getItem("target"));
    menu_gu_icon.style.backgroundColor = "rgba(11, 94, 215, 1)";
    menu_detail_icon.style.backgroundColor = "rgba(11, 94, 215, 1)";
    menu_suggest_icon.style.backgroundColor = "rgba(11, 94, 215, 1)";

    if (iframe_target === "house_rec") {
        menu_suggest_icon.style.backgroundColor = "rgba(34, 34, 34, 0.3)";
    } else if (iframe_target === "gu_map") {
        menu_gu_icon.style.backgroundColor = "rgba(34, 34, 34, 0.3)";
    } else if (iframe_target === "detail_map") {
        menu_detail_icon.style.backgroundColor = "rgba(34, 34, 34, 0.3)";
    }
    iframeSection.src = iframe_target + ".html";
}

