import React, { useEffect, useState } from "react";

const DashCategories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [editedCategory, setEditedCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState("");
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal((prev) => !prev);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/category/getcategories`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch categories");

      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const saveCategory = async (e) => {
    e.preventDefault();

    const categoryData = {
      name: categoryName,
      parent: parentCategory,
      properties: properties.map(({ propertyName, values }) => ({
        propertyName,
        values: values.split(","),
      })),
    };

    try {
      const method = editedCategory ? "PUT" : "POST";
      const url = editedCategory
        ? `${import.meta.env.VITE_BACKEND_URL}/api/category/updatecategory/${
            editedCategory._id
          }`
        : `${import.meta.env.VITE_BACKEND_URL}/api/category/create`;

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Operation failed");

      resetForm();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const editCategory = (category) => {
    setEditedCategory(category);
    setCategoryName(category.name);
    setParentCategory(category.parent?._id || "");
    setProperties(
      category.properties.map(({ propertyName, values }) => ({
        propertyName,
        values: values.join(","),
      }))
    );
  };

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/category/deletecategory/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to delete category");

      setCategories((prev) => prev.filter((category) => category._id !== id));
      closeModal();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const addProperty = () => {
    setProperties((prev) => [...prev, { propertyName: "", values: "" }]);
  };

  const handlePropertyChange = (index, propertyName, newValue) => {
    setProperties((prev) => {
      const updatedProperties = [...prev];
      updatedProperties[index][propertyName] = newValue;
      return updatedProperties;
    });
  };

  const removeProperty = (index) => {
    setProperties((prev) => prev.filter((_, pIndex) => pIndex !== index));
  };

  const resetForm = () => {
    setEditedCategory(null);
    setCategoryName("");
    setParentCategory("");
    setProperties([]);
  };

  return (
    <div className="flex flex-col w-full">
      <header>
        <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-8 items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">جميع الفئات</h1>
              <p className="text-gray-500 mt-2">
                {editedCategory ? (
                  <span>
                    تعديل <strong>{editedCategory.name}</strong>
                  </span>
                ) : (
                  "أنشئ فئة جديدة!"
                )}
              </p>
            </div>

            <form
              onSubmit={saveCategory}
              className="flex flex-col gap-4 w-full"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <select
                  className="block w-full p-2 border rounded-md"
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                >
                  <option value="">لا يوجد أب</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="block w-full p-2 border rounded-md"
                  placeholder="اسم الفئة"
                  required
                />
              </div>

              <button
                type="button"
                className="py-2 px-4 border rounded-md bg-blue-500 text-white"
                onClick={addProperty}
              >
                إضافة خاصية
              </button>

              {properties.map((property, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="اسم الخاصية"
                    value={property.propertyName}
                    onChange={(e) =>
                      handlePropertyChange(
                        index,
                        "propertyName",
                        e.target.value
                      )
                    }
                    className="flex-1 p-2 border rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="القيم (مفصولة بفواصل)"
                    value={property.values}
                    onChange={(e) =>
                      handlePropertyChange(index, "values", e.target.value)
                    }
                    className="flex-1 p-2 border rounded-md"
                  />
                  <button
                    type="button"
                    className="py-1 px-3 bg-red-500 text-white rounded-md"
                    onClick={() => removeProperty(index)}
                  >
                    إزالة
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                {editedCategory && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="py-2 px-4 bg-red-500 text-white rounded-md"
                  >
                    إلغاء
                  </button>
                )}
                <button
                  type="submit"
                  className="py-2 px-4 bg-green-500 text-white rounded-md"
                >
                  {editedCategory ? "تحديث الفئة" : "حفظ الفئة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <p>جاري التحميل...</p>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border px-4 py-2">الاسم</th>
                <th className="border px-4 py-2">الأب</th>
                <th className="border px-4 py-2">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="border px-4 py-2">{category.name}</td>
                  <td className="border px-4 py-2">
                    {category.parent?.name || "لا يوجد"}
                  </td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      onClick={() => editCategory(category)}
                      className="py-1 px-3 bg-blue-500 text-white rounded-md"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => deleteCategory(category._id)}
                      className="py-1 px-3 bg-red-500 text-white rounded-md"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default DashCategories;
