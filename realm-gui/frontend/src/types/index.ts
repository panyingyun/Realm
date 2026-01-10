export interface Category {
  name: string;
  icon: string;
  color: string;
}

export interface Password {
  id: string;
  name: string;
  url: string;
  username: string;
  password: string;
  category: string;
}

export interface Settings {
  language: string; // "zh" | "en"
  theme: string;    // "light" | "dark"
}
