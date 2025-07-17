import { Button } from "@repo/ui/components/ui/button";

export default function HomePage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to Vidwanic Magazine
      </h1>
      <div className="text-center">
        <p className="text-lg mb-4">
          Your educational magazine platform for India
        </p>
        <Button>Get Started</Button>
      </div>
    </main>
  );
}