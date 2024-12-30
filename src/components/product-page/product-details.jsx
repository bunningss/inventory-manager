import { Heading } from "../heading";
import { RichTextViewer } from "../rich-text-viewer";

export function ProductDetails({ currentProduct }) {
  return (
    <section className="space-y-2 my-6">
      <Heading className="grid gap-2 text-xl font-bold capitalize after:content-[''] after:h-[1px] after:w-full after:rounded-md after:bg-muted">
        Description
      </Heading>
      {/* <RichTextViewer htmlContent={currentProduct?.description} /> */}
      <RichTextViewer htmlContent="" />
    </section>
  );
}
