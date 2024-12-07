import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser]);

  const fetchComments = async (startIndex = 0) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/comment/getcomments?startIndex=${startIndex}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        setShowMore(data.comments.length === 9); // Assume 9 is the limit for pagination
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching comments:", error.message);
    }
  };

  const handleShowMore = () => {
    fetchComments(comments.length);
  };

  const handleDeleteComment = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
      } else {
        const data = await res.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
  {currentUser.isAdmin && comments.length > 0 ? (
    <>
      <Table hoverable className="shadow-md">
        <Table.Head>
          <Table.HeadCell>تاريخ التحديث</Table.HeadCell>
          <Table.HeadCell>محتوى التعليق</Table.HeadCell>
          <Table.HeadCell>عدد الإعجابات</Table.HeadCell>
          <Table.HeadCell>معرف المنتج</Table.HeadCell>
          <Table.HeadCell>معرف المستخدم</Table.HeadCell>
          <Table.HeadCell>حذف</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {comments.map((comment) => (
            <Table.Row
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              key={comment._id}
            >
              <Table.Cell>
                {new Date(comment.updatedAt).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>{comment.content}</Table.Cell>
              <Table.Cell>{comment.numberOfLikes}</Table.Cell>
              <Table.Cell>{comment.productId}</Table.Cell>
              <Table.Cell>{comment.userId}</Table.Cell>
              <Table.Cell>
                <span
                  onClick={() => {
                    setCommentIdToDelete(comment._id);
                    setShowModal(true);
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
    <p>ليس لديك تعليقات بعد!</p>
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
          هل أنت متأكد أنك تريد حذف هذا التعليق؟
        </h3>
        <div className="flex justify-center gap-4">
          <Button color="failure" onClick={handleDeleteComment}>
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
