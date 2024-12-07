import { Alert, Button, Modal, ModalBody, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../../redux/user/userSlice";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({
    success: "",
    error: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  // Upload image when selected
  useEffect(() => {
    if (imageFile) uploadImage();
  }, [imageFile]);

  const uploadImage = () => {
    setIsUploading(true);
    setUploadError(null);

    const storage = getStorage(app);
    const storageRef = ref(storage, `${Date.now()}_${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      () => {
        setUploadError("Failed to upload image. Ensure it is less than 2MB.");
        resetImageUploadState();
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prev) => ({ ...prev, profilePicture: downloadURL }));
        resetImageUploadState();
      }
    );
  };

  const resetImageUploadState = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  // Update form data
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Submit profile updates
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Object.keys(formData).length) {
      return setUpdateMessage({ success: "", error: "No changes to save." });
    }

    if (isUploading) {
      return setUpdateMessage({
        success: "",
        error: "Please wait for image upload to complete.",
      });
    }

    try {
      dispatch(updateStart());

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update/${
          currentUser._id
        }`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        dispatch(updateFailure(result.message));
        setUpdateMessage({ success: "", error: result.message });
      } else {
        dispatch(updateSuccess(result));
        setUpdateMessage({
          success: "Profile updated successfully.",
          error: "",
        });
      }
    } catch (err) {
      dispatch(updateFailure(err.message));
      setUpdateMessage({ success: "", error: err.message });
    }
  };

  // Delete user account
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/delete/${
          currentUser._id
        }`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const result = await response.json();
        dispatch(deleteUserFailure(result.message));
      } else {
        dispatch(deleteUserSuccess());
      }
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  // Sign out user
  const handleSignout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/signout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) dispatch(signoutSuccess());
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full" dir="rtl">
      <h1 className="my-7 text-center font-semibold text-3xl">الملف الشخصي</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {isUploading && (
            <CircularProgressbar
              value={uploadProgress}
              text={`${uploadProgress}%`}
              strokeWidth={5}
            />
          )}
          <img
            src={imagePreviewUrl || currentUser.profilePicture}
            alt="الملف الشخصي"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              isUploading && uploadProgress < 100 ? "opacity-60" : ""
            }`}
          />
        </div>
        {uploadError && <Alert color="failure">{uploadError}</Alert>}
        <TextInput
          id="username"
          placeholder="الاسم"
          defaultValue={currentUser.name}
          onChange={handleChange}
        />
        <TextInput
          id="email"
          placeholder="البريد الإلكتروني"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          id="password"
          placeholder="كلمة المرور"
          type="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || isUploading}
        >
          {loading ? "جارٍ التحديث..." : "تحديث"}
        </Button>
        {currentUser.isAdmin && (
          <div className="flex flex-col gap-2">
            <Link to="/create-product">
              <Button
                type="button"
                gradientDuoTone="purpleToPink"
                className="w-full"
              >
                إنشاء منتج
              </Button>
            </Link>
            <Link to="/dashboard?tab=categories">
              <Button
                type="button"
                gradientDuoTone="purpleToPink"
                className="w-full"
              >
                إدارة التصنيفات
              </Button>
            </Link>
          </div>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          حذف الحساب
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>
          تسجيل الخروج
        </span>
      </div>
      {updateMessage.success && (
        <Alert color="success">{updateMessage.success}</Alert>
      )}
      {updateMessage.error && (
        <Alert color="failure">{updateMessage.error}</Alert>
      )}
      {error && <Alert color="failure">{error}</Alert>}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">
              هل أنت متأكد أنك تريد حذف حسابك؟
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                نعم، احذف
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                إلغاء
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
