import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function LoadingState() {
  return (
    <div className="ticket-list-state" role="status" aria-busy="true">
      <Spinner />
      <p>Loading…</p>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="ticket-list-state" role="alert">
      <p>Something went wrong.</p>
      {message && <p>{message}</p>}
      <Button variant="primary" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="ticket-list-state">
      <p>{message}</p>
    </div>
  );
}
