import instance from "@/lib/axios";

class CategoryService {
  async getAllCategories() {
    const response = await instance.get('/public/categories');
    return response.data;
  }

  async getCategoryById(categoryId: string) {
    const response = await instance.get(`/public/categories/${categoryId}`);
    return response.data;
  }
}

export const categoryService = new CategoryService();