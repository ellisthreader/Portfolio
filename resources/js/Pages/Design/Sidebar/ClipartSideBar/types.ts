export interface ClipartItem {
  id: string;
  label: string;
}

export interface ClipartCategoryType {
  id: string;
  name: string;
  items: ClipartItem[];
}
