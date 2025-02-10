export interface Message {
    sender: {
        id: string;
        username: string;
        avatar: string;
    };
    attachments: {
        secureUrl: string;
    }[];
    poll: ({
        votes: ({
            user: {
                id: string;
                username: string;
                avatar: string;
            };
            optionIndex: number;
        })[];
        question: string;
        options: string[];
        multipleAnswers: boolean;
    }) | null;
    reactions: {
        user: {
            id: string;
            username: string;
            avatar: string;
        };
        reaction: string;
    }[];
    id: string;
    isTextMessage: boolean;
    textMessageContent: string | null;
    chatId: string;
    url: string | null;
    isPollMessage: boolean;
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
    isNew?:boolean
}