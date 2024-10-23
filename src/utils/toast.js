import { toast } from "sonner";

export function successNotification(message, description = "") {
  toast.success(message, {
    description: description,
    closeButton: true,
  });
}

export function errorNotification(message, description = "") {
  toast.error(message, {
    description: description,
    closeButton: true,
  });
}

export function warningNotification(message, description = "") {
  toast.warning(message, {
    description: description,
    closeButton: true,
  });
}

export function infoNotification(message, description = "") {
  toast.info(message, {
    description: description,
    closeButton: true,
  });
}
