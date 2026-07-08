import { getDocuments } from "@/lib/actions/documents";
import { getSubjects } from "@/lib/actions/subjects";
import { DocumentsClient } from "@/components/documents/documents-client";

export default async function DocumentsPage() {
  const [documents, subjects] = await Promise.all([
    getDocuments(),
    getSubjects(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Documents</h1>
        <p className="text-muted-foreground">
          Upload Word docs or text files to chat with them.
        </p>
      </div>

      <DocumentsClient
        documents={documents}
        subjects={subjects}
      />
    </div>
  );
}