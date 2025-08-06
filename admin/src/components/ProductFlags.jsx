import React from "react";

const ProductFlags = ({ form, setForm }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="prescriptionRequired"
            name="prescriptionRequired"
            checked={form.prescriptionRequired}
            onChange={(e) =>
              setForm((f) => ({ ...f, prescriptionRequired: e.target.checked }))
            }
            className="w-5 h-5"
          />
          <label
            htmlFor="prescriptionRequired"
            className="select-none font-medium"
          >
            Prescription Required
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="seasonalMedicine"
            name="seasonalMedicine"
            checked={form.seasonalMedicine}
            onChange={(e) =>
              setForm((f) => ({ ...f, seasonalMedicine: e.target.checked }))
            }
            className="w-5 h-5"
          />
          <label htmlFor="seasonalMedicine" className="select-none font-medium">
            Seasonal Medicine
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="frequentlyBought"
            name="frequentlyBought"
            checked={form.frequentlyBought}
            onChange={(e) =>
              setForm((f) => ({ ...f, frequentlyBought: e.target.checked }))
            }
            className="w-5 h-5"
          />
          <label htmlFor="frequentlyBought" className="select-none font-medium">
            Frequently Bought
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="topProducts"
            name="topProducts"
            checked={form.topProducts}
            onChange={(e) =>
              setForm((f) => ({ ...f, topProducts: e.target.checked }))
            }
            className="w-5 h-5"
          />
          <label htmlFor="topProducts" className="select-none font-medium">
            Top Products
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="peoplePreferred"
            name="peoplePreferred"
            checked={form.peoplePreferred}
            onChange={(e) =>
              setForm((f) => ({ ...f, peoplePreferred: e.target.checked }))
            }
            className="w-5 h-5"
          />
          <label htmlFor="peoplePreferred" className="select-none font-medium">
            People Preferred Medicine
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="maximumDiscount"
            name="maximumDiscount"
            checked={form.maximumDiscount}
            onChange={(e) =>
              setForm((f) => ({ ...f, maximumDiscount: e.target.checked }))
            }
            className="w-5 h-5"
          />
          <label htmlFor="maximumDiscount" className="select-none font-medium">
            Maximum Discount
          </label>
        </div>
      </div>
    </>
  );
};

export default ProductFlags;
