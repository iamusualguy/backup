const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

const fret = document.getElementById("fret");

const tuneEl = document.getElementById("tune");
const capoEl = document.getElementById("capo");

getFret = () => {
  fret.innerHTML = "";
  tune = tuneEl.value.toUpperCase().split(/(A#|A|B|C#|C|D#|D|E|F#|F|G#|G)/).filter(c=> c!=="").reverse();
  capo = +capoEl.value;
  console.log(tune, capo);

  tune.forEach((noteS) => {
    const stringg = document.createElement("div");
    stringg.className = "string";
    shift = notes.indexOf(noteS);
    for (n = 0; n < 15; n++) {
      const noteEl = document.createElement("div");
      const noteee = notes[(capo + n + shift) % notes.length];
      noteEl.className =
        "note " + noteee.replace("#", 1) + (n === 0 ? " first" : "");
      noteEl.innerHTML = noteee;
      noteEl.onmouseover = function() {
        changeColor(noteee.replace("#", 1), "yellow");
    };
      noteEl.onmouseout = function() {
        changeColor(noteee.replace("#", 1),"white");
    };
      stringg.appendChild(noteEl);
    }

    fret.appendChild(stringg);
  });

  const line = document.createElement("div");
  line.className = "string";

  for (n = 0; n < 15; n++) {
    const noteEl = document.createElement("div");
    noteEl.className = "line" + (n === 0 ? " first" : "");
    noteEl.innerHTML = n;
    line.appendChild(noteEl);
  }
  fret.appendChild(line);
};

getFret();

const changeColor = (classname, color) => {
  var elms = document.getElementsByClassName(classname);
  var n = elms.length;
  for (var i = 0; i < n; i++) {
    elms[i].style.backgroundColor = color;
  }
};