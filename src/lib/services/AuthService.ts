import { BaseService } from "./BaseService";
import { signIn, signUp, signOut } from "@/lib/auth/auth-client";

/**
 * AuthService - Authentication Service
 * Menerapkan: ENCAPSULATION
 * 
 * Class ini membungkus (encapsulate) detail implementasi dari Better Auth
 * dan hanya mengekspos method publik untuk operasi autentikasi.
 */
export class AuthService extends BaseService {
  
  // POLYMORPHISM implementation
  handleResponse(data: any) {
    if (data?.error) {
      this.log("authError", { message: data.error.message });
      return { success: false, message: data.error.message };
    }
    return { success: true, data: data.data };
  }

  /**
   * ENCAPSULATION: Menyembunyikan detail pemanggilan API autentikasi
   */
  async signIn(email: string, pass: string) {
    try {
      this.log("attemptSignIn", { email });
      const result = await signIn.email({ email, password: pass });
      return this.handleResponse(result);
    } catch (error) {
      this.handleError(error, "proses masuk (sign in)");
    }
  }

  async signUp(email: string, pass: string, name: string) {
    try {
      this.log("attemptSignUp", { email, name });
      const result = await signUp.email({ email, password: pass, name });
      return this.handleResponse(result);
    } catch (error) {
      this.handleError(error, "proses pendaftaran (sign up)");
    }
  }

  async signOut() {
    try {
      this.log("attemptSignOut");
      await signOut();
    } catch (error) {
      this.handleError(error, "proses keluar (sign out)");
    }
  }
}

export const authService = new AuthService();
