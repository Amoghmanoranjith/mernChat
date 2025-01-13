import Image from "next/image";

type PropTypes = {
  url: string;
};

export const Gif = ({ url }: PropTypes) => {
  return (
    <div className="h-96 max-xl:h-80 ">
      <Image className="w-full h-full object-contain" width={100} height={100} src={url} alt="gif" />
    </div>
  );
};
