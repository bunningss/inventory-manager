import { Heading } from "../heading";
import { RichTextViewer } from "../rich-text-viewer";
import { Section } from "../section";

export function ProductDetails({ currentProduct }) {
  return (
    <Section className="space-y-4">
      <Heading className="grid gap-2 text-xl font-bold capitalize after:content-[''] after:h-[1px] after:w-full after:rounded-md after:bg-muted">
        Description
      </Heading>
      {/* <RichTextViewer htmlContent={currentProduct?.description} /> */}
      <RichTextViewer htmlContent="" />
    </Section>
  );
}
