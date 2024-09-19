import { useState, useEffect } from 'react';
import axios from 'axios';

interface Category {
  id: number;
  category_name: string;
  is_deleted: boolean;
}

export const useCategories = (apiUrl: string) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [apiUrl]);

  // add new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const response = await axios.post(`${apiUrl}/categories`, {
        category_name: newCategoryName,
      });
      const createdCategory = response.data;
      setCategories([...categories, createdCategory]);
      setNewCategoryName('');
      setIsAddingCategory(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  // toggle is_deleted status of a category
  const toggleCategoryDeletedStatus = async (categoryId: number, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await axios.put(`${apiUrl}/categories/${categoryId}`, {
        is_deleted: newStatus,
      });
      setCategories(categories.map((category) =>
        category.id === categoryId ? { ...category, is_deleted: newStatus } : category
      ));
    } catch (error) {
      console.error('Error toggling category status:', error);
    }
  };

  return {
    categories,
    isAddingCategory,
    newCategoryName,
    setNewCategoryName,
    setIsAddingCategory,
    handleAddCategory,
    toggleCategoryDeletedStatus,
  };
};
