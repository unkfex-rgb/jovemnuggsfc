import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="glass rounded-2xl p-6 border-red-500/30 flex items-center gap-4">
      <AlertCircle className="text-red-500" size={24} />
      <div>
        <p className="text-white font-semibold">Erro ao carregar dados</p>
        <p className="text-white/60 text-sm">{message}</p>
      </div>
    </div>
  );
}
