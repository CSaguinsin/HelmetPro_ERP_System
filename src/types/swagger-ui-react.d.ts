declare module 'swagger-ui-react' {
  import { ComponentType } from 'react';

  export interface SwaggerUIProps {
    spec?: Record<string, unknown>;
    url?: string;
    docExpansion?: 'list' | 'full' | 'none';
    defaultModelsExpandDepth?: number;
    defaultModelExpandDepth?: number;
    supportedSubmitMethods?: Array<string>;
    [key: string]: unknown;
  }

  const SwaggerUI: ComponentType<SwaggerUIProps>;
  export default SwaggerUI;
}

declare module 'swagger-ui-react/swagger-ui.css'; 