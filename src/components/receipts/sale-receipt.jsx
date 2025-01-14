"use client";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";
import { Block } from "../block";
import { useRef } from "react";
import { Button } from "../ui/button";
import { Heading } from "../heading";

export function SaleReceipt({ data }) {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const headerContent = (
    <div>
      {data?.customerName && (
        <p className="font-bold capitalize">{data?.customerName}</p>
      )}
      <p>{data?.saleId}</p>
    </div>
  );

  return (
    <>
      <div className="print:px-6 print:pt-6 space-y-4" ref={contentRef}>
        <Block title="Purchase receipt" headerContent={headerContent} />
        <div>
          <Heading className="text-center mb-8 underline hidden print:block">
            {process.env.NEXT_PUBLIC_SHOP_NAME}
          </Heading>
          <div className="space-y-1">
            {data?.products?.map((item, index) => (
              <SalesReceiptItem key={index} item={item} />
            ))}
            <div className="py-4 flex justify-between border-b border-b-input">
              <span className="text-sm text-muted-foreground">TOTAL</span>
              <span className="text-sm font-bold">
                ৳{(data?.amount / 100).toFixed(2)}
              </span>
            </div>
            <div className="py-4 flex justify-between border-b border-b-input">
              <span className="text-sm text-muted-foreground">PAID</span>
              <span className="text-sm font-bold">
                ৳{(data?.paid / 100).toFixed(2)}
              </span>
            </div>
            <div className="py-4 flex justify-between border-b border-b-input">
              <span className="text-sm text-muted-foreground">DUE</span>
              <span className="text-sm font-bold">
                ৳{((data?.amount - data?.paid) / 100).toFixed(2)}
              </span>
            </div>
          </div>
          <span className="mt-6 block text-muted-foreground text-center">
            Software solution provided by{" "}
            <b>
              <em>{process.env.NEXT_PUBLIC_COMPANY_NAME}</em>
            </b>
          </span>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={reactToPrintFn}>Print receipt</Button>
      </div>
    </>
  );
}

function SalesReceiptItem({ item }) {
  return (
    <div className="flex space-x-2 border-b border-input">
      <figure className="relative h-16 w-16 rounded-md overflow-hidden">
        <Image
          src={item.images[0] ? item.images[0] : ""}
          alt={item?.title}
          className="object-contain"
          fill
        />
      </figure>
      <div className="w-full flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <h6 className="text-sm font-bold capitalize">{item?.title}</h6>
          <h6 className="text-sm font-bold">
            ৳{((item?.price * item?.quantity) / 100).toFixed(2)}
          </h6>
        </div>
        <span className="text-sm text-muted-foreground">
          ৳{(item?.price / 100).toFixed(2)} x {item?.quantity}
        </span>
        <span className="capitalize text-sm text-muted-foreground">
          {item?.brand}
        </span>
      </div>
    </div>
  );
}
