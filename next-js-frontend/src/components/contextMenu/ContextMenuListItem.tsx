import { JSX } from "react";

type PropTypes = {
  name: string;
  icon: JSX.Element;
  handlerFunc: () => void;
};

export const ContextMenuListItem = ({ handlerFunc, icon, name }: PropTypes) => {
  return (
    <div
      onClick={handlerFunc}
      className="cursor-pointer p-2 rounded-sm hover:bg-secondary-darker flex items-center justify-between"
    >
      <p>{name}</p>
      <span>{icon}</span>
    </div>
  );
};
