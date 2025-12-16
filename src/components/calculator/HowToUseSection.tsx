import { HelpCircle, Lightbulb } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface HowToUseSectionProps {
  children: React.ReactNode;
}

export function HowToUseSection({ children }: HowToUseSectionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="how-to-use" className="border rounded-lg bg-muted/30 px-4">
        <AccordionTrigger className="hover:no-underline py-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
            Como usar esta calculadora
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="text-sm text-muted-foreground space-y-4 pb-2">
            {children}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

interface TipBoxProps {
  children: React.ReactNode;
}

export function TipBox({ children }: TipBoxProps) {
  return (
    <div className="flex gap-2 p-3 rounded-md bg-primary/5 border border-primary/20">
      <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <p className="text-sm">{children}</p>
    </div>
  );
}

interface FieldListProps {
  fields: Array<{
    name: string;
    description: string;
  }>;
}

export function FieldList({ fields }: FieldListProps) {
  return (
    <ul className="space-y-2">
      {fields.map((field, index) => (
        <li key={index} className="flex gap-2">
          <span className="text-primary">•</span>
          <span>
            <strong className="text-foreground">{field.name}</strong> – {field.description}
          </span>
        </li>
      ))}
    </ul>
  );
}
