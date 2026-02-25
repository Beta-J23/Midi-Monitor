javascript:(function() {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(
      function success(midiAccess) {
        console.log('MIDI Access granted');
        midiAccess.inputs.forEach(function(input) {
          input.onmidimessage = function(message) {
            console.log('MIDI In:', message.data, 'Timestamp:', message.timeStamp);
            let midi_mon = document.getElementById('midi_test');
            if (!midi_mon) {
              midi_mon = document.createElement('div');
              midi_mon.id = 'midi_test';
              midi_mon.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: white; padding: 20px; border: 1px solid #ccc; border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 99999; max-width: 400px;
                font-family: sans-serif; color: #333; line-height: 1.5;
              `;
              midi_mon.innerHTML = `
                <h3>MIDI Monitor</h3>
                <p id="note">MidiNote: <strong>-</strong></p>
                <p id="velocity">Velocity: <strong>-</strong></p>
                <button onclick="this.closest('div').remove()" style="margin-top: 10px; padding: 8px 12px; background: #007BFF; color: white; border: none; border-radius: 4px; cursor: pointer;">
                  Close
                </button>
              `;
              document.body.appendChild(midi_mon);
            }
        
            if (message.data[0] != 128){
            midi_mon.querySelector('#note strong').textContent = message.data[1];
            midi_mon.querySelector('#velocity strong').textContent = message.data[2];}
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
})();