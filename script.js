'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Nguyen Thanh Duy',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1911,
};

const account2 = {
  owner: 'dev',
  movements: [5000, 3400, -150, -790, 6210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Jonas',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Jonas Schmedtmann Jessica Davis Steven Thomas Williams Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  //copy movements nếu sort
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      i + ' '
    } ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${movement}</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov, i) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcSummaryBank = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur, i) => acc + cur, 0);
  labelSumIn.textContent = `${incomes.toFixed(0)} €`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur, i) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(0)} €`;
  //each time deposite to the bank account
  // Then bank give yout interest/ money
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur, i) => acc + cur, 0);
  labelSumInterest.textContent = `${interest.toFixed(0)} €`;
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
  displayMovements(acc.movements);
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
    currentAccount.movements.push(amount);
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
  displayMovements(currentAccount.movements, !isSort);
  isSort = !isSort;
});
