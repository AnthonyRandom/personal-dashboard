import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RemoveWidgetDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  widgetTitle: string;
  onConfirm: () => void;
}

export function RemoveWidgetDialog({
  isOpen,
  onOpenChange,
  widgetTitle,
  onConfirm,
}: RemoveWidgetDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Widget</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove the "{widgetTitle}" widget from your dashboard? 
            You can always add it back later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-accent focus:ring-2 focus:ring-primary/20">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-2 focus:ring-destructive/20"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
