export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-xl font-semibold">Authentication error</h1>
        <p className="text-muted-foreground mt-2">
          Something went wrong signing you in. Please try again.
        </p>
      </div>
    </main>
  );
}