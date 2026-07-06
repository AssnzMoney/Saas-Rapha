import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center min-h-[500px]">
      <div className="flex flex-col items-center gap-4 text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        <p className="text-sm font-medium animate-pulse">Carregando painel...</p>
      </div>
    </div>
  );
}
