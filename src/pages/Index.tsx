import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimulateTab } from '@/components/calculator/SimulateTab';
import { TimeToGoalTab } from '@/components/calculator/TimeToGoalTab';
import { RequiredContributionTab } from '@/components/calculator/RequiredContributionTab';
import { FAQSection } from '@/components/calculator/FAQSection';
import { TrendingUp, Clock, PiggyBank, Info } from 'lucide-react';
import logo from '@/assets/logo.webp';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Duop" className="h-10" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Calculadora de Patrimônio com Juros Compostos
              </h1>
              <p className="text-sm text-muted-foreground">
                Veja quanto seu dinheiro pode crescer com aportes mensais, valor inicial e uma taxa anual. 
                Compare patrimônio vs. total investido e descubra o caminho até sua meta.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* How It Works Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Como funciona esta calculadora de patrimônio
          </h2>
          <p className="text-muted-foreground mb-4">
            Esta calculadora estima a evolução do seu patrimônio ao longo do tempo considerando três fatores: 
            valor inicial, aportes mensais e rentabilidade anual. Ela cria uma linha do tempo mês a mês para 
            mostrar o patrimônio total e o total investido, facilitando entender quanto veio de aportes e 
            quanto veio de juros compostos.
          </p>
          
          <h3 className="text-lg font-medium text-foreground mb-2">
            O que você consegue calcular aqui
          </h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
            <li><strong>Patrimônio futuro:</strong> quanto você pode ter após X anos investindo um valor fixo por mês.</li>
            <li><strong>Tempo para atingir uma meta:</strong> em quantos meses/anos você alcança um patrimônio objetivo.</li>
            <li><strong>Aporte necessário:</strong> quanto investir por mês para chegar em um valor desejado dentro de um prazo.</li>
          </ul>
        </section>

        {/* Premissas */}
        <div className="mb-6 p-4 rounded-lg bg-muted/50 border">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Premissas importantes:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>A rentabilidade é informada em % ao ano e convertida para taxa mensal.</li>
                <li>Por padrão, o aporte mensal é considerado no fim de cada mês.</li>
                <li>Resultados são estimativas e não garantem retorno real (rentabilidade pode variar).</li>
              </ul>
              <p className="mt-2 italic">
                Dica: se você estiver comparando cenários, teste taxas conservadoras e prazos diferentes. 
                O prazo costuma ser o maior acelerador do patrimônio por causa dos juros compostos.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator Tabs */}
        <Tabs defaultValue="simulate" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="simulate" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 hidden sm:block" />
              <span className="text-xs sm:text-sm">Simular</span>
            </TabsTrigger>
            <TabsTrigger value="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4 hidden sm:block" />
              <span className="text-xs sm:text-sm">Tempo</span>
            </TabsTrigger>
            <TabsTrigger value="contribution" className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 hidden sm:block" />
              <span className="text-xs sm:text-sm">Aporte</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulate">
            <SimulateTab />
          </TabsContent>

          <TabsContent value="time">
            <TimeToGoalTab />
          </TabsContent>

          <TabsContent value="contribution">
            <RequiredContributionTab />
          </TabsContent>
        </Tabs>

        {/* Compound Interest Education Section */}
        <section className="mt-12 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Juros compostos: por que fazem tanta diferença no patrimônio
            </h2>
            <p className="text-muted-foreground">
              Juros compostos significam "juros sobre juros". Quando você investe de forma recorrente, 
              parte do seu retorno vem do capital original, parte vem dos aportes e uma parte crescente 
              vem do acúmulo de rendimentos ao longo do tempo. Quanto maior o prazo, mais expressivo 
              é esse efeito.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Simulador de investimentos com aportes mensais
            </h3>
            <p className="text-muted-foreground">
              Se você investe todo mês, mesmo que o aporte pareça pequeno, o efeito no longo prazo 
              pode ser grande. Por isso, a calculadora mostra duas curvas: Patrimônio (com juros) e 
              Total investido (só o que você colocou). A diferença entre elas mostra exatamente 
              quanto você ganhou com os juros compostos.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Em quanto tempo atinjo meu objetivo?
            </h3>
            <p className="text-muted-foreground">
              Se você tem uma meta (por exemplo, R$ 100 mil, R$ 500 mil ou R$ 1 milhão), a calculadora 
              estima o tempo necessário com base no que você já tem, quanto consegue aportar e a taxa 
              anual esperada. Use a aba "Tempo" para essa simulação.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Quanto preciso investir por mês para chegar na meta?
            </h3>
            <p className="text-muted-foreground">
              Se você tem um prazo definido (ex.: 5, 10 ou 20 anos), a calculadora encontra o aporte 
              mensal necessário para atingir o patrimônio objetivo. Use a aba "Aporte" para essa simulação.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Esta calculadora é apenas para fins educacionais. 
            Consulte um profissional de investimentos para decisões financeiras.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
