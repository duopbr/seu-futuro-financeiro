import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'Esta calculadora é de juros compostos?',
    answer: 'Sim. Ela considera capital inicial + aportes mensais e aplica a rentabilidade ao longo do tempo, mostrando a evolução do patrimônio com o efeito dos juros compostos.',
  },
  {
    question: 'A taxa é ao mês ou ao ano?',
    answer: 'Você informa a taxa ao ano. A calculadora converte para uma taxa mensal equivalente usando a fórmula r = (1 + i)^(1/12) - 1 para simular mês a mês.',
  },
  {
    question: 'O aporte é no começo ou no fim do mês?',
    answer: 'Por padrão, consideramos o aporte no fim do mês. Isso é uma convenção comum em calculadoras financeiras e reflete a realidade de quem investe após receber o salário.',
  },
  {
    question: 'O resultado é garantido?',
    answer: 'Não. É uma simulação baseada em premissas. Na prática, investimentos variam, taxas mudam e podem existir impostos, taxas de administração e volatilidade.',
  },
  {
    question: 'Consigo simular sem aporte mensal?',
    answer: 'Sim. Basta colocar aporte = R$ 0 para ver como um valor inicial cresce apenas com a rentabilidade. É útil para comparar com cenários com aportes.',
  },
  {
    question: 'Como interpretar "Total investido" vs "Patrimônio"?',
    answer: '"Total investido" é o quanto você colocou do bolso (inicial + soma dos aportes). "Patrimônio" é esse total mais os rendimentos acumulados ao longo do tempo.',
  },
  {
    question: 'Posso usar para comparar cenários?',
    answer: 'Sim! Compare taxas e prazos diferentes para ver como pequenas mudanças impactam o patrimônio no longo prazo. O prazo é geralmente o maior acelerador por causa dos juros compostos.',
  },
];

export function FAQSection() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Perguntas frequentes
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
