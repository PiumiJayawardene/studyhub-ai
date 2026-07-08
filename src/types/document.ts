export type DocumentFileType = "pdf" | "docx" | "txt";
export type DocumentStatus = "processing" | "ready" | "failed";

export type StudyDocument = {
  id: string;
  user_id: string;
  subject_id: string | null;
  filename: string;
  file_path: string;
  file_type: DocumentFileType;
  file_size_bytes: number;
  extracted_text: string;
  status: DocumentStatus;
  created_at: string;
};