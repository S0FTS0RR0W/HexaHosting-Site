export default function Footer() {
  return (
    // make the footer stick to the bottom of the viewport and span full width
    <footer className="fixed bottom-0 w-full z-10 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-4 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-center">
            © 2026 HexaHosting. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
