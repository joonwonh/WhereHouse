window.onload = function () {
  // 이미지 opacity
  let observer = new IntersectionObserver((e) => {
    e.forEach((content) => {
      if (content.isIntersecting) {
        content.target.style.opacity = 1;
      }
    })
  })
  let img = document.querySelectorAll("#ani_left_to_right");
  observer.observe(img[0]); // html요소 감시
  observer.observe(img[1]);
  observer.observe(img[2]);
  observer.observe(img[3]);
  observer.observe(img[4]);

  // 이미지 아래서 위로
  let observers = new IntersectionObserver((e) => {
    e.forEach((content) => {
      if (content.isIntersecting) {
        content.target.style.marginTop = "0px";
      }
    })
  })
  let img_content = document.querySelectorAll("#img_content");
  observers.observe(img_content[0]);  // html요소 감시
  observers.observe(img_content[1]);
  observers.observe(img_content[2]);
  observers.observe(img_content[3]);
  observers.observe(img_content[4]);

  // 텍스트 opacity
  let observerse = new IntersectionObserver((e) => {
    e.forEach((content) => {
      if (content.isIntersecting) {
        content.target.style.opacity = 1;
      }
    })
  })
  let site_page_innerText = document.querySelectorAll("#site_page_innerText");
  observerse.observe(site_page_innerText[0]);  // html요소 감시
  observerse.observe(site_page_innerText[1]);
  observerse.observe(site_page_innerText[2]);
  observerse.observe(site_page_innerText[3]);
  observerse.observe(site_page_innerText[4]);

  // 상단 네비게이션 바 선택에 필요한 a 태그
  var btn_gu_map = document.getElementById("nav_btn_gu_map");
  var btn_house_rec = document.getElementById("nav_btn_house_rec");

  btn_gu_map.addEventListener("click", () => initStorage("gu_map"));
  btn_house_rec.addEventListener("click", () => initStorage("house_rec"));
  btn_rec.addEventListener("click", () => initStorage("house_rec"));
}

function initStorage(target) {
  localStorage.removeItem("target");
  localStorage.setItem("target", JSON.stringify(target));
}

