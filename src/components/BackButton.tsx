"use client";
 
import Button from "@/src/components/Button";
 
export default function BackButton() {
  return (
<Button
      variant="ghost"
      onClick={() => window.history.back()}
      className="flex items-center gap-2"
>
      ← Back
</Button>
  );
}