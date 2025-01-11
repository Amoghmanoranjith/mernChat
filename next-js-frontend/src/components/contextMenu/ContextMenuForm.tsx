import { JSX } from "react";
import { ContextMenuFormItem } from "./ContextMenuFormItem";

type PropTypes = {
  contextOptions: {
    name: string;
    icon: JSX.Element;
    handlerFunc: () => void;
  }[];
};

export const ContextMenuForm = ({ contextOptions }: PropTypes) => {
  return (
    <div className="flex flex-col">
      {contextOptions.map(({ name, icon, handlerFunc }) => (
        <ContextMenuFormItem
          handlerFunc={handlerFunc}
          icon={icon}
          name={name}
          key={name}
        />
      ))}
    </div>
  );
};
