import { LoaderCircle } from 'lucide-react';
export default function LoadingSpinner(){return <div className="grid min-h-40 place-items-center text-slate-500" role="status" aria-live="polite"><LoaderCircle className="animate-spin" aria-hidden="true"/><span className="sr-only">Loading</span></div>}
