import { useToggleRemoveMemberForm } from "../../hooks/useUI/useToggleRemoveMemberForm";
import { RemoveMemberIcon } from "../ui/icons/RemoveMemberIcon";

export const RemoveMemberSection = () => {
  const { toggleRemoveMember } = useToggleRemoveMemberForm();

  return (
    <div className="flex items-center justify-between">
      <p>Remove member</p>
      <button
        onClick={toggleRemoveMember}
        className="w-8 h-8 flex justify-center items-center rounded-full text-white"
      >
        <RemoveMemberIcon />
      </button>
    </div>
  );
};
