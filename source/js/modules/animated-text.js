export default class AnimatedText {
  constructor(element,
      duration,
      classForActivate,
      property,
      delay = 0,
      timeOffsetDelta = 20) {
    this.element = element;
    this.duration = duration;
    this.classForActivate = classForActivate;
    this.property = property;
    this.delay = delay;
    this.timeOffsetDelta = timeOffsetDelta;

    this.prepareText();
  }

  prepareText() {
    if (!this.element) {
      return;
    }

    let pattern = /\S+/g;
    const textArray = this.element.textContent.match(pattern);

    const {length} = textArray;
    const content = textArray.reduce((fragmentParent, word, index) => {
      const wordElement = Array.from(word).reduce(
          (fragment, letter, indexOfLetter) => {
            fragment.appendChild(this.createElement(letter, indexOfLetter));
            return fragment;
          },
          document.createDocumentFragment()
      );

      const wordContainer = document.createElement(`span`);

      wordContainer.appendChild(wordElement);
      fragmentParent.appendChild(wordContainer);

      if (index < length - 1) {
        fragmentParent.appendChild(document.createTextNode(` `));
      }

      this.delay += 100;

      return fragmentParent;
    }, document.createDocumentFragment());

    this.element.innerHTML = ``;
    this.element.appendChild(content);
  }

  createElement(letter, indexOfLetter) {
    const span = document.createElement(`span`);
    const timeOffset = this.generateTimeOffset(indexOfLetter);

    span.textContent = letter;
    span.style.transition = this.getTransition(timeOffset);

    return span;
  }

  getTransition(timeOffset) {
    return `${this.property} ${this.duration}ms ease ${this.delay + timeOffset}ms`;
  }

  generateTimeOffset(index) {
    return Math.round(50 * Math.sin(1.5 * index + 2) + Math.random() * this.timeOffsetDelta);
  }
}
