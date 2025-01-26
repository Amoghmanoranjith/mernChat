import { UserTypingEventReceiveData } from "@/interfaces/chat.interface"
import { Event } from "@/interfaces/events.interface"
import { chatApi } from "@/services/api/chat.api"
import { removeUserTyping, selectSelectedChatDetails, updateUserTyping } from "@/services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "@/services/redux/store/hooks"
import { useEffect, useRef } from "react"
import { useSocketEvent } from "../useSocket/useSocketEvent"


export const useTypingListener = () => {
  
    const dispatch = useAppDispatch()

    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
    const selectedChatDetailsRef = useRef(selectedChatDetails);

    useEffect(() => {
      selectedChatDetailsRef.current = selectedChatDetails;
    }, [selectedChatDetails]);
    
    useSocketEvent(Event.USER_TYPING,({chatId,user}:UserTypingEventReceiveData)=>{
      
      if(selectedChatDetailsRef.current){

        const isTypinginOpennedChat = chatId === selectedChatDetailsRef.current._id;

        if(isTypinginOpennedChat){
            const isUserAlreadyTyping = selectedChatDetailsRef.current.userTyping.some(typingUser=>typingUser._id==user._id)
            if(!isUserAlreadyTyping){
              dispatch(updateUserTyping(user))
              setTimeout(() => {
                dispatch(removeUserTyping(user._id));
              }, 1000);
            }
        }
        else{
            let userExistsInTypingArray:boolean = false
            dispatch(
              chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
                const chat = draft.find(chat=>chat._id===chatId)
                if(chat){
                  const isUserAlreadyTyping = chat.userTyping.some(typingUser=>typingUser._id==user._id)
                  if(!isUserAlreadyTyping){
                    chat.userTyping.push(user)
                    userExistsInTypingArray = true
                  }
                }
              })
            )
            if(userExistsInTypingArray){
              setTimeout(() => {
                dispatch(
                  chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
                    const chat = draft.find(chat=>chat._id===chatId)
                    if(chat){ 
                      chat.userTyping =  chat.userTyping.filter(typingUser=>typingUser._id!==user._id)
                    }
                  })
                )
              }, 1000);
            }
        }
      }

      })
}
