import { PageHeader } from "@/components/shared/page-header";
import { InstitutionForm } from "../institution-form";
import { upsertEntity } from "@/lib/entities";

export default function NewInstitutionPage() {
  const action = async (fd: FormData) => { "use server"; await upsertEntity("institutions", null, fd); };
  return (
    <div className="max-w-xl">
      <PageHeader title="מוסד חדש" />
      <div className="card"><InstitutionForm action={action} /></div>
    </div>
  );
}
