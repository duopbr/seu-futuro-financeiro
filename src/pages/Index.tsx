import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimulateTab } from '@/components/calculator/SimulateTab';
import { TimeToGoalTab } from '@/components/calculator/TimeToGoalTab';
import { RequiredContributionTab } from '@/components/calculator/RequiredContributionTab';
import { TrendingUp, Clock, PiggyBank, Info } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Calculadora de Patrimônio
              </h1>
              <p className="text-sm text-muted-foreground">
                Simule o crescimento do seu patrimônio com aportes mensais
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Premissas */}
        <div className="mb-6 p-4 rounded-lg bg-muted/50 border">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong>Premissas:</strong> Aportes realizados no fim de cada mês. 
              Rentabilidade anual convertida para taxa mensal efetiva (r = (1 + i)<sup>1/12</sup> - 1).
              Valores em Reais (R$).
            </p>
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
