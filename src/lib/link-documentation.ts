export interface LinkDocumentationField {
  name: string;
  type: string;
  required: boolean;
  description: string;
  constraints?: string;
}

export interface LinkDocumentationOperation {
  id: string;
  title: string;
  service: string;
  runtimeVersion: string;
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  visibility: 'private';
  state: 'deployed' | 'deployed-but-disabled-by-default';
  auth: string;
  description: string;
  responseContract: string;
  boundary: string;
  request: LinkDocumentationField[];
  query: LinkDocumentationField[];
  response: LinkDocumentationField[];
  errors: string[];
  requestExample?: Record<string, unknown>;
  responseExample?: Record<string, unknown>;
}

export interface LinkDocumentationRuntime {
  id: string;
  name: string;
  version: string;
  status: 'deployed';
  description: string;
  boundary: string;
}

export interface LinkDocumentationGroup {
  id: string;
  name: string;
  version: string;
  operations: LinkDocumentationOperation[];
}

export interface LinkDocumentationSemantic {
  term: string;
  meaning: string;
}

export interface LinkDocumentation {
  version: string;
  scope: 'authenticated-dashboard-only';
  title: string;
  updatedAt: string;
  security: {
    public: false;
    transport: string;
    credentialPolicy: string;
    execution: {
      readOnly: boolean;
      canAuthorizeOrder: boolean;
      canCreateOrder: boolean;
    };
  };
  semantics: LinkDocumentationSemantic[];
  runtimes: LinkDocumentationRuntime[];
  groups: LinkDocumentationGroup[];
}
