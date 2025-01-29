import { getMessaging, getToken } from "firebase/messaging"
import { useEffect, useState } from "react"
import { useUpdateFcmToken } from "../../hooks/useAuth/useUpdateFcmToken"
import { useUpdateNotificationsFlag } from "../../hooks/useUser/useUpdateNotificationsFlag"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { useAppSelector } from "../../services/redux/store/hooks"


const SettingsForm = () => {

    const {updateFcmToken} = useUpdateFcmToken()
    const {updateNotificationsFlag} = useUpdateNotificationsFlag()

    const loggedInUser = useAppSelector(selectLoggedInUser)

    const [notificationsEnabled,setNotificationsEnabled] = useState<boolean>(false)

    useEffect(()=>{
        if(loggedInUser){
            setNotificationsEnabled(loggedInUser?.notificationsEnabled)
        }
    },[loggedInUser])

    const messaging = getMessaging();

    const handleNotificationChange = async()=>{

            if(!notificationsEnabled){

    
                if(!loggedInUser?.fcmTokenExists){
    
                    const permission = await Notification.requestPermission()
        
                    if(permission==='granted'){
        
                        setNotificationsEnabled(true);
    
                        if(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY) {
                            try {
                                const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY });
                                updateFcmToken({ fcmToken: token });
                            } 
                            catch (error) {
                                console.error("Error obtaining FCM token:", error);
                            }
                        }
                        
                    }
                }

                updateNotificationsFlag({isEnabled:true})
    
            }
            else{
                updateNotificationsFlag({isEnabled:false})
            }
        
    }

  return (
    <div className="">
        <div className="flex justify-between items-center">
            <p>Notifications</p>
            <label className="inline-flex items-center cursor-pointer">
                <input onChange={handleNotificationChange} type="checkbox" checked={notificationsEnabled} className="sr-only peer"/>
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
        </div>
    </div>
  )
}

export default SettingsForm;
