import Image from "next/image";

type PropTypes = {
  avatars: string[];
};

export const AvatarList = ({avatars}: PropTypes) => {
  return (
    <div className="flex">
      {avatars.map((avatar, index) => (
        <Image
          key={index}
          className="rounded-full object-contain shrink-0"
          height={100}
          width={100}
          src={avatar}
          alt="avatar"
        />
      ))}
    </div>
  );
};
