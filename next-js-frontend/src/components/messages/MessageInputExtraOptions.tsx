'use client';
import { useGetSharedKey } from "@/hooks/useAuth/useGetSharedKey";
import { useSendMessage } from "@/hooks/useMessages/useSendMessage";
import { useToggleGif } from "@/hooks/useUI/useToggleGif";
import { encryptAudioBlob } from "@/lib/client/encryption";
import { selectLoggedInUser } from "@/lib/client/slices/authSlice";
import { selectSelectedChatDetails } from "@/lib/client/slices/chatSlice";
import { useAppSelector } from "@/lib/client/store/hooks";
import { fetchUserChatsResponse } from "@/lib/server/services/userService";
import { getOtherMemberOfPrivateChat } from "@/lib/shared/helpers";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import { AttachmentIcon } from "../ui/icons/AttachmentIcon";
import { DeleteIcon } from "../ui/icons/DeleteIcon";
import { GifIcon } from "../ui/icons/GifIcon";
import { SendIcon } from "../ui/icons/SendIcon";
import { VoiceNoteMicIcon } from "../ui/icons/VoiceNoteMicIcon";

type PropTypes = {
  toggleAttachmentsMenu: React.Dispatch<React.SetStateAction<boolean>>;
  isRecording: boolean;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
  voiceNoteActive: boolean;
  setVoiceNoteActive: Dispatch<SetStateAction<boolean>>;
};

export const MessageInputExtraOptions = ({
  toggleAttachmentsMenu,
  isRecording,
  setIsRecording,
  voiceNoteActive,
  setVoiceNoteActive
}: PropTypes) => {


  const { toggleGifForm } = useToggleGif();

  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const loggedInUserId = useAppSelector(selectLoggedInUser)?.id as string
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails) as fetchUserChatsResponse;
  const otherMember =  getOtherMemberOfPrivateChat(selectedChatDetails,loggedInUserId);

  const {sendMessage} = useSendMessage();

  const startRecording = async () => {
    try {
      setVoiceNoteActive(true);
      setAudioURL(null);
      audioChunks.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = "audio/webm; codecs=opus";

      const recorder = new MediaRecorder(stream,{mimeType});
      mediaRecorder.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioURL(url);
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleDeleteVoiceNote = useCallback(()=>{
    setIsRecording(false);
    setVoiceNoteActive(false);
    setAudioURL(null);
    audioChunks.current = [];
    mediaRecorder.current?.stop();
  },[setIsRecording, setVoiceNoteActive]);

  const {getSharedKey} = useGetSharedKey();

  const handleSendVoiceNote = useCallback(async()=>{

    const sharedKey = await getSharedKey({loggedInUserId,otherMember:otherMember.user})

    if(sharedKey && audioBlob){
      const encryptedAudioBlob = await encryptAudioBlob({audioBlob,sharedKey});
      sendMessage(undefined,undefined,undefined,[],undefined,encryptedAudioBlob);
      handleDeleteVoiceNote();
      mediaRecorder.current?.stop();
    }
  },[audioBlob, getSharedKey, handleDeleteVoiceNote, loggedInUserId, otherMember.user, sendMessage]);

  return (
    <motion.div
      variants={{ hide: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      initial="hide"
      animate="show"
      className="flex"
    >


      <div className="flex gap-3 items-center px-3 py-4">

        <button onClick={isRecording?stopRecording:startRecording}>
          <VoiceNoteMicIcon isRecording={isRecording}/>
        </button>

        {audioURL && (
            <audio controls>
              <source src={audioURL!} type="audio/webm" />
            </audio>
        )}
      </div>
        
      {!isRecording && !voiceNoteActive && (
        <>
          <button
            key={1}
            onClick={() => toggleAttachmentsMenu((prev) => !prev)}
            className="px-3 py-4 justify-center items-center flex relative"
          >
            <AttachmentIcon />
          </button>

          <button
            key={2}
            onClick={toggleGifForm}
            type="button"
            className="px-3 py-4 hover:text-primary"
          >
            <GifIcon />
          </button>
        </>
      )}

      {
        !isRecording && voiceNoteActive && (
          <>
          <button
            key={1}
            onClick={handleDeleteVoiceNote}
            className="px-3 py-4 justify-center items-center flex relative"
          >
            <DeleteIcon />
          </button>

          <button
            key={2}
            onClick={handleSendVoiceNote}
            type="button"
            className="px-3 py-4 hover:text-primary"
          >
            <SendIcon/>
          </button>
        </>
        )
      }

    </motion.div>
  );
};
