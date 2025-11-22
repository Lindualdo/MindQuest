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
    cronotipo_detectado: string | null;
  };
  error?: string;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private isAuthenticated: boolean = false;
  private userData: any = null;
  private readonly TOKEN_KEY = 'mindquest_token';
  private readonly TOKEN_EXP_KEY = 'mindquest_token_expiration';
  private readonly TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias
  private remoteBaseUrl = 'https://mindquest-n8n.cloudfy.live/webhook';
  private useProxyPaths = false;

  private constructor() {
    let env: Record<string, unknown> | undefined;
    try {
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        env = import.meta.env as Record<string, unknown>;
      }
    } catch (_) {
      env = undefined;
    }

    const baseFromEnv = typeof env?.VITE_API_BASE_URL === 'string'
      ? (env.VITE_API_BASE_URL as string).trim()
      : undefined;

    if (baseFromEnv) {
      this.remoteBaseUrl = baseFromEnv.replace(/\/$/, '');
    }

    if (typeof env?.VITE_API_USE_PROXY === 'string') {
      this.useProxyPaths = String(env.VITE_API_USE_PROXY).toLowerCase() === 'true';
    } else {
      this.useProxyPaths = Boolean(env?.DEV) && !baseFromEnv;
    }
  }

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
    const search = window.location.search;
    const urlParams = new URLSearchParams(search);
    let token = urlParams.get('token');

    if (!token) {
      const fallbackMatch = search.match(/token(?:=|\?)([^&]+)/i);
      token = fallbackMatch?.[1] ?? null;
    }
    
    if (token) {
      this.token = token;
      // Limpa a URL após extrair o token (remove qualquer variante do parâmetro)
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
    
    return token;
  }

  private getStoredToken(): string | null {
    try {
      const storedToken = localStorage.getItem(this.TOKEN_KEY);
      if (!storedToken) {
        return null;
      }

      const rawExpiration = localStorage.getItem(this.TOKEN_EXP_KEY);
      if (!rawExpiration) {
        this.clearStoredToken();
        return null;
      }

      const expiresAt = Number(rawExpiration);
      if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
        this.clearStoredToken();
        return null;
      }

      return storedToken;
    } catch (error) {
      console.error('Erro ao acessar token no localStorage:', error);
      return null;
    }
  }

  private persistToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      const expiresAt = Date.now() + this.TOKEN_TTL_MS;
      localStorage.setItem(this.TOKEN_EXP_KEY, String(expiresAt));
    } catch (error) {
      console.error('Erro ao armazenar token:', error);
    }
  }

  public clearStoredToken(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.TOKEN_EXP_KEY);
    } catch (error) {
      console.error('Erro ao limpar token armazenado:', error);
    }
    this.token = null;
  }

  /**
   * Obtém token do localStorage ou URL
   */
  public getToken(): string | null {
    if (this.token) {
      return this.token;
    }
    
    // Verifica localStorage
    const storedToken = this.getStoredToken();
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
    this.persistToken(token);
  }

  /**
   * Remove token e limpa autenticação
   */
  public logout(): void {
    this.clearStoredToken();
    this.isAuthenticated = false;
    this.userData = null;
    
    // Redireciona para página de erro/login
    window.location.href = '/auth-error';
  }

  /**
   * Verifica rapidamente se existe um token disponível (URL ou storage)
   */
  public hasTokenAvailable(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    if (this.token) {
      return true;
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('token')) {
      return true;
    }

    return Boolean(this.getStoredToken());
  }

  /**
   * Valida token com a API N8N
   */
  private buildValidateUrl(): string {
    const endpoint = '/auth/validate';

    if (this.useProxyPaths && typeof window !== 'undefined') {
      return `/api${endpoint}`;
    }

    return `${this.remoteBaseUrl}${endpoint}`;
  }

  public async validateToken(token?: string): Promise<AuthResponse> {
    const tokenToValidate = token || this.getToken();
    
    if (!tokenToValidate) {
      return {
        success: false,
        error: 'Token não encontrado'
      };
    }

    try {
      const response = await fetch(this.buildValidateUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: tokenToValidate })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error: ${response.status}${errorText ? ` - ${errorText}` : ''}`);
      }

      const data = await response.json();

      if (data.success) {
        this.setToken(tokenToValidate);
        this.isAuthenticated = true;
        this.userData = data;

        return {
          success: true,
          user: data.user
        };
      }

      return {
        success: false,
        error: data.error || 'Token inválido ou expirado'
      };

    } catch (error) {
      console.error('Erro ao validar token:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão com o servidor'
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
