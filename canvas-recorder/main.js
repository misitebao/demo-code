import "./style.css";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const { width, height } = canvas;

function draw(rotation = 0) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "orange";
  ctx.fillRect(0, 0, width, height);
  ctx.save();

  ctx.fillStyle = "red";
  ctx.translate(width / 2, height / 2);
  ctx.rotate(rotation);
  ctx.translate(-width / 2, -height / 2);
  ctx.beginPath();
  ctx.rect(200, 200, 200, 200);
  ctx.fill();
  ctx.restore();
}

function update(t) {
  draw(t / 500);
  requestAnimationFrame(update);
}
update(0);

const stream = canvas.captureStream();

const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

const data = [];

recorder.ondataavailable = function (event) {
  if (event.data && event.data.size) {
    console.log(event.data);
    data.push(event.data);
  }
};

recorder.onstop = () => {
  const url = URL.createObjectURL(new Blob(data, { type: "video/webm" }));

  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.download = `test.webm`;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

recorder.start();

setTimeout(() => {
  recorder.stop();
}, 6000);
