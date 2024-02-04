import {
  Canvas,
  Image,
  createCanvas,
  loadImage,
  CanvasRenderingContext2D,
} from "canvas";

type BorderColor = string | "#fff" | "#000";
type BorderSize = number;
type BorderRadius = number | "circular";

type Img = Image | string;

interface Border {
  borderColor?: BorderColor;
  borderSize?: BorderSize;
  borderRadius?: BorderRadius;
}

abstract class BaseImage {
  canvas: Canvas;
  ctx: CanvasRenderingContext2D;
  border?: Border;
  width: number = 720;
  height: number = 240;
  constructor() {
    this.canvas = createCanvas(this.width, this.height);
    this.ctx = this.canvas.getContext("2d");
  }
  setBorder(border?: Border) {
    let borderColor: BorderColor = "#000";
    let borderSize: BorderSize = 10;
    let borderRadius: BorderRadius = 10;
    if (typeof border !== "undefined") {
      if (typeof border.borderColor !== "undefined")
        borderColor = border.borderColor;
      if (typeof border.borderSize !== "undefined")
        borderSize = border.borderSize;
      if (typeof border.borderRadius !== "undefined")
        borderRadius = border.borderRadius;
    }
    this.border = { borderColor, borderSize, borderRadius };
    return this;
  }
  async setBackground(image: Img) {
    let img: Image;
    if (typeof image === "string") img = await loadImage(image);
    else img = image;
    this.ctx.drawImage(img, 0, 0, this.width, this.height);
    return this;
  }
  toBuffer() {
    return this.canvas.toBuffer();
  }
}

// export class RankImage {
//   canvas: Canvas;
//   ctx: Context;
//   border?: boolean | undefined;
//   border_radius?: number | undefined;
//   border_color?: string | undefined;
//   constructor() {
//     this.canvas = createCanvas(720, 240);
//     this.ctx = this.canvas.getContext("2d");
//   }

//   setBorder(borderRadius:)
// }
