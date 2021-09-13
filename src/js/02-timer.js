import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const qs = query => document.querySelector(query);
const btnStart = qs('[data-start]');
const btnStop = qs('[data-stop]');
const day = qs('[data-days]');
const hour = qs('[data-hours]');
const minute = qs('[data-minutes]');
const second = qs('[data-seconds]');
let countdownReset = true; // must to stop last countdown, to select new date to countdown
let id;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const now = () => new Date().getTime();
    const selectedTime = selectedDates[0].getTime();
    const differenceInTime = () => selectedTime - now();
    const isFuture = () => differenceInTime() > 0;
    console.log(selectedDates);

    if (isFuture() && countdownReset) {
      // if data is in future and no countdown
      Notiflix.Notify.success('Press start button');
      btnStart.addEventListener('click', countdown);
      btnStop.addEventListener('click', countdownRemove);

      enabledBtn(btnStart);
    } else if (!countdownReset) {
      // Need to reset countdown
      Notiflix.Notify.failure('To start a new countdown, you must terminate last one!');

      disabledBtn(btnStart);
      enabledBtn(btnStop);
    } else if (!isFuture()) {
      Notiflix.Notify.failure('Please choose a date in the future');
    }

    function countdown() {
      countdownReset = false; // countdwon start
      id = setInterval(() => {
        const { days, hours, minutes, seconds } = convertMs(differenceInTime());
        if (days >= 0 && hours >= 0 && minutes >= 0 && seconds >= 0) {
          setTime({ days, hours, minutes, seconds });
        } else {
          Notiflix.Notify.success('Choose new date!');
          countdownRemove();
        }
      }, 1 * 1000);

      disabledBtn(btnStart);
      enabledBtn(btnStop);
    }

    function countdownRemove() {
      countdownReset = true;
      clearInterval(id);
      btnStart.removeEventListener('click', countdown);
      setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });

      disabledBtn(btnStop);
    }
  },
};

// Off butons on start
disabledBtn(btnStart);
disabledBtn(btnStop);

flatpickr('#date-selector', options);

function disabledBtn(btn) {
  btn.setAttribute('disabled', '');
}

function enabledBtn(btn) {
  btn.removeAttribute('disabled');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function setTime({ days, hours, minutes, seconds }) {
  const minLength = 2;
  day.innerText = addLeadingZero(days, minLength);
  hour.innerText = addLeadingZero(hours, minLength);
  minute.innerText = addLeadingZero(minutes, minLength);
  second.innerText = addLeadingZero(seconds, minLength);
}

function addLeadingZero(num, targetLength) {
  return num.toString().padStart(targetLength, 0);
}
