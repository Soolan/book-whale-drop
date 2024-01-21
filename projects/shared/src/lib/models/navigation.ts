export interface Navigation {
  name: string;
  options: Option[];
}

export interface Option {
  label: string;
  route: string;
  icon: string;
}
