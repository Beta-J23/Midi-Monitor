function requestMIDIAccess() {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(
      function success(midiAccess) {
        console.log('MIDI Access granted');
        const log = document.getElementById('log');
        log.innerHTML = 'Listening for MIDI input...';

        midiAccess.inputs.forEach(function(input) {
          input.onmidimessage = function(message) {
            const data = message.data;
            const cmd = data[0] >> 4;
            const channel = data[0] & 0xf;
            const note = data[1];
            const velocity = data[2];
            const time = new Date().toLocaleTimeString();

            // Skip if not Note On/Off or CC
            if ((cmd === 8 || (cmd === 9 && velocity === 0)) && !document.getElementById('noteOff').checked) return;
            if (cmd === 9 && velocity > 0 && !document.getElementById('noteOn').checked) return;
            if (cmd === 11 && !document.getElementById('cc').checked) return;

            let event = '';
            if (cmd === 8 || (cmd === 9 && velocity === 0)) event = 'Note Off';
            else if (cmd === 9) event = 'Note On';
            else if (cmd === 11) event = `CC ${note} = ${velocity}`;

            const entry = document.createElement('div');
            entry.textContent = `[${time}] Ch:${channel+1} ${event}`;
            log.prepend(entry);
          };
        });
      },
      function failure() {
        alert('MIDI Access failed');
      }
    );
  } else {
    alert('Web MIDI API not supported in this browser');
  }
}

function clearLogs() {
  const log = document.getElementById('log');
  log.innerHTML = 'Waiting for MIDI input...';
}