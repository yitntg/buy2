export interface Category {
  subtitle: string;
  items: string[];
}

export interface MenuData {
  title: string;
  categories: Category[];
  image: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuData: MenuData[];
} 