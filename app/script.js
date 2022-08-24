'use strict';
//make changed
// floor balance
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
import {
  formatCur,
  formatMovementDate,
  optionsDay,
  clearInputField,
} from './formatInternational.js';
import { accounts } from './data.js';
// Elements
const labelWelcome = document.querySelector('.welcome');
labelWelcome.onclick;
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnLogout = document.querySelector('.logout__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  //copy movements nếu sort
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(movement, acc.locale, acc.currency);
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      i + ' '
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov, i) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcSummaryBank = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur, i) => acc + cur, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur, i) => acc + cur, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );

  //each time deposite to the bank account
  // Then bank give yout interest/ money
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur, i) => acc + cur, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUserNames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      btnLogout.click();
    }

    // Decrease 1s
    time--;
  };

  // Set time (s)
  let time = 300;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};
createUserNames(accounts);

//event handles;
let currentAccount, timer;

const updateUI = function (acc) {
  //display movements
  displayMovements(acc);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcSummaryBank(acc);
  // // Timer
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
};
//event handle
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => inputLoginUsername.value === acc.username
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //dislayUI& welcome message
    labelWelcome.innerHTML = `Welcome back, <br>
    ${currentAccount.owner}`;
    containerApp.style.opacity = 100;
    //Create current Date & timer
    const now = new Date();
    //const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      optionsDay
    ).format(now);
    //updateUI
    updateUI(currentAccount);
    //display logout__btn and none display login
    btnLogout.style.display = 'block';
    btnLogin.style.display = 'none';
    inputLoginUsername.style.display = 'none';
    inputLoginPin.style.display = 'none';
  } else {
    //alert wrong information
    alert('Wrong username or pin');
  }
  //clear Input field
  clearInputField(inputLoginPin, inputLoginUsername);
});
const logOutAccount = function () {
  labelWelcome.innerHTML = `Log in to get started`;
  btnLogout.style.display = 'none';
  btnLogin.style.display = 'block';
  inputLoginUsername.style.display = 'block';
  inputLoginPin.style.display = 'block';
  containerApp.style.opacity = 0;
  if (timer) clearInterval(timer);
};
btnLogout.addEventListener('click', function (e) {
  e.preventDefault();
  logOutAccount();
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    console.log('trafic');

    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //updateUI
    updateUI(currentAccount);
  } else {
    alert('Wrong tranfer or not enough amount ');
  }
  clearInputField(inputTransferTo, inputTransferAmount);
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add movements
    currentAccount.movements.push(amount);

    //add loan date
    currentAccount.movementsDates.push(new Date().toISOString());
    //updateUI
    updateUI(currentAccount);
  } else {
    alert(`Amount must be less than 10 minus max movement`);
  }
  clearInputField(inputLoanAmount);
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount?.username &&
    inputClosePin.value == Number(currentAccount?.pin)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //delete account
    accounts.splice(index, 1);
    // Hide UI
    logOutAccount();

    // console.log(accounts);
  }
  clearInputField(inputClosePin, inputCloseUsername);
});
let isSort = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  //css clicked button sort
  if (isSort) {
    btnSort.style.backgroundColor = 'transparent';
  } else {
    btnSort.style.backgroundColor = '#ccc';
  }
  displayMovements(currentAccount, !isSort);
  isSort = !isSort;
});
