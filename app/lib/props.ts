
export interface ChatterProps {
    chat_id: string,
    onChangeChatId: Function,
    newMessageChatId?: number,
    shown?: boolean,
    onUpdateChatList?: Function,
}

export interface AgoraMsgProps {
    onNewMessage: Function,
    chat_id: string,
    shown?: boolean,
    onChangeChatId: Function,
    currentUserEmail: string,
    targetUserEmail: string,
}

export interface JSXComponentProps {
  children: React.ReactNode; 
}

export interface JSXComponentPropsModal {
  children: React.ReactNode; 
  isOpen: boolean;
  onClose: Function;
  className?: string;
}
