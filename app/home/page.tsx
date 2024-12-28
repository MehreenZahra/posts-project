import Navbar from "@/components/features/navbar";
import { GalleryVerticalEnd } from "lucide-react"; // This import seems unused, consider removing it
export default function Home() {
 return (
   <div className="flex min-h-svh flex-col">
     <Navbar /> {/* Add the Navbar here */}
     <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
       <div className="flex w-full max-w-sm flex-col gap-6">
         <h1>Home</h1>
       </div>
     </div>
   </div>
 );
}
