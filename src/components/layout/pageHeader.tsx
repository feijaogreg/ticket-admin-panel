import { useEffect, useRef } from "react";
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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const previousTitle = useRef(title);

  // Navigating removes the button that had focus, so move focus to the new page's
  // title. Skipped on first render so the initial page load doesn't steal focus.
  useEffect(() => {
    if (previousTitle.current !== title) {
      previousTitle.current = title;
      titleRef.current?.focus();
    }
  }, [title]);

  return (
    <header className="page-header">
      {back && (
        <Button variant="secondary" className="page-header__back" onClick={back.onClick}>
          <ArrowLeft size={16} aria-hidden="true" />
          {back.label}
        </Button>
      )}
      <h1 ref={titleRef} tabIndex={-1} className="page-header__title">
        {title}
      </h1>
    </header>
  );
}
