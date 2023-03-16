export default () => {
  function ready() {
    document.body.classList.add(`dom-loaded`);
  }

  document.addEventListener(`DOMContentLoaded`, ready);
};
