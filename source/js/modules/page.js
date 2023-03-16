export default () => {
  function ready() {
    document.body.classList.add(`ready`);
  }

  document.addEventListener(`DOMContentLoaded`, ready);
};
