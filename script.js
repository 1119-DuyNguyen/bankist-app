'use strict';
//make changed
// floor balance
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Nguyen Thanh Duy',
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1911,
  currency: 'VND',
  locale: 'vi-VN', // de-DE
};

const account2 = {
  owner: 'dev',
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  movements: [5000, 3400, -150, -790, 6210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account3 = {
  owner: 'Jonas',
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Jonas Schmedtmann Jessica Davis Steven Thomas Williams Sarah Smith',
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3, account4];

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
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  //copy movements nếu sort
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  const options = {
    style: 'currency',
    unit: 'celsius',
    currency: 'EUR',
    // useGrouping: false, // khoảng trống giữa các kí tự in ra
  };

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

createUserNames(accounts);
let currentAccount;

const updateUI = function (acc) {
  //display movements
  displayMovements(acc);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcSummaryBank(acc);
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
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      weekday: 'long',
    };
    //const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
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
  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();
  inputLoginUsername.blur();
});
const logOutAccount = function () {
  labelWelcome.innerHTML = `Log in to get started`;
  btnLogout.style.display = 'none';
  btnLogin.style.display = 'block';
  inputLoginUsername.style.display = 'block';
  inputLoginPin.style.display = 'block';
  containerApp.style.opacity = 0;
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
  inputTransferAmount.value = inputTransferTo.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add movements
    currentAccount.movements.push(amount);
    //add loan date
    currentAccount.movements.push(new Date().toISOString());
    //updateUI
    updateUI(currentAccount);
  } else {
    alert(`Amount must be less than 10 minus max movement`);
  }
  inputLoanAmount.value = '';
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
  inputCloseUsername.value = inputClosePin.value = '';
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
