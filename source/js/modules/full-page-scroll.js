import throttle from 'lodash/throttle';
import AnimatedText from "./animated-text";

const ScreenNumber = {
  TOP: 0,
  STORY: 1,
  PRIZES: 2,
  RULES: 3,
  GAME: 4,
};

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 1000;
    this.CURTAIN_TIMEOUT = 500;
    this.scrollFlag = true;
    this.timeout = null;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);
    this.curtainElement = document.querySelector(`.screen__curtain`);

    this.activeScreen = 0;
    this.prevScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.addAnimationText();
    this.onUrlHashChanged();
  }

  onScroll(evt) {
    if (this.scrollFlag) {
      this.reCalculateActiveScreenPosition(evt.deltaY);
      const currentPosition = this.activeScreen;
      if (currentPosition !== this.activeScreen) {
        this.changePageDisplay();
      }
    }
    this.scrollFlag = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.THROTTLE_TIMEOUT);
  }

  onUrlHashChanged() {
    this.prevScreen = this.activeScreen;
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeTransitionsForDisclaimer();
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }


  changeTransitionsForDisclaimer() {
    if (this.prevScreen === ScreenNumber.PRIZES && this.activeScreen === ScreenNumber.RULES) {
      const disclaimerPrizes = document.querySelector(`.screen--prizes .js-footer`);
      const disclaimerRules = document.querySelector(`.screen--rules .screen__disclaimer`);
      disclaimerPrizes.classList.add(`no-transform`);
      disclaimerRules.classList.add(`no-transform`);
      setTimeout(() => {
        disclaimerPrizes.classList.remove(`no-transform`);
        disclaimerRules.classList.remove(`no-transform`);
      }, 600);
    }
  }

  changeVisibilityDisplay() {
    const isStoryToPrizes = this.prevScreen === ScreenNumber.STORY && this.activeScreen === ScreenNumber.PRIZES;
    let timeout = 0;

    this.curtainElement.classList.remove(`screen__curtain_active`);
    if (isStoryToPrizes) {
      this.curtainElement.classList.add(`screen__curtain_active`);
      timeout = this.CURTAIN_TIMEOUT;
    }

    setTimeout(() => {
      this.screenElements.forEach((screen) => {
        screen.classList.add(`screen--hidden`);
        screen.classList.remove(`active`);
      });
      this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
      setTimeout(() => {
        this.screenElements[this.activeScreen].classList.add(`active`);
      }, 100);
    }, timeout);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }

  addAnimationText() {
    const items = document.querySelectorAll(`.animated-text`);
    Array.from(items).forEach((item, index) =>
      new AnimatedText(
          item,
          500,
          `.active`,
          `transform`,
          100 * index
      )
    );

  }
}
