import { ChefHat } from "lucide-react";

export default function QuisineLoader({ text = "Loading...", fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        {/* Outer Spinning Ring */}
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-slate-200 border-t-orange-600"></div>
        
        {/* Inner Pulsing Icon */}
        <div className="absolute animate-pulse">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                <ChefHat className="h-8 w-8" />
            </div>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="flex flex-col items-center animate-pulse">
        <h3 className="text-lg font-bold text-slate-800">Quisine-IQ</h3>
        <p className="text-sm font-medium text-slate-500">{text}</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="flex h-full w-full items-center justify-center py-20">{content}</div>;
}