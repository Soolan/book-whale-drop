export interface Dialog {
  title: string;
  content: string;
  actions: Button[];
}

export interface Button {
  action: string;
  icon: string;
}
