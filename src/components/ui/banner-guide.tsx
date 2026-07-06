'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export interface GuideStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface BannerGuideProps {
  steps: GuideStep[];
  compactTitle: string;
  compactDescription: string;
  onFinish?: () => void;
}

export function BannerGuide({ steps, compactTitle, compactDescription, onFinish }: BannerGuideProps) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setStep(steps.length); // Finished
      if (onFinish) onFinish();
    }
  };

  return (
    <div className="mb-8">
      <AnimatePresence mode="wait">
        {step < steps.length ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-neutral-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 [&>svg]:w-64 [&>svg]:h-64">
              {steps[step].icon}
            </div>
            
            <div className="relative z-10 max-w-2xl">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 [&>svg]:w-8 [&>svg]:h-8">
                {steps[step].icon}
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                {steps[step].title}
              </h2>
              <p className="text-lg text-neutral-300 mb-8 leading-relaxed">
                {steps[step].description}
              </p>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={handleNext}
                  className="bg-white text-neutral-900 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-neutral-100 transition-colors"
                >
                  {step === steps.length - 1 ? 'Entendi' : 'Próximo'}
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                <div className="flex gap-2">
                  {steps.map((_, i) => (
                    <div 
                      key={i}
                      className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              {compactTitle}
            </h1>
            <p className="text-neutral-500 mt-1">
              {compactDescription}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
