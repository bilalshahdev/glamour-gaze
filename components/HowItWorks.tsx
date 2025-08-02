import { steps } from "@/data";

export const HowItWorks = () => {
  return (
    <div className="space-y-6 animate-slideInRight">
      <div className="glass rounded-2xl p-6 shadow-lg border border-fuchsia-200/20 dark:border-fuchsia-800/20">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          How it works
        </h3>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-3 animate-fadeInUp"
              style={{ animationDelay: step.delay }}
            >
              <div className="w-8 h-8 bg-fuchsia-gradient text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div>
                <h4 className="font-medium text-foreground">{step.title}</h4>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
