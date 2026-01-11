(function() {
  const UNLOCK_DURATION = 15 * 60 * 1000;
  const unlockUntil = localStorage.getItem('friction-unlock');

  if (unlockUntil && Date.now() < parseInt(unlockUntil)) {
    return;
  }

  const targetNumber = Math.floor(Math.random() * 10) + 1;
  let canGuess = true;

  const overlay = document.createElement('div');
  overlay.id = 'friction-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:sans-serif;';
  overlay.innerHTML = `
    <p>Guess a number between 1 and 10</p>
    <input type="number" id="guess-input" min="1" max="10">
    <p id="message"></p>
  `;

  document.documentElement.appendChild(overlay);

  const input = document.getElementById('guess-input');
  const message = document.getElementById('message');

  function startCooldown() {
    canGuess = false;
    input.disabled = true;
    let seconds = 15;
    message.textContent = `Wait ${seconds}s`;

    const interval = setInterval(() => {
      seconds--;
      if (seconds > 0) {
        message.textContent = `Wait ${seconds}s`;
      } else {
        clearInterval(interval);
        message.textContent = '';
        canGuess = true;
        input.disabled = false;
        input.focus();
      }
    }, 1000);
  }

  input.addEventListener('keypress', (e) => {
    if (e.key !== 'Enter' || !canGuess) return;
    const guess = parseInt(input.value);
    if (guess === targetNumber) {
      localStorage.setItem('friction-unlock', Date.now() + UNLOCK_DURATION);
      overlay.remove();
    } else {
      input.value = '';
      startCooldown();
    }
  });
})();
