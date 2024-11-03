import React, { useState } from 'react';
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../../utils/axiosinstance';

const AddEditNotes = ({ getAllNotes, noteData, type, onclose,showToastMsg }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  // Add Note
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        showToastMsg("Note added successfully", "add");  // Pass type as "add"
        getAllNotes();
        onclose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  // Edit Note
  const editNote = async () => {
    try {
      const response = await axiosInstance.put(`/edit-note/${noteData._id}`, {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        showToastMsg("Note updated successfully", "edit");  // Pass type as "edit"
        getAllNotes();
        onclose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddEditNote = () => {
    if (!title) {
      setError("Please enter a title");
      return;
    }
    if (!content) {
      setError("Please enter the content");
      return;
    }
    setError("");
    
    if (type === 'edit') {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className='relative p-4'>
      <button
        className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-200'
        onClick={onclose}
      >
        <MdClose className='text-xl text-slate-400' />
      </button>
      <div className='flex flex-col gap-2'>
        <label className='input-label'>TITLE</label>
        <input
          type='text'
          className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
          placeholder='Go to Gym At 5'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className='flex flex-col gap-2 mt-4'>
        <label className='input-label'>CONTENT</label>
        <textarea
          className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
          placeholder='content'
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className='mt-3'>
        <label className='input-label'>TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}
      <button
        className='btn-primary font-medium mt-5 p-3 flex items-center justify-center'
        onClick={handleAddEditNote}
      >
        {type === 'edit' ? 'UPDATE' : 'ADD'}
      </button>
    </div>
  );
};

export default AddEditNotes;
