const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const statusEl = document.getElementById('status');

startBtn.addEventListener('click', async () => {
  const authorId = document.getElementById('authorId').value.trim();
  const delay = parseInt(document.getElementById('delay').value, 10);

  if (!authorId) {
    statusEl.textContent = 'Please enter your Author ID.';
    return;
  }

  startBtn.disabled = true;
  stopBtn.style.display = 'block';
  statusEl.textContent = 'Starting...';

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: startDeletion,
    args: [authorId, delay]
  });
});

stopBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => { window.__dmdStop = true; }
  });
  statusEl.textContent = 'Stopped.';
  startBtn.disabled = false;
  stopBtn.style.display = 'none';
});

function startDeletion(authorId, delay) {
  window.__dmdStop = false;
  window.dispatchEvent(new CustomEvent('dmd:start', { detail: { authorId, delay } }));
}
