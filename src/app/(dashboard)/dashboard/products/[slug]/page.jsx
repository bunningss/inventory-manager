import { Block } from "@/components/block";
import { EditProduct } from "@/components/dashboard/forms/edit-product";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function EditForm({ params }) {
  const [products, categories] = await Promise.all([
    getData(`products/${params}`, 0),
    getData("categories", 0),
  ]);

  return (
    <EditProduct
      currentProduct={products.response.payload}
      categories={categories.response.payload}
    />
  );
}

export default function Page({ params }) {
  return (
    <div>
      <Block title="edit product"></Block>

      <div className="mt-8">
        <Suspense fallback={<p>Loading...</p>}>
          <EditForm params={params.slug} />
        </Suspense>
      </div>
    </div>
  );
}
