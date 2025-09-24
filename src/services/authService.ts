/**
 * ARQUIVO: src/services/authService.ts
 * AÇÃO: CRIAR novo arquivo
 * 
 * Sistema de autenticação baseado em token
 * Extrai token da URL, valida com API N8N e gerencia estado de autenticação
 */

interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    nome: string;
    nome_preferencia: string;
    status_onboarding: string;
  };
  error?: string;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private isAuthenticated: boolean = false;
  private userData: any = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Extrai token da URL atual
   */
  public extractTokenFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      this.token = token;
      // Limpa a URL após extrair o token
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
    
    return token;
  }

  /**
   * Obtém token do localStorage ou URL
   */
  public getToken(): string | null {
    if (this.token) {
      return this.token;
    }
    
    // Verifica localStorage
    const storedToken = localStorage.getItem('mindquest_token');
    if (storedToken) {
      this.token = storedToken;
      return storedToken;
    }

    // Tenta extrair da URL
    return this.extractTokenFromUrl();
  }

  /**
   * Salva token no localStorage
   */
  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem('mindquest_token', token);
  }

  /**
   * Remove token e limpa autenticação
   */
  public logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.userData = null;
    localStorage.removeItem('mindquest_token');
    
    // Redireciona para página de erro/login
    window.location.href = '/auth-error';
  }

  /**
   * Valida token com a API N8N
   */
  public async validateToken(token?: string): Promise<AuthResponse> {
    const tokenToValidate = token || this.getToken();
    
    if (!tokenToValidate) {
      return {
        success: false,
        error: 'Token não encontrado'
      };
    }

    try {
      const API_URL = 'https://metodovoar-n8n.cloudfy.live/webhook-test/auth/validate';
      
      const response = await fetch(`${API_URL}?token=${tokenToValidate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.response && data.response.success) {
        // Token válido
        this.setToken(tokenToValidate);
        this.isAuthenticated = true;
        this.userData = data.response;
        
        return {
          success: true,
          user: {
            id: data.response.user.id,
            nome: data.response.user.nome,
            nome_preferencia: data.response.user.nome_preferencia,
            status_onboarding: data.response.user.status_onboarding
          }
        };
      } else {
        // Token inválido
        return {
          success: false,
          error: data.response?.error || 'Token inválido ou expirado'
        };
      }

    } catch (error) {
      console.error('Erro ao validar token:', error);
      return {
        success: false,
        error: 'Erro de conexão com o servidor'
      };
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  public isUserAuthenticated(): boolean {
    return this.isAuthenticated && !!this.token;
  }

  /**
   * Obtém dados do usuário autenticado
   */
  public getUserData(): any {
    return this.userData;
  }

  /**
   * Redireciona para a URL de autenticação se não autenticado
   */
  public async requireAuth(): Promise<boolean> {
    const token = this.getToken();
    
    if (!token) {
      this.redirectToAuthError('Token não encontrado');
      return false;
    }

    if (!this.isAuthenticated) {
      const validation = await this.validateToken(token);
      
      if (!validation.success) {
        this.redirectToAuthError(validation.error || 'Falha na autenticação');
        return false;
      }
    }

    return true;
  }

  /**
   * Redireciona para página de erro de autenticação
   */
  private redirectToAuthError(message: string): void {
    console.error('Erro de autenticação:', message);
    // Por enquanto, apenas alerta. Depois implementar página de erro
    alert(`Erro de autenticação: ${message}`);
  }
}

// Exporta a instância singleton
export const authService = AuthService.getInstance();
export default authService;