import { PageHeader } from "@/components/shared/page-header";
import { PatientForm } from "../patient-form";
import { upsertEntity } from "@/lib/entities";

export default function NewPatientPage() {
  const action = async (fd: FormData) => { "use server"; await upsertEntity("patients", null, fd); };
  return (
    <div className="max-w-xl">
      <PageHeader title="מטופל חדש" />
      <div className="card"><PatientForm action={action} /></div>
    </div>
  );
}
