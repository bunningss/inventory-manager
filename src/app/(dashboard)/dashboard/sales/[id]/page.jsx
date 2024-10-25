import { getData } from "@/utils/api-calls";
import { Receipt } from "@/components/sales/receipt";

export default async function Page({ params }) {
  const res = await getData(`sales/${params.id}`);

  return <Receipt data={res.response.payload} />;
}
