import { Canvas, Image, createCanvas, loadImage } from "canvas";

export const roundImage = (
  image: Image | Canvas,
  borderRadius: number,
  border?: { borderWidth?: number; borderColor?: string }
): Canvas => {
  try {
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(borderRadius, 0);
    ctx.lineTo(canvas.width - borderRadius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, borderRadius);
    ctx.lineTo(canvas.width, canvas.height - borderRadius);
    ctx.quadraticCurveTo(
      canvas.width,
      canvas.height,
      canvas.width - borderRadius,
      canvas.height
    );
    ctx.lineTo(borderRadius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - borderRadius);
    ctx.lineTo(0, borderRadius);
    ctx.quadraticCurveTo(0, 0, borderRadius, 0);
    ctx.closePath();
    ctx.clip();

    if (typeof border !== "undefined") {
      const borderWidth = border.borderWidth ?? 20;
      ctx.beginPath();
      ctx.fillStyle = border.borderColor ?? "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.stroke();
      ctx.drawImage(
        roundImage(image, borderRadius),
        borderWidth,
        borderWidth,
        image.width - borderWidth * 2,
        image.height - borderWidth * 2
      );
    } else ctx.drawImage(image, 0, 0);

    return canvas;
  } catch (error) {
    console.error("Hata:", error);
    throw error;
  }
};

export const circularImage = (
  image: Image | Canvas,
  border?: { borderWidth?: number; borderColor?: string }
): Canvas => {
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  ctx.beginPath();
  ctx.arc(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2,
    0,
    2 * Math.PI,
    true
  );
  ctx.closePath();
  if (typeof border !== "undefined") {
    const borderWidth = border.borderWidth ?? 20;
    ctx.beginPath();
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2 - borderWidth,
      0,
      2 * Math.PI,
      true
    );
    ctx.strokeStyle = border.borderColor ?? "#fff";
    ctx.lineWidth = borderWidth;
    ctx.stroke();
  }

  ctx.clip();
  ctx.drawImage(image, 0, 0);
  return canvas;
};
import { writeFile } from "fs/promises";
import { Border } from "./types";

// (async () => {
//   const image = await loadImage(
//     "https://images-ext-2.discordapp.net/external/n7H_DpoFb2sItaAwOFawcji6NCt-2F3QReRu9Xj0C_0/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/812347817602842624/9b7af7bf3b29a223a0950b1031addf64.png"
//   );
//   const roundedImage = await circularImage(image);
//   await writeFile("test.jpg", roundedImage.toBuffer(), "base64");
// })();
