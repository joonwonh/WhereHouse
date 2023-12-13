window.onload = function () {
  var first_page = document.getElementById("first_page");
  console.log(first_page);
  var side_menu = document.getElementById("sidenav");

  // 텍스트 opacity
  let sidebar = new IntersectionObserver((e) => {
    e.forEach((content) => {
      if (content.isIntersecting) {
        if (content.target == first_page) {
          console.log(content.target);
          side_menu.style.opacity = 1;
        } else {
          content.target.style.opacity = 1;
        }
      }
    });
  })
  sidebar.observe(first_page);


  // 이미지 opacity
  let observ = new IntersectionObserver((e) => {
    e.forEach((content) => {
      if (content.isIntersecting) {
        content.target.style.opacity = 1;
      }
    })
  })
  let first_text = document.querySelectorAll("#first_text");
  observ.observe(first_text[0]);  // html요소 감시


  // 배경색 어둡게 바꾸기
  let observer = new IntersectionObserver((e) => {
    e.forEach((content) => {
      if (content.isIntersecting) {
        content.target.style.backgroundColor = 'white';
      }
    })
  })
  let img = document.querySelectorAll(".bg_control");
  observer.observe(img[0]); // html요소 감시



  // 이미지 opacity
  let observers = new IntersectionObserver((e) => {
    e.forEach((content) => {
      if (content.isIntersecting) {
        content.target.style.opacity = 1;
      }
    })
  })
  let img_content = document.querySelectorAll(".img_section img");
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
  let site_page_innerText = document.querySelectorAll(".img_text");
  observerse.observe(site_page_innerText[0]);  // html요소 감시
  observerse.observe(site_page_innerText[1]);
  observerse.observe(site_page_innerText[2]);
  observerse.observe(site_page_innerText[3]);
  observerse.observe(site_page_innerText[4]);
}