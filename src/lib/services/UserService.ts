import { BaseService } from "./BaseService";
import { user } from "@/lib/db/schema";
import { eq, like, count } from "drizzle-orm";

/**
 * UserService - User Management
 * Menerapkan: INHERITANCE (extends BaseService)
 */
export class UserService extends BaseService {

  async getAllUsers(search?: string) {
    try {
      if (search) {
        return this.database.query.user.findMany({
          where: like(user.name, `%${search}%`),
        });
      }
      return this.database.query.user.findMany();
    } catch (error) {
      this.handleError(error, "mengambil data pengguna");
    }
  }

  async getUserById(id: string) {
    try {
      return this.database.query.user.findFirst({
        where: eq(user.id, id),
      });
    } catch (error) {
      this.handleError(error, "mengambil detail pengguna");
    }
  }

  async updateUserRole(id: string, role: string) {
    try {
      await this.database
        .update(user)
        .set({ role: role as any, updatedAt: new Date() })
        .where(eq(user.id, id));

      this.log("updateRole", { userId: id, newRole: role });
    } catch (error) {
      this.handleError(error, "mengubah role pengguna");
    }
  }

  async updateUser(id: string, data: Partial<typeof user.$inferInsert>) {
    try {
      await this.database
        .update(user)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(user.id, id));

      this.log("updateUser", { userId: id });
    } catch (error) {
      this.handleError(error, "memperbarui data pengguna");
    }
  }

  async deleteUser(id: string) {
    try {
      await this.database.delete(user).where(eq(user.id, id));
      this.log("deleteUser", { userId: id });
    } catch (error) {
      this.handleError(error, "menghapus pengguna");
    }
  }

  async getTotalUsers() {
    try {
      const [result] = await this.database
        .select({ count: count() })
        .from(user);
      return result.count;
    } catch (error) {
      this.handleError(error, "menghitung total pengguna");
    }
  }

  /**
   * POLYMORPHISM: Implementasi spesifik untuk UserService
   * Menangani data pengguna dari basis data
   */
  handleResponse(data: any) {
    if (!data) return null;
    this.log("processUserData", { count: Array.isArray(data) ? data.length : 1 });
    return data;
  }
}

export const userService = new UserService();
