window.onload = function () {
  //이미지 opacity
  let observer = new IntersectionObserver((e) => {
    e.forEach((content) => {
      if (content.isIntersecting) {
        content.target.style.opacity = 1;
      }
    })
  })
  let img = document.querySelectorAll(".ani_left_to_right");
  observer.observe(img[0]); // html요소 감시
  observer.observe(img[1]);
  observer.observe(img[2]);
  observer.observe(img[3]);
  observer.observe(img[4]);
  observer.observe(img[5]);


  // 이미지 아래서 위로
  let observers = new IntersectionObserver((e) => {
    e.forEach((content) => {
      if (content.isIntersecting) {
        content.target.style.marginTop = "0px";
      }
    })
  })
  let img_content = document.querySelectorAll(".img_content img");
  observers.observe(img_content[0]);  // html요소 감시
  observers.observe(img_content[1]);
  observers.observe(img_content[2]);
  observers.observe(img_content[3]);
  observers.observe(img_content[4]);
  observers.observe(img_content[5]);


  // 텍스트 opacity
  let observerse = new IntersectionObserver((e) => {
    e.forEach((content) => {
      if (content.isIntersecting) {
        content.target.style.opacity = 1;
      }
    })
  })
  let site_page_innerText = document.querySelectorAll(".site_page_innerText");
  observerse.observe(site_page_innerText[0]);  // html요소 감시
  observerse.observe(site_page_innerText[1]);
  observerse.observe(site_page_innerText[2]);
  observerse.observe(site_page_innerText[3]);
  observerse.observe(site_page_innerText[4]);
  observerse.observe(site_page_innerText[5]);


  // 상단 네비게이션 바 선택에 필요한 a 태그
  var btn_gu_map = document.getElementById("nav_btn_gu_map");
  var btn_house_rec = document.getElementById("nav_btn_house_rec");

  btn_gu_map.addEventListener("click", () => initStorage("gu_map"));
  btn_house_rec.addEventListener("click", () => initStorage("house_rec"));
  btn_rec.addEventListener("click", () => initStorage("house_rec"));


  // 추천 설명 창 번호 대로 숨기기
  var first_intro_btn = document.getElementById("first_intro_btn");
  var second_intro_btn = document.getElementById("second_intro_btn");
  var third_intro_btn = document.getElementById("third_intro_btn");

  var fourth_intro_btn = document.getElementById("fourth_intro_btn");
  var fifth_intro_btn = document.getElementById("fifth_intro_btn");
  var sixth_intro_btn = document.getElementById("sixth_intro_btn");

  var first_intro = document.getElementById("first_rec_intro");
  var second_intro = document.getElementById("second_rec_intro");
  var third_intro = document.getElementById("third_rec_intro");
  var fourth_intro = document.getElementById("fourth_rec_intro");
  var fifth_intro = document.getElementById("fifth_rec_intro");
  var sixth_intro = document.getElementById("sixth_rec_intro");

  first_intro_btn.addEventListener("click", () => { houseRecIntroduce("block", "none", "none", 1) });
  second_intro_btn.addEventListener("click", () => { houseRecIntroduce("none", "block", "none", 2) });
  third_intro_btn.addEventListener("click", () => { houseRecIntroduce("none", "none", "block", 3) });
  fourth_intro_btn.addEventListener("click", () => { mapIntroduce("block", "none", "none", 4) });
  fifth_intro_btn.addEventListener("click", () => { mapIntroduce("none", "block", "none", 5) });
  sixth_intro_btn.addEventListener("click", () => { mapIntroduce("none", "none", "block", 6) });

  function houseRecIntroduce(value1, value2, value3, sel) {
    first_intro.style.display = value1;
    second_intro.style.display = value2;
    third_intro.style.display = value3;
    first_intro_btn.style.border = sel === 1 ? "3px solid rgba(0,0,0,0.6)" : "none";
    second_intro_btn.style.border = sel === 2 ? "3px solid rgba(0,0,0,0.6)" : "none";
    third_intro_btn.style.border = sel === 3 ? "3px solid rgba(0,0,0,0.6)" : "none";
  }
  function mapIntroduce(value1, value2, value3, sel) {
    fourth_intro.style.display = value1;
    fifth_intro.style.display = value2;
    sixth_intro.style.display = value3;
    fourth_intro_btn.style.border = sel === 4 ? "3px solid rgba(0,0,0,0.6)" : "none";
    fifth_intro_btn.style.border = sel === 5 ? "3px solid rgba(0,0,0,0.6)" : "none";
    sixth_intro_btn.style.border = sel === 6 ? "3px solid rgba(0,0,0,0.6)" : "none";
  }
}

function initStorage(target) {
  localStorage.removeItem("target");
  localStorage.setItem("target", JSON.stringify(target));
}