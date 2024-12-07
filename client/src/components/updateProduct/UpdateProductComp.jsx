import React, { useRef, useEffect, useState } from "react";
import {
  Alert,
  Button,
  FileInput,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase.js";
import { ReactSortable } from "react-sortablejs";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatedProductComp() {
  const [files, setFiles] = useState([]);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    briefDesc: "",
    category: "",
    price: 0,
  });
  const [productProperties, setProductProperties] = useState({});
  const [images, setImages] = useState([]);
  const [publishError, setPublishError] = useState(null);
  const { productId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const quillRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/product/getproducts?productId=${productId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setFormData({
          title: data.products[0].title,
          content: data.products[0].content,
          briefDesc: data.products[0].briefDesc,
          category: data.products[0].category,
          price: data.products[0].price,
        });
        setProductProperties(data.products[0].properties);
        setImages(data.products[0].images);
      } catch (error) {
        console.error(error.message);
        setPublishError(error.message);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/category/getcategories`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  const handleImageSubmit = async (e) => {
    if (files.length > 0 && files.length + images.length <= 6) {
      setUploading(true);
      try {
        const urls = await Promise.all([...files].map(storeImage));
        setImages((prevImages) => [...prevImages, ...urls]);
        setImageUploadError(null);
      } catch (error) {
        setImageUploadError("Image upload failed (2 MB max per image)");
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError("You can only upload 6 images per listing");
    }
  };

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(1));
        },
        (error) => {
          reject(error);
          setImageUploadProgress(null);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
          setImageUploadProgress(null);
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/product/updateproduct/${productId}/${currentUser._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            images,
            properties: productProperties,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      navigate(`/product-details/${data.slug}`);
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;

    const updatedValue = id === "price" ? parseFloat(value) : value;

    setFormData((prevData) => ({ ...prevData, [id]: updatedValue }));
  };

  const propertiesToFill = () => {
    const props = [];
    if (categories.length > 0 && formData.category) {
      let catInfo = categories.find(({ _id }) => _id === formData.category);
      props.push(...catInfo.properties);
      while (catInfo?.parent?._id) {
        const parentCat = categories.find(
          ({ _id }) => _id === catInfo.parent._id
        );
        props.push(...parentCat.properties);
        catInfo = parentCat;
      }
    }
    return props;
  };

  const setProductProp = (propName, value) => {
    setProductProperties((prevProps) => ({ ...prevProps, [propName]: value }));
  };

  return (
    <>
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">إنشاء منتج</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              placeholder="العنوان"
              required
              id="title"
              className="flex-1"
              onChange={handleFormChange}
              value={formData.title}
            />
            <Select
              id="category"
              value={formData.category}
              onChange={handleFormChange}
            >
              <option value="0">لم يتم اختيار فئة</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Select>
            {productProperties &&
              propertiesToFill().map((p) => (
                <div key={p.propertyName} className="flex items-center gap-2">
                  <label>
                    {p.propertyName
                      .replace(/_/g, " ") // استبدال الشرطات السفلية بمسافات
                      .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
                    {/* تحويل أول حرف لكل كلمة إلى حرف كبير */}
                  </label>
                  <Select
                    value={productProperties[p.propertyName] || ""}
                    onChange={(ev) =>
                      setProductProp(p.propertyName, ev.target.value)
                    }
                  >
                    {p.values.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </Select>
                </div>
              ))}
          </div>
          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            <FileInput
              type="file"
              accept="image/*"
              id="images"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              outline
              onClick={handleImageSubmit}
              disabled={uploading}
            >
              {imageUploadProgress ? (
                <div className="w-16 h-16">
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                  />
                </div>
              ) : (
                "رفع الصورة"
              )}
            </Button>
          </div>
          {imageUploadError && (
            <Alert color="failure">{imageUploadError}</Alert>
          )}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-2">
            <ReactSortable
              list={images}
              setList={setImages}
              className="w-[350px] h-auto gap-2 flex justify-between align-items-center"
            >
              {images.map((link, index) => (
                <div key={link} className="relative group">
                  <img
                    src={link}
                    alt="منتج"
                    className="object-cover h-32 w-44 rounded-md border p-2 cursor-pointer transition-transform transform-gpu group-hover:scale-105"
                  />
                  <button
                    className="absolute top-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </ReactSortable>
          </div>
          <Textarea
            id="briefDesc"
            placeholder="وصف مختصر"
            required
            onChange={handleFormChange}
            value={formData.briefDesc}
          />
          <ReactQuill
            ref={quillRef}
            theme="snow"
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, content: value }))
            }
            value={formData.content}
            placeholder="المحتوى"
          />
          <TextInput
            type="number"
            placeholder="price"
            required
            id="price"
            className="flex-1"
            onChange={handleFormChange}
            value={formData.price}
          />
          <div className="flex justify-end mt-3">
            <Button type="submit" gradientDuoTone="purpleToBlue">
              إنشاء المنتج
            </Button>
          </div>
          {publishError && <Alert color="failure">{publishError}</Alert>}
        </form>
      </div>
    </>
  );
}
