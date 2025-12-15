import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useLeadCapture } from '@/hooks/use-lead-capture';
import { toast } from 'sonner';

interface LeadCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  calculatorType: string;
}

export function LeadCaptureDialog({ open, onOpenChange, onSubmit, calculatorType }: LeadCaptureDialogProps) {
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  const [perfil, setPerfil] = useState('');
  const [errors, setErrors] = useState<{ nome?: string; celular?: string; perfil?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setLeadCaptured } = useLeadCapture();

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCelular(formatPhone(e.target.value));
  };

  const validate = () => {
    const newErrors: { nome?: string; celular?: string; perfil?: string } = {};
    
    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    const phoneNumbers = celular.replace(/\D/g, '');
    if (!phoneNumbers || phoneNumbers.length < 10) {
      newErrors.celular = 'Celular inválido';
    }
    
    if (!perfil) {
      newErrors.perfil = 'Selecione seu perfil';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('Calculadoras')
        .insert({
          Name: nome.trim(),
          phone: celular,
          perfil: perfil,
          calculadora: calculatorType
        });

      if (error) {
        console.error('Error saving lead:', error);
        toast.error('Erro ao salvar dados. Tente novamente.');
        setIsSubmitting(false);
        return;
      }

      setLeadCaptured();
      onSubmit();
      onOpenChange(false);
    } catch (err) {
      console.error('Error saving lead:', err);
      toast.error('Erro ao salvar dados. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quase lá!</DialogTitle>
          <DialogDescription>
            Preencha seus dados para ver o resultado da simulação
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={errors.nome ? 'border-destructive' : ''}
            />
            {errors.nome && (
              <p className="text-xs text-destructive">{errors.nome}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="celular">WhatsApp</Label>
            <Input
              id="celular"
              type="tel"
              placeholder="(11) 99999-9999"
              value={celular}
              onChange={handleCelularChange}
              className={errors.celular ? 'border-destructive' : ''}
            />
            {errors.celular && (
              <p className="text-xs text-destructive">{errors.celular}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="perfil">Seu perfil</Label>
            <Select value={perfil} onValueChange={setPerfil}>
              <SelectTrigger className={errors.perfil ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="investidor">Investidor</SelectItem>
                <SelectItem value="assessor">Assessor de Investimentos</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            {errors.perfil && (
              <p className="text-xs text-destructive">{errors.perfil}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Ver Resultados'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
