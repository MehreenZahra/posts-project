import React from "react";
import SignupForm from "@/components/features/signup-form";

function Signup() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <SignupForm />
     </div>
  );
}

export default Signup;

