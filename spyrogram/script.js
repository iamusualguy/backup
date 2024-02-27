var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "black";
ctx.lineWidth = 2;
var plusBtn = document.getElementById("plusBtn");
let cS = 1000;
let p = { x: 0, y: 0 };
let f = 0;
let f2 = 0;
let prev = null;
let first = null;
let z = [{ r: 100, d: 1, f: 0 }];

function getParam() {
  var myParam = window.location.search.split("param=")[1] || "";
  paramzz = eval("[" + decodeURI(myParam) + "]");

  d = paramzz.map((c) => ({
    r: Object.keys(c)[0],
    d: Object.values(c)[0],
    f: 0
  }));

  console.log(d);

  return d;
}

function setZ() {
  prev = null;
  ctx.fillRect(0, 0, cS, cS);
  z = getParam();
  // console.log(z);
  ctx.strokeStyle = "#00ffff";
  if (z.length == 0) {
      const www = Math.floor(Math.random() * 3) + 1;
      z.push({
        r: 0,
        d: 1,
        f: 0
      });
      for (i = 0; i < www; i++) {
        z.push({
          r: Math.floor(Math.random() * (cS / 4) + 1),
          d: Math.floor((Math.floor(Math.random() * (cS / 6)) - cS / 12) * 10) / 10 ,
          f: 0
        });
      }
  }
  
  console.log("zz",z);

  param = z.map((zz) => `{${zz.r}:${zz.d}}`).join(",");
  const searchRegExp = /\./g;
  paramfile = z.map((zz) => `r${zz.r}d${zz.d}`).join("").replace(searchRegExp, ",");

  var urll = window.location;
  newlink = urll.protocol + '//' + urll.host + urll.pathname;

  var paramdiv = document.getElementById("param");
  paramdiv.innerHTML = "";

  var download = document.createElement("A");
  download.onclick = () => { exportCanvasAsPNG("canvas", "spyrograph-"+paramfile); };
  download.innerText = "↓ PNG";

  var paramLink = document.createElement("A");
  paramLink.href = newlink+"?param="+param;
  paramLink.innerText = "LINK";
  
  
  var paramLinkNew = document.createElement("A");
  paramLinkNew.href = newlink+"?param=";
  paramLinkNew.innerText = "NEW";
  
  paramdiv.appendChild(download);
  paramdiv.appendChild(paramLink);
  paramdiv.appendChild(paramLinkNew);
}

let loop = 0;
function drawLine(point) {
  if (prev === null) {
    prev = Object.assign({}, point);
    first = Object.assign({}, point);
  } else {
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    prev = Object.assign({}, point);
  }
}

myReq = null;

function draw() {
  window.cancelAnimationFrame(myReq);
  var s = (2 * Math.PI) / 300;
  let x = 0;
  let y = 0;
  z.map((zz, idx) => {
    var ff = s * zz.f;
    x += zz.r * Math.sin(ff);
    y += -zz.r * Math.cos(ff);
    z[idx].f += Number(zz.d);
  });

  ctx.filter = "hue-rotate("+ z[0].f +"deg)";

  p.x = Math.round(x + cS / 2);
  p.y = Math.round(y + cS / 2);

  if (first && p.y == first.y && p.x == first.x) {
    loop++;
  }


  drawLine(p);

  if (loop == 2) {
    drawLine(p);
    window.cancelAnimationFrame(myReq);
    console.log("Stop;");
    // exportCanvasAsPNG();
  } else {
    drawLine(p);
    myReq = window.requestAnimationFrame(draw);
  }
}

draw();

function init() {
  setZ();
}

function exportCanvasAsPNG(id = "canvas", fileName = "spirograph") {
  var canvasElement = document.getElementById(id);

  var MIME_TYPE = "image/png";

  var imgURL = canvasElement.toDataURL(MIME_TYPE);

  var dlLink = document.createElement("a");
  dlLink.download = fileName;
  dlLink.href = imgURL;
  dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(
    ":"
  );

  document.body.appendChild(dlLink);
  dlLink.click();
  document.body.removeChild(dlLink);
}


init();
