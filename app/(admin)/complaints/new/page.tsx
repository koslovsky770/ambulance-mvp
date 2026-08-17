import { PageHeader } from "@/components/shared/page-header";
import { ComplaintForm } from "../complaint-form";
import { upsertEntity } from "@/lib/entities";

export default function NewComplaintPage() {
  const action = async (fd: FormData) => { "use server"; await upsertEntity("complaints", null, fd); };
  return (
    <div className="max-w-xl">
      <PageHeader title="תלונה חדשה" />
      <div className="card"><ComplaintForm action={action} /></div>
    </div>
  );
}
