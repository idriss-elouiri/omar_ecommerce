import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser]);

  const fetchUsers = async (startIndex = 0) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/user/getusers?startIndex=${startIndex}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch users:", error.message);
    }
  };

  const handleShowMore = () => {
    fetchUsers(users.length);
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/delete/${userIdToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        const data = await res.json();
        console.error("Failed to delete user:", data.message);
      }
    } catch (error) {
      console.error("Delete user error:", error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
    {currentUser.isAdmin && users.length > 0 ? (
      <>
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>تاريخ الإنشاء</Table.HeadCell>
            <Table.HeadCell>صورة المستخدم</Table.HeadCell>
            <Table.HeadCell>اسم المستخدم</Table.HeadCell>
            <Table.HeadCell>البريد الإلكتروني</Table.HeadCell>
            <Table.HeadCell>مسؤول</Table.HeadCell>
            <Table.HeadCell>الإجراءات</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {users.map((user) => (
              <Table.Row
                key={user._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                  />
                </Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  {user.isAdmin ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <FaTimes className="text-red-500" />
                  )}
                </Table.Cell>
                <Table.Cell>
                  <span
                    onClick={() => {
                      setShowModal(true);
                      setUserIdToDelete(user._id);
                    }}
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                  >
                    حذف
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        {showMore && (
          <button
            onClick={handleShowMore}
            className="w-full text-teal-500 self-center text-sm py-7"
          >
            عرض المزيد
          </button>
        )}
      </>
    ) : (
      <p>لا يوجد مستخدمون!</p>
    )}
    <Modal
      show={showModal}
      onClose={() => setShowModal(false)}
      popup
      size="md"
    >
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
          <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
            هل أنت متأكد أنك تريد حذف هذا المستخدم؟
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteUser}>
              نعم، أنا متأكد
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              لا، إلغاء
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  </div>
  
  );
}
