import React, { useState } from 'react';
import TabletForm from './TabletForm';
import SyrupForm from './SyrupForm';
import PowderForm from './PowderForm';

const MedicineForm = () => {
  const [type, setType] = useState('');

  return (
    <div>
      <label className="block font-medium mb-2">Medicine Type</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border rounded p-2 mb-6"
      >
        <option value="">-- Select Type --</option>
        <option value="tablet">Tablet / Capsule</option>
        <option value="syrup">Syrup</option>
        <option value="powder">Powder</option>
      </select>

      {type === 'tablet' && <TabletForm />}
      {type === 'syrup' && <SyrupForm />}
      {type === 'powder' && <PowderForm />}
    </div>
  );
};

export default MedicineForm;
