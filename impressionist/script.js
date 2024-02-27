const $input = document.getElementById("input");
const $canvas = document.getElementById("canvas");
const $canvas2 = document.getElementById("canvas2");
const $result = document.getElementById("result");
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
const ctx = $canvas.getContext("2d");
const ctx2 = $canvas2.getContext("2d");
const reader = new FileReader();
const image = new Image();
let cSH = cSW = 0;
const SCALE = 5;
let borders = [];
const state = { size: 0, flag: false, borders: false, iteration: 0 };

$input.addEventListener("change", (event) => {
  const input = event.target;
  if (input.files && input.files[0]) {
    reader.readAsDataURL(input.files[0]);
  }
});

reader.onload = (event) => {
  image.src = event.target.result;
};


image.onload = () => {
  // set size proportional to image
  cSW = $canvas.width = Math.min(image.width, 200);
  cSH = $canvas.height = cSW * image.height / image.width;
  $canvas2.width = cSW * SCALE;
  $canvas2.height = cSH * SCALE;
  state.size = SCALE * Math.min(cSW, cSH) / 2;

  ctx.drawImage(image, 0, 0, cSW, cSH);
  ALG = ALG_BACKUP;
  console.log("1");
  fillBorders(ctx).then((value) => { borders = value; console.log(value); });
  console.log("2");
  startLoop();
};

const lineStep = (ctx, x1, y1, x2, y2, hex, diff) => {
  const d = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  let points = [];

  for (i = 1; i < Math.ceil(d); i += 1) {
    let x = ((x1 - x2) * i) / d;
    let y = ((y1 - y2) * i) / d;
    points.push({ x: x + x2, y: y + y2, hex: hex, size: diff });
  }


  const subF = (points) => {
    if (points.length > 1) {
      let p1 = points.shift();
      let p2 = points[0];
      ctx.strokeStyle = p1.hex;
      ctx.lineWidth = p1.size;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      window.requestAnimationFrame(() => {
        subF(points);
      });
    }
  };

  subF(points);
};

const drawLine = (ctx, x, y, hex, diff) => {
  rnd = () => (Math.floor(Math.random() * diff)) * 0.5;
  ctx.strokeStyle = hex;

 ctx.lineWidth = diff/3 + rnd();
  //ctx.beginPath();
  // ctx.moveTo(SCALE * x + rnd(), SCALE * y + rnd());
  // ctx.lineTo(SCALE * x + rnd(), SCALE * y + rnd());
  // ctx.stroke();

  dirX = Math.random() > 0.5 ? -1 : 1;
  dirY = Math.random() > 0.5 ? -1 : 1;
  let x1 = SCALE * x + rnd() * dirX;
  let y1 = SCALE * y + rnd() * dirY;
  let x2 = SCALE * x - rnd() * dirX;
  let y2 = SCALE * y - rnd() * dirY;
  
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  // window.requestAnimationFrame(() => {
  // lineStep(ctx, x1, y1, x2, y2, hex + "", rnd() + diff / 3);
  // });
};

const drawText = (ctx, x, y, hex, diff) => {
  rnd = () => (Math.floor(Math.random() * diff) - diff / 2) * 1.5;
  ctx.fillStyle = hex;
  ctx.font = `${diff}px sans-serif`;
  ctx.fillText("hi", SCALE * x + rnd(), SCALE * y + rnd());
};


const colorDiff3 = (ctx, x, y) => {
  var p = ctx.getImageData(x, y, 1, 1).data;

  return (p[0] + p[1] + p[2]) / 3;
};

const getHexFromCtx = (ctx, x, y) => {
  var pointData = ctx.getImageData(x + 1, y, 1, 1).data;
  return "#" + ("000000" + rgbToHex(pointData[0], pointData[1], pointData[2])).slice(-6);
}

const COLOR_DIFF_GAP = 25;

const renderBorders = () => {
  borders.map(point => {
    ctx2.fillRect(point.x * SCALE, point.y * SCALE, SCALE / 2, SCALE / 2);
  })
}

const findClosestPoint = (x, y, points) => {
  let resultI = 0;
  let dist = Infinity;
  for (i = 0; i < points.length; i++) {
    d = Math.sqrt(Math.pow(x - points[i].x, 2) + Math.pow(y - points[i].y, 2));

    if (d < dist) {
      resultI = i;
      dist = d;
    }
  }

  return resultI;
}

const renderBorders2 = () => {
  points = [...borders]
  let p1 = points.pop();
  const renderLLL = () => {
    if (points.length > 2) {
      let p2I = findClosestPoint(p1.x, p1.y, points);

      ctx2.strokeStyle = "#000000";
      dd = Math.sqrt(Math.pow(p1.x - points[p2I].x, 2) + Math.pow(p1.y - points[p2I].y, 2));

      if (dd < 10) {
      //   ctx.globalAlpha = 0.5;
        ctx2.lineWidth = SCALE * 2;
        ctx2.strokeStyle = p1.hex;
        ctx2.beginPath();
        ctx2.moveTo(p1.x * SCALE, p1.y * SCALE);
        ctx2.lineTo(points[p2I].x * SCALE, points[p2I].y * SCALE);
        ctx2.stroke();
      }

      p1 = points[p2I];
      points.splice(p2I, 1)
      renderLLL();
    }
  };

  renderLLL();

}

