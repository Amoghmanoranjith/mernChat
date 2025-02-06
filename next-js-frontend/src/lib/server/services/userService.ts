import { Prisma } from '@prisma/client';
import 'server-only';
import { prisma } from '../prisma';


// prisma query functions
const fetchUserFriends = async ({loggedInUserId}:{loggedInUserId:string}) => {
  try {
    const friends =  await prisma.friends.findMany({
        where:{
            OR:[{user1Id:loggedInUserId},{user2Id:loggedInUserId}]
        },
        include:{
            user1:{
                select:{
                    id:true,
                    username:true,
                    avatar:true,
                    isOnline:true,
                    publicKey:true,
                    lastSeen:true,
                    verificationBadge:true,
                }
            },
            user2:{
                select:{
                    id:true,
                    username:true,
                    avatar:true,
                    isOnline:true,
                    publicKey:true,
                    lastSeen:true,
                    verificationBadge:true,
                }
            },
        },
        omit:{
            user1Id:true,
            user2Id:true,
            id:true,
        }
    })
    const userFriends = friends.map(friend=>friend.user1.id===loggedInUserId?{...friend.user2,...{createdAt:friend.createdAt}}:{...friend.user1,...{createdAt:friend.createdAt}})
    return userFriends;
  } catch (error) {
    console.log(error);
  }
};

const fetchUserInfo = async ({loggedInUserId}:{loggedInUserId:string}) => {
  try {
    const user =  await prisma.user.findUnique({where:{id:loggedInUserId},select:{
        id:true,
        name:true,
        username:true,
        avatar:true,
        email:true,
        createdAt:true,
        updatedAt:true,
        emailVerified:true,
        publicKey:true,
        notificationsEnabled:true,
        verificationBadge:true,
        fcmToken:true,
        oAuthSignup:true,
        isOnline:true,
        lastSeen:true,
    }})
    return user;
  } catch (error) {
    console.log(error);
  }
};

const fetchUserChats = async ({loggedInUserId}:{loggedInUserId:string}) => {
  try {
    const chats = await prisma.chat.findMany({
        where:{
          ChatMembers:{
            some:{
              userId:loggedInUserId
            }
          }
        },
        omit:{
          avatarCloudinaryPublicId:true,
        },
        include:{
          ChatMembers:{
            include:{
              user:{
                select:{
                  id:true,
                  username:true,
                  avatar:true,
                  isOnline:true,
                  publicKey: true,
                  lastSeen:true,
                  verificationBadge:true,
                }
              },
            },
            omit:{
              chatId:true,
              userId:true,
              id:true,
            }
          },
          UnreadMessages:{
            select:{
              count:true,
              message:{
                select:{
                  isTextMessage:true,
                  url:true,
                  attachments:{
                    select:{
                      secureUrl:true,
                    }
                  },
                  isPollMessage:true,
                  createdAt:true,
                }
              },
              sender:{
                select:{
                  id:true,
                  username:true,
                  avatar:true,
                  isOnline:true,
                  publicKey:true,
                  lastSeen:true,
                  verificationBadge:true
                }
              },
            }
          },
          latestMessage:{
            include:{
              sender:{
                select:{
                  id:true,
                  username:true,
                  avatar:true,
                }
              },
              attachments:{
                select:{
                  secureUrl:true
                }
              },
              poll:true,
              reactions:{
                include:{
                  user:{
                    select:{
                      id:true,
                      username:true,
                      avatar:true
                    }
                  },
                },
                omit:{
                  id: true,
                  createdAt: true,
                  updatedAt: true,
                  userId: true,
                  messageId: true
                }
              },
            }
          }
        },
    })

    return chats.map(chat => ({
      ...chat,
      typingUsers: [] as BasicUserInfo[]
    }));    
  } catch (error) {
    console.log(error);
  }
};

const fetchUserFriendRequest = async ({loggedInUserId}:{loggedInUserId:string}) => {
  try {
    const friendRequests = await prisma.friendRequest.findMany({
        where:{receiverId:loggedInUserId},
        include:{
          sender:{
            select:{
              id:true,
              username:true,
              avatar:true,
              isOnline:true,
              publicKey:true,
              lastSeen:true,
              verificationBadge:true
            }
          }
        },
        omit:{
          receiverId:true,
          updatedAt:true,
          senderId:true,
        }
      })
    return friendRequests;
  } catch (error) {
    console.log(error);
  }
};

// types 
type fetchUserFriendsResponse = {
    createdAt: Date;
    id: string;
    username: string;
    avatar: string;
    publicKey: string | null;
    verificationBadge: boolean;
    isOnline: boolean;
    lastSeen: Date | null;
}

type FetchUserInfoResponse = Prisma.UserGetPayload<{
    select:{
      id:true,
      name:true,
      username:true,
      avatar:true,
      email:true,
      createdAt:true,
      updatedAt:true,
      emailVerified:true,
      publicKey:true,
      notificationsEnabled:true,
      verificationBadge:true,
      fcmToken:true,
      oAuthSignup:true,
      isOnline:true,
      lastSeen:true,
    }
}>

type fetchUserChatsResponse = Prisma.ChatGetPayload<{
  omit:{
    avatarCloudinaryPublicId:true,
  },
  include:{
    ChatMembers:{
      include:{
        user:{
          select:{
            id:true,
            username:true,
            avatar:true,
            isOnline:true,
            publicKey: true,
            lastSeen:true,
            verificationBadge:true,
          }
        },
      },
      omit:{
        chatId:true,
        userId:true,
        id:true,
      }
    },
    UnreadMessages:{
      select:{
        count:true,
        message:{
          select:{
            isTextMessage:true,
            url:true,
            attachments:{
              select:{
                secureUrl:true,
              }
            },
            isPollMessage:true,
            createdAt:true,
          }
        },
        sender:{
          select:{
            id:true,
            username:true,
            avatar:true,
            isOnline:true,
            publicKey:true,
            lastSeen:true,
            verificationBadge:true
          }
        },
      }
    },
    latestMessage:{
      include:{
        sender:{
          select:{
            id:true,
            username:true,
            avatar:true,
          }
        },
        attachments:{
          select:{
            secureUrl:true
          }
        },
        poll:true,
        reactions:{
          include:{
            user:{
              select:{
                id:true,
                username:true,
                avatar:true
              }
            },
          },
          omit:{
            id: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            messageId: true
          }
        },
      }
    }
  }
}>

type fetchUserFriendRequestResponse = Prisma.FriendRequestGetPayload<{
    include:{
        sender:{
          select:{
            id:true,
            username:true,
            avatar:true,
            isOnline:true,
            publicKey:true,
            lastSeen:true,
            verificationBadge:true
          }
        }
      },
      omit:{
        receiverId:true,
        updatedAt:true,
        senderId:true,
      }
}>


type BasicUserInfo = Pick<FetchUserInfoResponse , 'id' | 'username' | 'avatar'>
type ChatMember = Pick<FetchUserInfoResponse, 'avatar' | 'id' | 'isOnline' | 'lastSeen' | 'publicKey' | 'username' | 'verificationBadge'>


export {
  fetchUserChats,
  fetchUserFriendRequest, fetchUserFriends,
  fetchUserInfo
};

export type {
    fetchUserChatsResponse, fetchUserFriendRequestResponse, fetchUserFriendsResponse,
    FetchUserInfoResponse, BasicUserInfo , ChatMember
};

