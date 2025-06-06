export interface Assignment {
  id: number;
  title: string;
  description: string;
  deadline?: string;
}

export interface Course {
  id: number;
  name: string;
  assignments: Assignment[];
}
