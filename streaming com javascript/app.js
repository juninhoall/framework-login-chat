var mediaConstraints = { audio: true };
           navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

           function onMediaSuccess(stream) {
               var audio = document.createElement('audio');
               audio = mergeProps(audio, {
                   controls: true,
                   src: URL.createObjectURL(stream)
               });
               audio.play();

               audiosContainer.appendChild(audio);
               audiosContainer.appendChild(document.createElement('hr'));

               var mediaRecorder = new MediaStreamRecorder(stream);
               mediaRecorder.mimeType = 'audio/ogg';
               mediaRecorder.ondataavailable = function(blob) {
                   var a = document.createElement('a');
                   a.target = '_blank';
                   a.innerHTML = 'Open Recorded Audio No. ' + (index++);

                   a.href = URL.createObjectURL(blob);

                   audiosContainer.appendChild(a);
                   audiosContainer.appendChild(document.createElement('hr'));
               };

               // get blob after each 5 second!
               mediaRecorder.start(5 * 1000);
           }

           function onMediaError(e) {
               console.error('media error', e);
           }

           var audiosContainer = document.getElementById('audios-container');
           var index = 1;
