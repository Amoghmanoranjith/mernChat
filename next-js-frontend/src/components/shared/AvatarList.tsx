import Image from "next/image";

type PropTypes = {
  avatars: Array<string>;
  w?: number;
  h?: number;
};

export const AvatarList = ({ avatars, w = 16, h = 16 }: PropTypes) => {
  return (
    <div className="flex gap-x-1">
      {avatars.map((avatar, index) => (
        <Image
          key={index}
          width={200}
          height={200}
          quality={100}
          src={avatar}
          className="size-36 rounded-3xl object-cover"
          alt="avatar"
        />
      ))}
    </div>
  );
};
