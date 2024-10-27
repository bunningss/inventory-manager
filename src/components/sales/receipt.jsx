"use client";
import { useReactToPrint } from "react-to-print";
import { Block } from "../block";
import { SalesReceiptCard } from "./sales-receipt-card";
import { useRef } from "react";
import { Button } from "../ui/button";
import { Heading } from "../heading";

export function Receipt({ data }) {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <>
      <div className="print:px-6 print:pt-6" ref={contentRef}>
        <Block
          title="Purchase receipt"
          headerContent={<p className="hidden print:block">{data?._id}</p>}
        >
          <Heading className="text-center mb-8 underline hidden print:block">
            My Shop
          </Heading>
          <div className="space-y-1">
            {data?.products?.map((item, index) => (
              <SalesReceiptCard key={index} item={item} />
            ))}
            <div className="py-4 flex justify-between border-b border-b-input">
              <span className="text-sm text-muted-foreground">TOTAL</span>
              <span className="text-sm font-bold">
                ৳{(data?.amount / 100).toFixed(2)}
              </span>
            </div>
          </div>
          <span className="mt-6 hidden print:block text-muted-foreground text-center">
            Software solution provided by{" "}
            <b>
              <em>ZERIS Technologies</em>
            </b>
          </span>
        </Block>
      </div>
      <Button onClick={reactToPrintFn}>Print receipt</Button>
    </>
  );
}