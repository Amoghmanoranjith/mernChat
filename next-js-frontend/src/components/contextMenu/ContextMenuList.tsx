import { JSX } from "react";
import { ContextMenuListItem } from "./ContextMenuListItem";

type PropTypes = {
  contextOptions: {
    name: string;
    icon: JSX.Element;
    handlerFunc: () => void;
  }[];
};

export const ContextMenuList = ({ contextOptions }: PropTypes) => {
  return (
    <div className="flex flex-col">
      {contextOptions.map(({ name, icon, handlerFunc }) => (
        <ContextMenuListItem
          handlerFunc={handlerFunc}
          icon={icon}
          name={name}
          key={name}
        />
      ))}
    </div>
  );
};