const fillBorders = async (ctx) => {
  let borders = [];
  for (let x = 1; x < cSW - 2; x++) {
    for (let y = 1; y < cSH - 2; y++) {
      if (
        Math.abs(colorDiff3(ctx, x, y) - colorDiff3(ctx, x, y + 1)) > COLOR_DIFF_GAP ||
        Math.abs(colorDiff3(ctx, x, y) - colorDiff3(ctx, x + 1, y)) > COLOR_DIFF_GAP
      ) {
        // borders.push({ x: x, y: y, hex: getHexFromCtx(ctx, x, y) });
        borders.push({ x: x + 1, y: y, hex: getHexFromCtx(ctx, x + 1, y) });
        borders.push({ x: x, y: y + 1, hex: getHexFromCtx(ctx, x, y + 1) });
      }
    }
  }

  return borders;
};

// const ALG_BACKUP = ["C"];// 
const ALG_BACKUP = [25, 25, 25, 35, "B", 55, 65, 175, 100, "B", 50].map(c => typeof c === 'number' ? c * 5 : c);
let ALG = ALG_BACKUP;

const paintLines = () => {
  state.iteration++;

  if (ALG.length === 0) {
    alert("DONE");
    exportCanvasAsPNG();
    sporVideoRec();
  } else {
    if (ALG[0] === state.iteration) {
      ALG.shift();
      state.iteration = 0;
      state.size /= 1.5;
    } else if (ALG[0] === "B") {
      console.log("BORDERS");
      ALG.shift();
      state.borders = !state.borders;
    } else if (ALG[0] === "C") {
      renderBorders2();
      ALG.shift();
    }


    if (state.borders === false) {

      drawRandLines();
    } else {

      drawBorderLines();
    }

    window.requestAnimationFrame(() => {
      paintLines();
    });

  }
}
const zz = 5;
const drawRandLines = () => {
  x = Math.round(Math.random() * cSW);
  y = Math.round(Math.random() * cSH);
  var p = ctx.getImageData(x, y, 1, 1).data;
  var hex = "#" + ("000000" + rgbToHex(p[0] + zz, p[1] + zz, p[2] + zz)).slice(-6);
  drawLine(ctx2, x, y, hex, state.size);
  // drawText(ctx2, x, y, hex, state.size);
};

const drawBorderLines = () => {
  const point = borders[Math.floor(Math.random() * borders.length)];
  drawLine(ctx2, point.x, point.y, point.hex, state.size);
  // drawText(ctx2, point.x, point.y, point.hex, state.size);
};

const startLoop = () => {
  if (state.flag === false) {
    state.flag = true;
    if (isChrome) {
      startRecording();
    }
    window.requestAnimationFrame(() => {
      paintLines();
    });
  }
};


function rgbToHex(r1, g1, b1) {
  r = Math.min(r1, 255);
  g = Math.min(g1, 255);
  b = Math.min(b1, 255);
  if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
}



function exportCanvasAsPNG(fileName = "vip") {
  var MIME_TYPE = "image/png";

  var imgURL = $canvas2.toDataURL(MIME_TYPE);

  // var dlLink = $download;
  // dlLink.download = fileName;
  // dlLink.href = imgURL;
  // dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(
  //   ":"
  // );

  $result.src = imgURL;
  $result.style.opacity = 1;

}



function startRecording() {
  const chunks = []; // here we will store our recorded media chunks (Blobs)
  const stream = canvas2.captureStream(); // grab our canvas MediaStream
  var options = { mimeType: "video/webm;codecs=h264" };
  // var options = { mimeType: "video/webm" };
  rec = new MediaRecorder(stream, options); // init the recorder
  // every time the recorder has new data, we will store it in our array
  rec.ondataavailable = (e) => { console.log(e.data.size); chunks.push(e.data); };
  // only when the recorder stops, we construct a complete Blob from all the chunks
  rec.onstop = (e) => {
    console.log("SROP REC")

    exportVid(new Blob(chunks, { type: "video/webm" }));
    clearTimeout(recordingTimeout);
  };

  rec.start();
  // recordingTimeout = setTimeout(() => sporVideoRec(), 10000); // stop recording in 3s
}

function sporVideoRec() {
  if (rec) {
    rec.stop();
  }
}

function exportVid(blob) {
  var prevvid = document.getElementById("vid");
  if (prevvid) {
    prevvid.parentNode.removeChild(prevvid);
    var prevvidlink = document.getElementById("vidlink");

    prevvidlink.parentNode.removeChild(prevvidlink);
  }
  // document.body.innerHTML = ""; 
  const vid = document.createElement("video");
  vid.setAttribute("id", "vid");
  vid.src = URL.createObjectURL(blob);
  vid.controls = true;
  // vid.style.display = none;
  document.body.appendChild(vid);
  const a = document.createElement("a");
  a.setAttribute("id", "vidlink");
  a.download = `video-${new Date()}.webm`;
  a.href = vid.src;
  a.textContent = "download the video";
  document.body.appendChild(a);
}
