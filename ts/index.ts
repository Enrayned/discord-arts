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
  Badge,
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
  async toBuffer(): Promise<Buffer> {
    if (typeof this.border !== "undefined")
      return roundImage(this.canvas, this.border.borderRadius ?? 0, {
        borderColor: this.border.borderColor,
        borderWidth: this.border.borderSize,
      }).toBuffer();
    else return this.canvas.toBuffer();
  }
}

export class RankImage extends BaseImage {
  userId: string;
  badge: Badge | undefined;
  xp: number;
  requiredXp: number;
  level: number;
  constructor(
    { id }: { id: string },
    xp: number,
    requiredXp: number,
    level: number
  ) {
    super();
    this.userId = id;
    this.xp = xp;
    this.requiredXp = requiredXp;
    this.level = level;
  }
  setBadge(badge: Badge) {
    if (badge == "auto") {
    }
  }

  async toBuffer(): Promise<Buffer> {
    const data = (
      await axios.get(`https://japi.rest/discord/v1/user/${this.userId}`)
    ).data as UserJson;
    const avatar = await loadImage(data.data.avatarURL + "?size=2048");
    this.ctx.drawImage(
      circularImage(
        avatar,
        this.border
          ? {
              borderColor: this.border.borderColor,
              borderWidth: (this.border.borderSize ?? 0) * 2,
            }
          : { borderWidth: 0 }
      ),
      (this.height * 1) / 5 / 2,
      (this.height * 1) / 5 / 2,
      (this.height * 4) / 5,
      (this.height * 4) / 5
    );
    this.ctx.beginPath();
    const xpBarHeight = this.height / 12;
    const xpBarWidth = ((this.width - this.height) * 7) / 10;
    const xpBarX =
      this.height +
      ((this.width - this.height) * 1.5) / 10; /* (this.height * 5.5) / 5 */
    const xpBarY = (this.height * 4.5) / 5 - xpBarHeight;

    const xpBarBorderWidth = (xpBarHeight * 0.5) / 5;

    this.ctx.fillStyle = this.border?.borderColor ?? "#fff";
    this.ctx.fillRect(xpBarX, xpBarY, xpBarWidth, xpBarHeight);
    this.ctx.fillStyle = "#fff";

    this.ctx.fillRect(
      xpBarX + xpBarBorderWidth,
      xpBarY + xpBarBorderWidth,
      ((xpBarWidth - xpBarBorderWidth * 2) * this.xp) / this.requiredXp,
      xpBarHeight - xpBarBorderWidth * 2
    );
    this.ctx.closePath();
    const username = data.data.username;
    this.ctx.font = "70px sans-serif";
    const usernameMeasure = this.ctx.measureText(username);
    this.ctx.fillText(
      username,
      xpBarX + xpBarWidth / 2 - usernameMeasure.width / 2,
      xpBarY - this.height / 10
    );
    this.ctx.font = "40px sans-serif";
    const xpText = `${this.xp}/${this.requiredXp}`;
    const xpTextMeasure = this.ctx.measureText(xpText);
    this.ctx.fillText(
      xpText,
      xpBarX + xpBarWidth / 2 - xpTextMeasure.width / 2,
      xpBarY + (xpBarHeight - xpBarBorderWidth)
    );

    return super.toBuffer();
  }
}
(async () => {
  const background =
    "https://www.mnrubber.com/wp-content/uploads/2020/09/mnrp-home.jpg";
  const image = (
    await new RankImage(
      { id: "812347817602842624" },
      100,
      1000,
      1
    ).setBackground(background)
  ).setBorder({ borderColor: "#666", borderRadius: 50, borderSize: 10 });

  await writeFile("test.jpg", await image.toBuffer(), "base64");
})();
