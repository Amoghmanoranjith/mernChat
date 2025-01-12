import { useOpenFriendRequestForm } from "@/hooks/useUI/useOpenFriendRequestForm";
import { Badge } from "../ui/Badge";
import { UserIcon } from "../ui/icons/UserIcon";

type PropTypes = {
  numberOfFriendRequest: number;
};

export const FriendRequestButton = ({ numberOfFriendRequest }: PropTypes) => {
  const { openFriendRequestForm } = useOpenFriendRequestForm();
  return (
    <button onClick={openFriendRequestForm}>
      <div className="relative">
        <UserIcon />
        <Badge value={numberOfFriendRequest} />
      </div>
    </button>
  );
};
