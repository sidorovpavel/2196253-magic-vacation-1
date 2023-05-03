import Swiper from "swiper";
import {ThemeColor} from "./page";

export default () => {
  let storySlider;
  let sliderContainer = document.getElementById(`story`);
  const mobileBackgroundImages = [
    `url("img/slide1.jpg"), linear-gradient(180deg, rgba(83, 65, 118, 0) 0%, #523E75 16.85%)`,
    `url("img/slide1.jpg"), linear-gradient(180deg, rgba(83, 65, 118, 0) 0%, #523E75 16.85%)`,
    `url("img/slide2.jpg"), linear-gradient(180deg, rgba(45, 54, 179, 0) 0%, #2A34B0 16.85%)`,
    `url("img/slide2.jpg"), linear-gradient(180deg, rgba(45, 54, 179, 0) 0%, #2A34B0 16.85%)`,
    `url("img/slide3.jpg"), linear-gradient(180deg, rgba(92, 138, 198, 0) 0%, #5183C4 16.85%)`,
    `url("img/slide3.jpg"), linear-gradient(180deg, rgba(92, 138, 198, 0) 0%, #5183C4 16.85%)`,
    `url("img/slide4.jpg"), linear-gradient(180deg, rgba(45, 39, 63, 0) 0%, #2F2A42 16.85%)`,
    `url("img/slide4.jpg"), linear-gradient(180deg, rgba(45, 39, 63, 0) 0%, #2F2A42 16.85%)`
  ];
  const backgroundImages = [
    `url("img/slide1.jpg")`,
    `url("img/slide1.jpg")`,
    `url("img/slide2.jpg")`,
    `url("img/slide2.jpg")`,
    `url("img/slide3.jpg")`,
    `url("img/slide3.jpg")`,
    `url("img/slide4.jpg")`,
    `url("img/slide4.jpg")`
  ];

  const themes = [
    ThemeColor.PURPLE,
    ThemeColor.PURPLE,
    ThemeColor.BLUE,
    ThemeColor.BLUE,
    ThemeColor.BLUE_DARK,
    ThemeColor.BLUE_DARK,
    ThemeColor.PURPLE_DARK,
    ThemeColor.PURPLE_DARK,
  ];

  sliderContainer.style.backgroundImage = mobileBackgroundImages[0];

  const setSlider = function () {
    if (((window.innerWidth / window.innerHeight) < 1) || window.innerWidth < 769) {
      storySlider = new Swiper(`.js-slider`, {
        pagination: {
          el: `.swiper-pagination`,
          type: `bullets`
        },
        keyboard: {
          enabled: true
        },
        on: {
          slideChange: () => {
            sliderContainer.style.backgroundImage = mobileBackgroundImages[storySlider.activeIndex];
          },
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    } else {
      storySlider = new Swiper(`.js-slider`, {
        slidesPerView: 2,
        slidesPerGroup: 2,
        pagination: {
          el: `.swiper-pagination`,
          type: `fraction`
        },
        navigation: {
          nextEl: `.js-control-next`,
          prevEl: `.js-control-prev`,
        },
        keyboard: {
          enabled: true
        },
        on: {
          slideChange: () => {
            sliderContainer.style.backgroundImage = backgroundImages[storySlider.activeIndex];
            document.body.dispatchEvent(
                new CustomEvent(`themeChange`, {detail: {theme: themes[storySlider.activeIndex]}})
            );
          },
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    }
  };

  window.addEventListener(`resize`, function () {
    if (storySlider) {
      storySlider.destroy();
    }
    setSlider();
  });

  setSlider();
};
