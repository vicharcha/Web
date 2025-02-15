import axios from 'axios';

interface DigiLockerConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  baseUrl: string;
}

export interface DigiLockerDocument {
  type: string;
  issuer: string;
  id: string;
  name: string;
  date: string;
  verificationStatus: 'verified' | 'pending' | 'failed';
}

const config: DigiLockerConfig = {
  clientId: process.env.DIGILOCKER_CLIENT_ID || '',
  clientSecret: process.env.DIGILOCKER_CLIENT_SECRET || '',
  redirectUri: process.env.DIGILOCKER_REDIRECT_URI || '',
  baseUrl: process.env.DIGILOCKER_BASE_URL || 'https://api.digitallocker.gov.in'
};

// Mock documents for development
const mockDocuments: DigiLockerDocument[] = [
  {
    type: "ADHAR",
    issuer: "UIDAI",
    id: "XXXX-XXXX-XXXX",
    name: "Aadhaar Card",
    date: new Date().toISOString(),
    verificationStatus: 'verified'
  },
  {
    type: "PAN",
    issuer: "Income Tax Department",
    id: "XXXXXX0000X",
    name: "PAN Card",
    date: new Date().toISOString(),
    verificationStatus: 'verified'
  },
  {
    type: "DL",
    issuer: "Ministry of Road Transport",
    id: "DL-XXXXXXX",
    name: "Driving License",
    date: new Date().toISOString(),
    verificationStatus: 'pending'
  }
];

export class DigiLockerService {
  private static instance: DigiLockerService;
  private accessToken: string | null = null;

  private constructor() {}

  static getInstance(): DigiLockerService {
    if (!DigiLockerService.instance) {
      DigiLockerService.instance = new DigiLockerService();
    }
    return DigiLockerService.instance;
  }

  async getAuthorizationUrl(): Promise<string> {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      return `${config.redirectUri}?code=mock_auth_code`;
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      state: Math.random().toString(36).substring(7)
    });

    return `${config.baseUrl}/oauth2/authorize?${params.toString()}`;
  }

  async getDocuments(userId: string): Promise<DigiLockerDocument[]> {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      console.log('Development mode: Returning mock documents');
      return mockDocuments;
    }

    try {
      const response = await axios.get(`${config.baseUrl}/v3/files/issued`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching DigiLocker documents:', error);
      throw error;
    }
  }

  async verifyDocument(documentId: string): Promise<boolean> {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      console.log(`Development mode: Mock verifying document ${documentId}`);
      return true;
    }

    try {
      const response = await axios.post(`${config.baseUrl}/v3/verify`, {
        document_id: documentId
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      return response.status === 200;
    } catch (error) {
      console.error('Error verifying document:', error);
      return false;
    }
  }

  // Mock method for development testing
  async mockVerifyUser(userId: string): Promise<{
    verified: boolean;
    documents: DigiLockerDocument[];
  }> {
    return {
      verified: true,
      documents: mockDocuments
    };
  }
}

export const digilocker = DigiLockerService.getInstance();
