
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface ChecklistData {
  title: string;
  items: ChecklistItem[];
}
