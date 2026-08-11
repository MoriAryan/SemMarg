import { SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

export function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center gap-3">
        <img src="/logo.png" alt="SemMarg" className="w-8 h-8 object-contain drop-shadow-xl" />
        <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md">SemMarg</span>
      </div>
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#E11D48",
            colorBackground: "#09090b",
            colorInputBackground: "#18181b",
            colorInputText: "#ffffff",
            colorText: "#ffffff",
            colorTextSecondary: "#a1a1aa",
            borderRadius: "0.5rem",
          },
          elements: {
            card: "border border-white/10 shadow-2xl",
          }
        }}
      />
    </div>
  );
}
