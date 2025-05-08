import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'HelmetPro Hardware API',
        version: '1.0.0',
        description: 'API endpoints for HelmetPro hardware devices',
        contact: {
          name: 'HelmetPro Support',
          email: 'support@helmetpro.com',
        },
      },
      servers: [
        {
          url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          description: 'HelmetPro API Server',
        },
      ],
      tags: [
        {
          name: 'Authentication',
          description: 'Endpoints related to device authentication',
        },
        {
          name: 'Device Info',
          description: 'Endpoints providing device information',
        },
        {
          name: 'Assets',
          description: 'Endpoints for retrieving device assets (images, videos, etc.)',
        },
        {
          name: 'Settings',
          description: 'Endpoints for device configuration settings',
        },
        {
          name: 'Transactions',
          description: 'Endpoints for recording and retrieving financial transactions',
        },
        {
          name: 'Status',
          description: 'Endpoints for device status monitoring',
        },
        {
          name: 'Feedback',
          description: 'Endpoints for customer feedback',
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });
  return spec;
}; 