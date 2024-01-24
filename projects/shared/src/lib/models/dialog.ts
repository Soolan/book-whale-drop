export interface Dialog {
  heading: string;
  content: string;
  buttons: Button[];
}

export interface Button {
  action: string;
  icon: string;
}
