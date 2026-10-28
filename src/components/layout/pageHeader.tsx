import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./pageHeader.css";

interface PageHeaderProps {
  title: string;
  back?: {
    label: string;
    onClick: () => void;
  };
}

export function PageHeader({ title, back }: PageHeaderProps) {
  return (
    <header className="page-header">
      {back && (
        <Button variant="secondary" className="page-header__back" onClick={back.onClick}>
          <ArrowLeft size={16} aria-hidden="true" />
          {back.label}
        </Button>
      )}
      <h1 className="page-header__title">{title}</h1>
    </header>
  );
}
