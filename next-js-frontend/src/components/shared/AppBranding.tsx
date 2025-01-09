import { chatAnimation } from "@/assets";
import { AVATARS } from "@/constants";
import { LottieAnimation } from "../ui/LottieAnimation";
import { AvatarList } from "./AvatarList";

export const AppBranding = () => {
  return (
    <div className="text-inherit bg-inherit flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-4">
          <h1 className="text-7xl font-bold">Mern Chat</h1>
          <div className="w-20 h-20">
            <LottieAnimation animationData={chatAnimation} />
          </div>
        </div>
        <h2 className="text-2xl font-semibold">
          Discover your next conversation
        </h2>
      </div>

      <p className="text-white-500 text-lg">
        Join our vibrant community of more than 1lakh+ people and build
        connections that last forever
      </p>

      <AvatarList avatars={AVATARS} />
    </div>
  );
};
