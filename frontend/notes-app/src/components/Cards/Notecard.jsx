import React from 'react'
import { MdCreate, MdDelete, MdOutlinePushPin } from 'react-icons/md';
import moment from 'moment';

const Notecard = ({ title, date, content, tags, isPinned, onEdit, OnDelete, onPinNote }) => {
  return (
    <div className="border rounded-lg p-6 ml-3 mr-3 bg-white shadow-md hover:shadow-xl transition-shadow duration-200 ease-in-out transform hover:-translate-y-1">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h6 className="text-lg font-semibold text-gray-800">{title}</h6>
        <span className="text-sm text-gray-500">{moment(date).format('Do MMM YYYY')}</span>
      </div>
      <MdOutlinePushPin
        aria-label={isPinned ? "Unpin note" : "Pin note"}
        className={`w-6 h-6 cursor-pointer ${isPinned ? 'text-primary' : 'text-gray-400'} hover:text-primary`}
        onClick={onPinNote}
      />
    </div>
    <p className="text-sm text-gray-700 mb-4">
      {content?.slice(0, 60)}
      {content?.length > 60 && <span className="text-gray-400">...</span>}
    </p>
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap space-x-2 text-xs text-gray-600">
        {tags?.map((item, index) => (
          <span key={index} className="bg-gray-200 px-2 py-1 rounded-full hover:bg-primary hover:text-white transition-colors duration-150">{`#${item}`}</span>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <MdCreate
          aria-label="Edit note"
          className="w-5 h-5 text-gray-400 hover:text-green-600 cursor-pointer transform hover:scale-105 transition-transform duration-200"
          onClick={onEdit}
        />
        <MdDelete
          aria-label="Delete note"
          className="w-5 h-5 text-gray-400 hover:text-red-600 cursor-pointer transform hover:scale-105 transition-transform duration-200"
          onClick={OnDelete}
        />
      </div>
    </div>
  </div>
  
  )
}

export default Notecard;
