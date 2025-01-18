import { APP_BRANDING_PROFILE_IMAGES } from "@/constants";
import Image from "next/image";

export const AppBrandingProfileImages = () => {
  return (
    <div className="flex gap-x-1">
      {APP_BRANDING_PROFILE_IMAGES.map((avatar, index) => (
        <Image
          key={index}
          width={200}
          height={200}
          quality={100}
          src={avatar}
          className="size-16 rounded-full object-cover shrink-0"
          alt="avatar"
        />
      ))}
    </div>
  );
};
