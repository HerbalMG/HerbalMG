import React, { useRef } from 'react';

const TagInput = ({ tags = [], onChange, placeholder = 'Add a tag', tagLimit = 10 }) => {
  const tagInputRef = useRef();

  const handleAddTag = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = tagInputRef.current.value.trim();
      if (newTag && !tags.includes(newTag) && tags.length < tagLimit) {
        onChange([...tags, newTag]);
        tagInputRef.current.value = '';
      }
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    onChange(updatedTags);
  };

  return (
    <div className="mb-4">
      <label className="block font-medium mb-2"> Key Tags </label>
      <input
        className="w-full border rounded p-2"
        placeholder={`${placeholder} and press Enter`}
        onKeyDown={handleAddTag}
        ref={tagInputRef}
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm flex items-center capitalize"
          >
            {tag}
            <button
              type="button"
              className="ml-1 text-red-500"
              onClick={() => handleRemoveTag(idx)}
            >
              X
            </button>
          </span>
        ))}
      </div>
      <div className="text-right text-sm text-gray-500">
        {tagLimit - tags.length} tags left
      </div>
    </div>
  );
};

export default TagInput;
