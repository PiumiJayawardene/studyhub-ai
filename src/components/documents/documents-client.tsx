"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadDialog } from "@/components/documents/upload-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteDocument } from "@/lib/actions/documents";
import { FileText, Trash2 } from "lucide-react";
import type { Subject } from "@/types/subject";

type DocumentListItem = {
  id: string;
  filename: string;
  file_path: string;
  file_type: string;
  file_size_bytes: number;
  status: string;
  created_at: string;
};

function formatSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const statusBadge: Record<string, string> = {
  processing: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  ready: "bg-green-500/10 text-green-700 dark:text-green-400",
  failed: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export function DocumentsClient({
  documents,
  subjects,
}: {
  documents: DocumentListItem[];
  subjects: Subject[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <UploadDialog subjects={subjects} />
      </div>

      <div className="flex flex-col gap-3">
        {documents.length === 0 && (
          <p className="text-muted-foreground text-sm">No documents uploaded yet.</p>
        )}
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{doc.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.file_type.toUpperCase()} · {formatSize(doc.file_size_bytes)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={statusBadge[doc.status]}>{doc.status}</Badge>
                <AlertDialog>
                  <AlertDialogTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted">
  <Trash2 className="h-4 w-4" />
</AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete &quot;{doc.filename}&quot;?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This removes the file and its indexed content. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
  onClick={() => deleteDocument(doc.id, doc.file_path)}
>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}