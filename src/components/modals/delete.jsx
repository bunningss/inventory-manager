"use client";
import { useState } from "react";
import { errorNotification, successNotification } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { deleteData } from "@/utils/api-calls";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

export function DeleteItem({ _id, requestUrl }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setIsLoading(true);

    try {
      const res = await deleteData(requestUrl, { _id: _id });

      if (res.error) {
        return errorNotification(res.response.msg);
      }

      successNotification(res.response.msg);
      router.refresh();
      handleModalClose();
    } catch (err) {
      errorNotification(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <Button
        onClick={() => setIsModalOpen(true)}
        icon="delete"
        variant="destructive"
        size="icon"
        className="rounded-full"
      >
        <span className="sr-only">delete item</span>
      </Button>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>delete item</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <span className="text-base capitalize">
            are you sure you want to delete this item?
          </span>
          <div className="grid md:grid-cols-2 gap-2">
            <Button
              disabled={isLoading}
              loading={isLoading}
              variant="destructive"
              icon="delete"
              onClick={handleDelete}
            >
              confirm
            </Button>
            <Button
              disabled={isLoading}
              loading={isLoading}
              onClick={handleModalClose}
            >
              go back
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
