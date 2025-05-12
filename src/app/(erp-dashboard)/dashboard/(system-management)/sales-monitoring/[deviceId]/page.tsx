// This is a Server Component
import { Suspense } from "react";
import { DeviceTransactionsClient } from "./device-transactions-client";
import Sidebar from "@/app/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

// Interface for params from dynamic route
interface PageProps {
  params: Promise<{
    deviceId: string;
  }>;
}

// Main server component that handles params safely 
export default async function DeviceTransactionsPage({ params }: PageProps) {
  // Await params to satisfy Next.js requirement for dynamic route parameters
  const { deviceId } = await params;
  
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar for larger screens */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-0">
          {/* Mobile sidebar toggle - only shown on small screens */}
          <div className="lg:hidden flex justify-end p-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>
          
          <Suspense fallback={<LoadingSpinner />}>
            <DeviceTransactionsClient deviceId={deviceId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// Simple loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
} 