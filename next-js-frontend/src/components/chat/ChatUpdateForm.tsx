import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUpdateChat } from "../../hooks/useChat/useUpdateChat";
import { selectSelectedChatDetails } from "../../lib/client/slices/chatSlice";
import { useAppSelector } from "../../lib/client/store/hooks";
import { FormInput } from "../ui/FormInput";
import {
  GroupChatSchemaType,
  groupChatSchema,
} from "@/lib/shared/zod/schemas/chat.schema";
import Image from "next/image";

const ChatUpdateForm = () => {
  const [selectedImage, setSelectedImage] = useState<Blob>();
  const [selectedImagePreview, setSelectedImagePreview] = useState<string>();

  const { updateChat } = useUpdateChat();
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GroupChatSchemaType>({ resolver: zodResolver(groupChatSchema) });
  const nameVal = watch("name", selectedChatDetails?.name || '');

  const onSubmit: SubmitHandler<GroupChatSchemaType> = ({ name }) => {
    if (selectedChatDetails) {
      const payload: {
        chatId: string;
        avatar?: Blob | undefined;
        name?: string | undefined;
      } = {
        chatId: selectedChatDetails?.id,
      };

      if (name.trim() !== selectedChatDetails.name) payload.name = name;

      if (selectedImage) payload.avatar = selectedImage;

      updateChat(payload);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files[0]) {
      setSelectedImage(files[0]);
      setSelectedImagePreview(URL.createObjectURL(files[0]));
    }
  };

  return (
    selectedChatDetails &&
    selectedChatDetails.avatar &&
    selectedChatDetails.name && (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-y-4"
      >
        <div className="relative">
          <input
            onChange={handleImageChange}
            type="file"
            className="w-full h-full cursor-pointer absolute opacity-0"
          />
          <Image
            src={
              selectedImagePreview
                ? selectedImagePreview
                : selectedChatDetails.avatar
            }
            className="size-40"
            height={100}
            width={100}
            alt="group chat avatar"
          />
        </div>

        <FormInput
          error={errors.name?.message}
          register={{
            ...register("name", { value: selectedChatDetails.name }),
          }}
          placeholder="Chat name"
        />

        <button
          disabled={
            selectedChatDetails.name.trim() === nameVal?.trim() &&
            !selectedImage
          }
          type="submit"
          className="px-8 py-2 bg-primary rounded-sm shadow-md hover:bg-primary-dark disabled:bg-secondary-dark"
        >
          Update
        </button>
      </form>
    )
  );
};

export default ChatUpdateForm;
