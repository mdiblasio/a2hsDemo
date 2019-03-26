let fromPWA = document.getElementById('fromPWA');
let beforeinstallpromptSpan = document.getElementById('beforeinstallprompt');
let promtResult = document.getElementById('promtResult');

let a2hs = document.getElementById('a2hs');
let installSWBtn = document.getElementById('installSW');
let swStatus = document.getElementById('swStatus');

installSWBtn.addEventListener('click', installSW);
a2hs.addEventListener('click', addToHomescreen);

const log = console.log;

function addToHomescreen() {
  log(`Adding to homescreen`);

  // Show the prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        promtResult.innerText = "accepted";
        // send accepted event to GA
        ga('send', 'event', 'A2HS', 'accepted');
      } else {
        promtResult.innerText = "dismissed";
        // send dismissed event to GA
        ga('send', 'event', 'A2HS', 'dismissed');
        a2hs.disabled = true;
      }
      deferredPrompt = null;
    });
}

function installSW() {
  log(`Installing SW`);
  // Check that service workers are registered
  if ('serviceWorker' in navigator)
    navigator.serviceWorker.register('/sw.js')
}

function checkServiceWorkerStatus() {
  let status;
  if ('serviceWorker' in navigator) {
    status = navigator.serviceWorker.controller ? 'controlled' : 'supported';
  } else {
    status = 'unsupported';
  }
  log(`checkServiceWorkerStatus() = ${status}`);
  swStatus.innerText = status;
}

function checkIfOpenedFromHomescreen() {
  let urlParams = new URLSearchParams(window.location.search);
  let fromHS = urlParams.has('utm_source');
  if (fromHS)
    fromPWA.innerText = 'True';
  else
    fromPWA.innerText = 'False';
  log(`checkIfOpenedFromHomescreen() = ${fromHS}`);
  return fromHS;
}

// listen for beforeinstallprompt. Once received, save the 
// prompt and enable to the install button
window.addEventListener('beforeinstallprompt', (e) => {
  log(`beforeinstallprompt`);
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can add to home screen
  a2hs.disabled = false;
  beforeinstallpromptSpan.innerText = "Received";
});

checkServiceWorkerStatus();
checkIfOpenedFromHomescreen();