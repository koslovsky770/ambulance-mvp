import { PageHeader } from "@/components/shared/page-header";
import { VehicleForm } from "../vehicle-form";
import { upsertEntity } from "@/lib/entities";

export default function NewVehiclePage() {
  const action = async (fd: FormData) => { "use server"; await upsertEntity("vehicles", null, fd); };
  return (
    <div className="max-w-xl">
      <PageHeader title="רכב חדש" />
      <div className="card"><VehicleForm action={action} /></div>
    </div>
  );
}
