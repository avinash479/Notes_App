import React, { useEffect, useState } from 'react';
import Navbar from "../../components/Navbar/Navbar";
import Notecard from '../../components/Cards/Notecard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from "./AddEditNotes";
import Modal from 'react-modal';
import axiosInstance from '../../../utils/axiosinstance';
import { useNavigate } from 'react-router-dom';
import Toast from '../../../ToastMessage/Toast';
import EmptyCard from '../../EmptyCard/EmptyCard';

Modal.setAppElement('#root');

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  });

  const [isSearch, setIsSearch] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [showToastMsg, setShowToastMessage] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An Unexpected Error Occurred. Please Refresh the page.");
    }
  };

  const deleteNote = async (noteData) => {
    try {
      const response = await axiosInstance.delete("delete-note/" + noteData._id);
      if (response.data && !response.data.error) {
        showToast("Note deleted successfully", "delete");
        getAllNotes();
        setOpenAddEditModal({ isShown: false, type: "add", data: null });
      }
    } catch (error) {
      console.log("An Unexpected Error Occurred. Please Refresh the page.");
    }
  };

  const showToast = (message, type) => {
    setShowToastMessage({
      isShown: true,
      message: message,
      type: type,
    });

    setTimeout(() => {
      setShowToastMessage({
        isShown: false,
        message: "",
        type: "",
      });
    }, 3000);
  };

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const onSearch = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateIsPinned = async (noteData) => {
    try {
      const response = await axiosInstance.put(`/update-note-pinned/${noteData._id}`, {
        isPinned: !noteData.isPinned
      });
      if (response.data && response.data.note) {
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getUserInfo();
    getAllNotes();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearch}
        handleClearSearch={handleClearSearch}
      />

      <div className='container mx-auto'>
        {allNotes.length > 0 ? (
          <div className='grid grid-cols-3 gap-4 mt-8'>
            {allNotes.map((item) => (
              <Notecard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                OnDelete={() => deleteNote(item)}
                onPinNote={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard imgSrc={isSearch ? '/Images/nosearchfound.svg' : '/Images/Emptyimg.svg'} message={isSearch ? 'Oops! No notes found matching your search' : 'Start creating your first note!'} />
        )}
      </div>

      <button className='w-14 h-14 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-5' onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}>
        <MdAdd className='text-[30px] text-white' />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.2)" },
        }}
        contentLabel=""
        className="w-[40%] m-h-3/4 bg-white rounded-md mx-auto mt-14 p-5"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onclose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
          showToastMsg={showToast}
          getAllNotes={getAllNotes}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={() => setShowToastMessage({ isShown: false, message: "", type: "" })}
      />
    </>
  );
};

export default Home;
