"use client";
import {
  resetAttachments,
  selectAddFriendForm,
  selectAddMemberForm,
  selectAttachments,
  selectChatUpdateForm,
  selectFriendRequestForm,
  selectGifForm,
  selectGroupChatForm,
  selectNotificationPermissionForm,
  selectPollForm,
  selectProfileForm,
  selectRecoverPrivateKeyForm,
  selectRemoveMemberForm,
  selectSettingsForm,
  selectViewVotes,
  setAddFriendForm,
  setAddMemberForm,
  setChatUpdateForm,
  setFriendRequestForm,
  setGifForm,
  setNewgroupChatForm,
  setNotificationPermissionForm,
  setPollForm,
  setProfileForm,
  setRemoveMemberForm,
  setSettingsForm,
  setViewVotes,
} from "@/lib/client/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/lib/client/store/hooks";
import dynamic from "next/dynamic";
import { Modal } from "./Modal";
const RecoverPrivateKeyForm = dynamic(
  () => import("../auth/RecoverPrivateKeyForm"),
  { ssr: false }
);
const ChatUpdateForm = dynamic(() => import("../chat/ChatUpdateForm"), {
  ssr: false,
});
const GroupChatForm = dynamic(() => import("../chat/GroupChatForm"), {
  ssr: false,
});
const TenorGifForm = dynamic(() => import("../chat/TenorGifForm"), {
  ssr: false,
});
const AddFriendForm = dynamic(() => import("../friends/AddFriendForm"), {
  ssr: false,
});
const FriendRequestForm = dynamic(
  () => import("../friends/FriendRequestForm"),
  { ssr: false }
);
const AddMemberForm = dynamic(() => import("../member/AddMemberForm"), {
  ssr: false,
});
const RemoveMemberForm = dynamic(() => import("../member/RemoveMemberForm"), {
  ssr: false,
});
const PollForm = dynamic(() => import("../messages/PollForm"), { ssr: false });
const ViewVotes = dynamic(() => import("../messages/ViewVotes"), {
  ssr: false,
});
const AttachmentPreview = dynamic(() => import("../ui/AttachmentPreview"), {
  ssr: false,
});
const NotificationPermissionForm = dynamic(
  () => import("../user/NotificationPermissionForm"),
  { ssr: false }
);
const ProfileForm = dynamic(() => import("../user/ProfileForm"), {
  ssr: false,
});
const SettingsForm = dynamic(() => import("../user/SettingsForm"), {
  ssr: false,
});

export const ModalWrapper = () => {
  const dispatch = useAppDispatch();

  const isgroupChatFormOpen = useAppSelector(selectGroupChatForm);
  const isAddMemberFormOpen = useAppSelector(selectAddMemberForm);
  const isAddFriendFormOpen = useAppSelector(selectAddFriendForm);
  const isFriendRequestFormOpen = useAppSelector(selectFriendRequestForm);
  const isProfileFormOpen = useAppSelector(selectProfileForm);
  const isRemoveMemberFormOpen = useAppSelector(selectRemoveMemberForm);
  const isGifFormOpen = useAppSelector(selectGifForm);
  const isAttachmentsOpen = useAppSelector(selectAttachments) != null;
  const isPollFormOpen = useAppSelector(selectPollForm);
  const isViewVotesOpen = useAppSelector(selectViewVotes);
  const isChatUpdateFormOpen = useAppSelector(selectChatUpdateForm);
  const isSettingsFormOpen = useAppSelector(selectSettingsForm);
  const isNotificationPermissionFormOpen = useAppSelector(
    selectNotificationPermissionForm
  );
  const isRecoverPrivateKeyFormOpen = useAppSelector(
    selectRecoverPrivateKeyForm
  );

  return (
    <>
      <Modal
        isOpen={isgroupChatFormOpen}
        onClose={() => dispatch(setNewgroupChatForm(false))}
      >
        <GroupChatForm />
      </Modal>

      <Modal
        isOpen={isAddMemberFormOpen}
        onClose={() => dispatch(setAddMemberForm(false))}
      >
        <AddMemberForm />
      </Modal>

      <Modal
        isOpen={isAddFriendFormOpen}
        onClose={() => dispatch(setAddFriendForm(false))}
      >
        <AddFriendForm />
      </Modal>

      <Modal
        isOpen={isFriendRequestFormOpen}
        onClose={() => dispatch(setFriendRequestForm(false))}
      >
        <FriendRequestForm />
      </Modal>

      <Modal
        isOpen={isProfileFormOpen}
        onClose={() => dispatch(setProfileForm(false))}
      >
        <ProfileForm />
      </Modal>

      <Modal
        isOpen={isRemoveMemberFormOpen}
        onClose={() => dispatch(setRemoveMemberForm(false))}
      >
        <RemoveMemberForm />
      </Modal>

      <Modal isOpen={isGifFormOpen} onClose={() => dispatch(setGifForm(false))}>
        <TenorGifForm />
      </Modal>

      <Modal
        isOpen={isAttachmentsOpen}
        onClose={() => dispatch(resetAttachments())}
      >
        <AttachmentPreview />
      </Modal>

      <Modal
        isOpen={isPollFormOpen}
        onClose={() => dispatch(setPollForm(false))}
      >
        <PollForm />
      </Modal>

      <Modal
        isOpen={isViewVotesOpen}
        onClose={() => dispatch(setViewVotes(false))}
      >
        <ViewVotes />
      </Modal>

      <Modal
        isOpen={isChatUpdateFormOpen}
        onClose={() => dispatch(setChatUpdateForm(false))}
      >
        <ChatUpdateForm />
      </Modal>

      <Modal
        isOpen={isSettingsFormOpen}
        onClose={() => dispatch(setSettingsForm(false))}
      >
        <SettingsForm />
      </Modal>

      <Modal
        isOpen={isNotificationPermissionFormOpen}
        onClose={() => dispatch(setNotificationPermissionForm(false))}
      >
        <NotificationPermissionForm />
      </Modal>

      <Modal isOpen={isRecoverPrivateKeyFormOpen} onClose={() => ""}>
        <RecoverPrivateKeyForm />
      </Modal>
    </>
  );
};
