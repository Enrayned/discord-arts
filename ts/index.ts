import axios from "axios";
import {
  Canvas,
  Image,
  createCanvas,
  loadImage,
  CanvasRenderingContext2D,
} from "canvas";
import { writeFile } from "fs/promises";
import { circularImage, roundImage } from "./round";
import {
  Border,
  BorderColor,
  BorderRadius,
  BorderSize,
  Img,
  UserJson,
} from "./types";

// import { writeFile } from "fs/promises";

abstract class BaseImage {
  canvas: Canvas;
  ctx: CanvasRenderingContext2D;
  border?: Border;
  width: number;
  height: number;

  constructor(width: number = 1440, height = 480) {
    this.width = width;
    this.height = height;
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
    this.ctx.drawImage(img, 0, 0, img.width, img.height);
    return this;
  }
  toBuffer() {
    if (typeof this.border !== "undefined")
      return roundImage(this.canvas, this.border.borderRadius ?? 0, {
        borderColor: this.border.borderColor,
        borderWidth: this.border.borderSize,
      }).toBuffer();
    else return this.canvas.toBuffer();
  }
}

export class RankImage extends BaseImage {
  constructor() {
    super();
  }
  async setUser({ id }: { id: string }) {
    const data = (await axios.get(`https://japi.rest/discord/v1/user/${id}`))
      .data as UserJson;
    const avatar = await loadImage(data.data.avatarURL + "?size=2048");
    this.ctx.drawImage(avatar, 0, 0, this.width / 3, this.width / 3);
    //TODO burdaki user this e eklenecek ve toBuffer editlenerek en son olarak avatar eklenecek
    // await writeFile(
    //   "test.png",
    //   circularImage(avatar, {
    //     borderColor: "#fff",
    //     borderWidth: 30,
    //   }).toBuffer(),
    //   "base64"
    // );
    // await writeFile(
    //   "test.png",
    //   roundImage(avatar, 50, {
    //     borderColor: "#fff",
    //     borderWidth: 20,
    //   }).toBuffer(),
    //   "base64"
    // );
    return this;
  }
  setBadge(badge: Image | Array<Image> | "auto") {}
}
(async () => {
  const avatar = await loadImage(
    "https://www.mnrubber.com/wp-content/uploads/2020/09/mnrp-home.jpg"
  );
  const image = await (await new RankImage().setBackground(avatar))
    .setBorder({ borderColor: "#666", borderRadius: 50, borderSize: 10 })
    .setUser({ id: "812347817602842624" });
  await writeFile("test.jpg", image.toBuffer(), "base64");
})();
