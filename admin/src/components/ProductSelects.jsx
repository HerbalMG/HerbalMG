import React from 'react';
import Select from 'react-select';

const ProductSelects = ({ form, setForm, errors, brandsList, mainCategories, subCategories, booksList, diseasesList }) => (
  <>
    {/* Brand & Main Category */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="brand_id" className="block font-medium mb-1">Brand</label>
        <Select
          id="brand_id"
          name="brand_id"
          options={brandsList.map(b => ({ value: b.id, label: b.name }))}
          value={brandsList.find(b => String(b.id) === String(form.brand_id)) ? { value: form.brand_id, label: brandsList.find(b => String(b.id) === String(form.brand_id)).name } : null}
          onChange={option => setForm(f => ({ ...f, brand_id: option ? option.value : "" }))}
          isClearable
          placeholder="Select brand..."
          classNamePrefix="react-select"
        />
        {errors.brand_id && <p className="text-red-600 text-sm mt-1">{errors.brand_id}</p>}
      </div>
      <div>
        <label htmlFor="mainCategoryId" className="block font-medium mb-1">Main Category</label>
        <Select
          id="mainCategoryId"
          name="mainCategoryId"
          options={mainCategories.map(cat => ({ value: cat.id, label: cat.name }))}
          value={mainCategories.find(cat => String(cat.id) === String(form.mainCategoryId)) ? { value: form.mainCategoryId, label: mainCategories.find(cat => String(cat.id) === String(form.mainCategoryId)).name } : null}
          onChange={option => setForm(f => ({ ...f, mainCategoryId: option ? option.value : "" }))}
          isClearable
          placeholder="Select main category..."
          classNamePrefix="react-select"
        />
        {errors.mainCategoryId && <p className="text-red-600 text-sm mt-1">{errors.mainCategoryId}</p>}
      </div>
    </div>
    {/* Sub Category, Reference Book, Disease */}
    <div className="grid grid-cols-3 gap-4 mt-4">
      <div>
        <label htmlFor="subCategoryId" className="block font-medium mb-1">Sub Category</label>
        <Select
          id="subCategoryId"
          name="subCategoryId"
          options={subCategories.map(cat => ({ value: cat.id, label: cat.name }))}
          value={subCategories.find(cat => String(cat.id) === String(form.subCategoryId)) ? { value: form.subCategoryId, label: subCategories.find(cat => String(cat.id) === String(form.subCategoryId)).name } : null}
          onChange={option => setForm(f => ({ ...f, subCategoryId: option ? option.value : "" }))}
          isClearable
          placeholder="Select sub category..."
          classNamePrefix="react-select"
        />
        {errors.subCategoryId && <p className="text-red-600 text-sm mt-1">{errors.subCategoryId}</p>}
      </div>
      <div>
        <label htmlFor="referenceBook" className="block font-medium mb-1">Reference Book</label>
        <Select
          id="referenceBook"
          name="referenceBook"
          options={booksList.map(book => ({ value: book.name, label: book.name }))}
          value={booksList.find(book => book.name === form.referenceBook) ? { value: form.referenceBook, label: form.referenceBook } : null}
          onChange={option => setForm(f => ({ ...f, referenceBook: option ? option.value : "" }))}
          isClearable
          placeholder="Select reference book..."
          classNamePrefix="react-select"
        />
        {errors.referenceBook && <p className="text-red-600 text-sm mt-1">{errors.referenceBook}</p>}
      </div>
      <div>
        <label htmlFor="diseaseId" className="block font-medium mb-1">Disease</label>
        <Select
          id="diseaseId"
          name="diseaseId"
          options={diseasesList.map(d => ({ value: d.id, label: d.name }))}
          value={diseasesList.find(d => String(d.id) === String(form.diseaseId)) ? { value: form.diseaseId, label: diseasesList.find(d => String(d.id) === String(form.diseaseId)).name } : null}
          onChange={option => setForm(f => ({ ...f, diseaseId: option ? option.value : "" }))}
          isClearable
          placeholder="Select disease..."
          classNamePrefix="react-select"
        />
        {errors.diseaseId && <p className="text-red-600 text-sm mt-1">{errors.diseaseId}</p>}
      </div>
    </div>
  </>
);

export default ProductSelects; 