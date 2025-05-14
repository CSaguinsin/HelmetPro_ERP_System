// Define the OpenAPI specification manually instead of using next-swagger-doc
// This ensures compatibility with Edge runtime

export const getApiDocs = () => {
  const spec = {
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
    paths: {
      '/api/hardware/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login a device or user',
          description: 'Authenticate a hardware device or user and get an access token',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: {
                      type: 'string',
                      description: 'Either username or email is required',
                    },
                    email: {
                      type: 'string',
                      description: 'Either username or email is required',
                    },
                    password: { type: 'string' },
                  },
                  required: ['password'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      access_token: { type: 'string' },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
            },
          },
        },
      },
      '/api/hardware/device-details': {
        get: {
          tags: ['Device Info'],
          summary: 'Get device details',
          description: 'Retrieves detailed information about the authenticated device',
          security: [{ BearerAuth: [] }],
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      device: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          machine_id: { type: 'string' },
                          model: { type: 'string' },
                          last_connection: { type: 'string', format: 'date-time' },
                          status: { type: 'string' },
                          location: { type: 'string' },
                          registered_at: { type: 'string', format: 'date-time' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
            },
          },
        },
        post: {
          tags: ['Device Info'],
          summary: 'Get device details',
          description: 'Alternative POST method to retrieve device information',
          security: [{ BearerAuth: [] }],
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      device: { type: 'object' },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
            },
          },
        },
      },
      '/api/hardware/assets': {
        get: {
          tags: ['Assets'],
          summary: 'Get device assets',
          description: 'Retrieves URLs for images and ads to be displayed on the device',
          security: [{ BearerAuth: [] }],
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      assets: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            type: { type: 'string', enum: ['banner', 'icon', 'video'] },
                            url: { type: 'string' },
                            name: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
            },
          },
        },
        post: {
          tags: ['Assets'],
          summary: 'Get device assets',
          description: 'Alternative POST method to retrieve asset URLs',
          security: [{ BearerAuth: [] }],
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      assets: { type: 'array' },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  };

  return spec;
};
