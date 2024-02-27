const $input = document.getElementById("input");
const $canvas = document.getElementById("canvas");

const $result = document.getElementById("result");
const $download = document.getElementById("download");
const $coffee = document.getElementById("coffee");
const $wave = document.getElementById("wave");

const $count = document.getElementById("count");
let generations = 0;

const ctx = $canvas.getContext("2d");
const reader = new FileReader();
const image = new Image();
const frame = new Image();

let fivePlus = false;

let frameType = Math.floor((Math.random() * 9));

const size = 480;

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
  $canvas.width = size;
  $canvas.height = size;

  const oc = document.createElement("canvas");
  const octx = oc.getContext("2d");

  octx.imageSmoothingQuality = "high";
  ctx.imageSmoothingQuality = "high";

  if (image.height < image.width) {
    oc.width = $canvas.width / (image.height / image.width);
    oc.height = $canvas.height;
  } else {
    oc.width = $canvas.width;
    oc.height = $canvas.height * (image.height / image.width);
  }
  octx.drawImage(image, 0, 0, oc.width, oc.height);

  const X = oc.width - $canvas.width;
  const Y = oc.height - $canvas.height;

  ctx.drawImage(
    oc,
    0,
    0,
    oc.width,
    oc.height,
    -X / 2,
    -Y / 2,
    oc.width,
    oc.height
  );

  ctx.drawImage(frame, 0, 0, size, size);

  exportCanvasAsPNG();
};

function exportCanvasAsPNG(fileName = "vip") {
  var MIME_TYPE = "image/png";

  var imgURL = $canvas.toDataURL(MIME_TYPE);

  var dlLink = $download;
  dlLink.download = fileName;
  dlLink.href = imgURL;
  dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(
    ":"
  );

  $result.src = imgURL;
  $result.style.opacity = 1;

  $download.style.opacity = 1;
  $coffee.style.opacity = 1;
  if (generations > 0) { update(1 + generations); }
  loadFrame();
}


function loadFrame() {
  frameType = (frameType + 1) % 4;
  switch (frameType) {
    case 0: {
      frame.src = "frame.png";
      wave.src = "wave.png";
      break;
    }
    case 1: {
      frame.src = "frame2.png";
      wave.src = "middle.png";
      break;
    }
    case 2: {
      frame.src = "emo.png";
      wave.src = "emo-wave.png";
      break;
    }
    case 3: {
      frame.src = "cakeFrame.png";
      wave.src = "cake.png";
      break;
    }
  }
}

loadFrame();


let req = new XMLHttpRequest();

req.onreadystatechange = () => {
  if (req.readyState == XMLHttpRequest.DONE) {
    const a = JSON.parse(req.responseText);
    // console.log(a.generations);
    generations = a.generations;
    $count.innerText = generations;

  }
};

req.open("GET", "https://api.jsonbin.io/b/603156d7d677700867e59d0c", true);
req.setRequestHeader(
  "secret-key",
  "$2b$10$u8CD7NvzwovlPS28oOqZgOQ2ME7B2Hk0R17Y8/lfPbyIDCUgXSAQK"
);
req.send();

const update = (i) => {
  let req2 = new XMLHttpRequest();

  req2.onreadystatechange = () => {
    if (req2.readyState == XMLHttpRequest.DONE) {
      console.log("+1");
    }
  };

  req2.open("PUT", "https://api.jsonbin.io/b/603156d7d677700867e59d0c", true);
  req2.setRequestHeader(
    "secret-key",
    "$2b$10$u8CD7NvzwovlPS28oOqZgOQ2ME7B2Hk0R17Y8/lfPbyIDCUgXSAQK"
  );
  req2.setRequestHeader("Content-Type", "application/json");
  req2.setRequestHeader("versioning", "false");


  req2.send(`{"generations": ${i}}`);
};
