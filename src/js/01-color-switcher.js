const qs = query => document.querySelector(query);
const body = qs('body');
const btnStart = qs('[data-start]');
const btnStop = qs('[data-stop]');
let idIterval = 0;

disabledBtn(btnStop); // stop btn - disable on beginning
btnStart.addEventListener('click', changeBodyColor);

function changeBodyColor() {
  disabledBtn(btnStart);
  enabledBtn(btnStop);
  idIterval = setInterval(() => {
    body.style.backgroundColor = getRandomHexColor();
  }, 1 * 1000);
}

btnStop.addEventListener('click', stopColorChange);

function stopColorChange() {
  enabledBtn(btnStart);
  disabledBtn(btnStop);
  clearInterval(idIterval);
}

function disabledBtn(btn) {
  btn.setAttribute('disabled', '');
}

function enabledBtn(btn) {
  btn.removeAttribute('disabled');
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
