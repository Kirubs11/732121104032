const windowPrev = document.querySelector('.window-prev');
const windowCurr = document.querySelector('.window-curr');
const numbers = document.querySelectorAll('.number');
const equals = document.querySelector('.equals');

const API_URL = 'http://20.244.56.144/test/';
const WINDOW_SIZE = 10;

const updateNumbers = async (numbers) => {
  const promises = Array.from(numbers).map((number) =>
    fetch(`${API_URL}${number.value}`)
      .then((response) => response.json())
      .catch(() => [])
  );

  const results = await Promise.all(promises);
  const numbersData = results.flatMap((result) => result);

  updateWindow(numbersData);
};

const updateWindow = (numbers) => {
  const prevState = circularBuffer.getPreviousState();
  const currState = circularBuffer.getCurrentState();

  windowPrev.textContent = prevState.join(', ');
  windowCurr.textContent = currState.join(', ');

  const avg = calculateAverage(currState);
  document.querySelector('h1').textContent += `: ${avg.toFixed(2)}`;
};

const calculateAverage = (numbers) => {
  if (numbers.length === 0) {
    return 0;
  }
  return numbers.reduce((acc, current) => acc + current, 0) / numbers.length;
};

const circularBuffer = new CircularBuffer(WINDOW_SIZE);

numbers.forEach((number) => {
  number.addEventListener('click', () => {
    updateNumbers([number]);
  });
});

equals.addEventListener('click', () => {
  updateNumbers(numbers);
});

class CircularBuffer {
  constructor(size) {
    this.size = size;
    this.buffer = [];
  }

  add(number) {
    if (this.buffer.length === this.size) {
      this.buffer.shift();
    }
    this.buffer.push(number);
  }

  getPreviousState() {
    return [...this.buffer];
  }

  getCurrentState() {
    return [...this.buffer];
  }
}