
export interface ChatterProps {
    chat_id: string,
    onChangeChatId: Function,
    shown?: boolean
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
