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

  async updateUserRole(id: string, role: "user" | "admin") {
    try {
      await this.database
        .update(user)
        .set({ role, updatedAt: new Date() })
        .where(eq(user.id, id));

      this.log("updateRole", { userId: id, newRole: role });
    } catch (error) {
      this.handleError(error, "mengubah role pengguna");
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
}

export const userService = new UserService();
