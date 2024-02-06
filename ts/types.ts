import { Image } from "canvas";

export type BorderColor = string | "#fff" | "#000";
export type BorderSize = number;
export type BorderRadius = number;

export type Img = Image | string;

export interface Border {
  borderColor?: BorderColor;
  borderSize?: BorderSize;
  borderRadius?: BorderRadius;
}

export type UserJson = {
  cache_expiry: number;
  cached: boolean;
  data: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    premium_type: number;
    flags: number;
    banner: string | null;
    accent_color: number;
    global_name: string;
    avatar_decoration_data: { asset: string; sku_id: string };
    banner_color: string;
    tag: string;
    createdAt: string;
    createdTimestamp: number;
    public_flags_array: Array<any>;
    defaultAvatarURL: string;
    avatarURL: string;
    bannerURL: string;
    bio: any;
    premium_since: any;
    premium_guild_since: any;
  };
  presence: any;
  connections: any;
};
