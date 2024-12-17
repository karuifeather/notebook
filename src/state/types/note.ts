export interface Note {
  id?: string;
  title: string;
  description: string;
  dependencies: string[];
}

export interface NoteDetails {
  data: {
    [key: string]: Note; // Notes by ID
  };
}
