(function() {
  const UNLOCK_DURATION = 15 * 60 * 1000;
  const unlockUntil = localStorage.getItem('friction-unlock');

  if (unlockUntil && Date.now() < parseInt(unlockUntil)) {
    showTimer(parseInt(unlockUntil));
    return;
  }

  function showTimer(until) {
    const timer = document.createElement('div');
    timer.style.cssText = 'position:fixed;bottom:10px;right:10px;padding:6px 12px;background:rgba(0,0,0,0.7);color:#888;font-size:12px;font-family:sans-serif;border-radius:4px;z-index:2147483647;';
    document.documentElement.appendChild(timer);

    function update() {
      const remaining = Math.max(0, until - Date.now());
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      timer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
      if (remaining <= 0) timer.remove();
    }
    update();
    setInterval(update, 1000);
  }

  const targetNumber = Math.floor(Math.random() * 10) + 1;
  let canGuess = true;

  const overlay = document.createElement('div');
  overlay.id = 'friction-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:sans-serif;';
  overlay.innerHTML = `
    <p style="margin-bottom:20px;font-size:18px;">Guess a number between 1 and 10</p>
    <input type="number" id="guess-input" min="1" max="10" style="width:100px;padding:12px;font-size:24px;text-align:center;border:none;border-radius:8px;background:#222;color:#fff;outline:none;">
    <p id="message" style="margin-top:20px;height:20px;color:#888;"></p>
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
      const unlockTime = Date.now() + UNLOCK_DURATION;
      localStorage.setItem('friction-unlock', unlockTime);
      overlay.remove();
      showTimer(unlockTime);
    } else {
      input.value = '';
      startCooldown();
    }
  });
})();
