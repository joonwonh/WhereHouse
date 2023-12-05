const content = document.querySelector('#first_introduce');

function animationWhendisplayed() {
  window.addEventListner('scroll', () => {
    if (window.innerHeight > content.getBoundingClientRect().top) {
      content.classList.add('on');
    }
  })
}

animationWhendisplayed();