// Accept imports that include a package@version suffix (used in vite.config.ts aliases)
// Match imports that include a package@version suffix used in vite.config.ts aliases.
// Patterns to cover both unscoped (e.g. 'lucide-react@0.487.0') and scoped (e.g. '@radix-ui/react-accordion@1.2.3') names.
declare module "*@*/*" { const v: any; export = v; }
declare module "*/*@*" { const v: any; export = v; }
declare module "*@*" { const v: any; export = v; }

// Fallback declarations for some frequently used libraries without type packages
declare module 'lucide-react' { const m: any; export = m; }
declare module 'recharts' { const m: any; export = m; }
declare module 'react-day-picker' { const m: any; export = m; }
declare module 'embla-carousel-react' { const m: any; export = m; }
declare module 'cmdk' { const m: any; export = m; }
declare module 'class-variance-authority' { const m: any; export = m; }

// Explicit declarations for aliased imports that include version suffixes
declare module "@radix-ui/react-accordion@1.2.3" { const m: any; export = m; }
declare module "lucide-react@0.487.0" { const m: any; export = m; }
declare module "@radix-ui/react-alert-dialog@1.1.6" { const m: any; export = m; }
declare module "@radix-ui/react-aspect-ratio@1.1.2" { const m: any; export = m; }
declare module "@radix-ui/react-avatar@1.1.3" { const m: any; export = m; }
declare module "@radix-ui/react-slot@1.1.2" { const m: any; export = m; }
declare module "react-day-picker@8.10.1" { const m: any; export = m; }
declare module "embla-carousel-react@8.6.0" { const m: any; export = m; }
declare module "recharts@2.15.2" { const m: any; export = m; }
declare module "cmdk@1.1.1" { const m: any; export = m; }
declare module "@radix-ui/react-checkbox@1.1.4" { const m: any; export = m; }
declare module "@radix-ui/react-collapsible@1.1.3" { const m: any; export = m; }
declare module "@radix-ui/react-context-menu@2.2.6" { const m: any; export = m; }
declare module "@radix-ui/react-dialog@1.1.6" { const m: any; export = m; }
declare module "vaul@1.1.2" { const m: any; export = m; }
declare module "@radix-ui/react-dropdown-menu@2.1.6" { const m: any; export = m; }
declare module "react-hook-form@7.55.0" { const m: any; export = m; }
declare module "input-otp@1.4.2" { const m: any; export = m; }
declare module "react-resizable-panels@2.1.7" { const m: any; export = m; }
declare module "@radix-ui/react-hover-card@1.1.6" { const m: any; export = m; }
declare module "@radix-ui/react-label@2.1.2" { const m: any; export = m; }
declare module "@radix-ui/react-menubar@1.1.6" { const m: any; export = m; }
declare module "@radix-ui/react-navigation-menu@1.2.5" { const m: any; export = m; }
declare module "@radix-ui/react-popover@1.1.6" { const m: any; export = m; }
declare module "@radix-ui/react-progress@1.1.2" { const m: any; export = m; }
declare module "@radix-ui/react-radio-group@1.2.3" { const m: any; export = m; }
declare module "@radix-ui/react-scroll-area@1.2.3" { const m: any; export = m; }
declare module "@radix-ui/react-select@2.1.6" { const m: any; export = m; }
declare module "@radix-ui/react-separator@1.1.2" { const m: any; export = m; }
declare module "@radix-ui/react-switch@1.1.3" { const m: any; export = m; }
declare module "@radix-ui/react-tabs@1.1.3" { const m: any; export = m; }
declare module "@radix-ui/react-toggle-group@1.1.2" { const m: any; export = m; }
declare module "@radix-ui/react-toggle@1.1.2" { const m: any; export = m; }
declare module "@radix-ui/react-tooltip@1.1.8" { const m: any; export = m; }
declare module "next-themes@0.4.6" { const m: any; export = m; }
declare module "sonner@2.0.3" { const m: any; export = m; }
