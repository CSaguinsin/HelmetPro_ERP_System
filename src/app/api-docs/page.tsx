"use client";

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

// Define a more specific type for the Swagger specification
type SwaggerSpec = {
  openapi?: string;
  swagger?: string;
  info?: {
    title?: string;
    version?: string;
    description?: string;
  };
  paths?: Record<string, unknown>;
  components?: Record<string, unknown>;
  [key: string]: unknown;
};

export default function ApiDocs() {
  const [spec, setSpec] = useState<SwaggerSpec | null>(null);

  useEffect(() => {
    async function fetchSpecs() {
      const response = await fetch("/api/docs");
      const data = await response.json();
      setSpec(data);
    }
    
    fetchSpecs();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">HelmetPro Hardware API Documentation</h1>
      {spec ? (
        <SwaggerUI spec={spec} />
      ) : (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
          <p className="ml-4 text-lg">Loading API documentation...</p>
        </div>
      )}
    </div>
  );
} 