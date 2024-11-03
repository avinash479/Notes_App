import React, { useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';

const TagInput = ({ tags, setTags }) => {
  const [inputvalue, setinputvalue] = useState("");
  
  const handleInputChange = (e) => {
    setinputvalue(e.target.value);
  };

  const addnewTag = () => {
    if (inputvalue.trim() !== "") {
      setTags([...tags, inputvalue.trim()]);
      setinputvalue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addnewTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      {tags.length > 0 && (
        <div className='flex items-center gap-2 flex-wrap mt-2'>
          {tags.map((tag, index) => (
            <span key={index} className='flex items-center gap-2 text-slate-900 bg-slate-100 px-3 py-1 rounded'>
              #{tag}
              <button onClick={() => handleRemoveTag(tag)}>
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className='flex items-center gap-4 mt-3'>
        <input
          className='text-sm bg-transparent border px-3 py-2 rounded outline-none'
          type='text'
          value={inputvalue}
          placeholder='Add tags'
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className='w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-700'
          onClick={addnewTag}
        >
          <MdAdd className='text-2xl pt-0.5 text-blue-700 hover:text-white' />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
