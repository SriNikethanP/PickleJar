"use client";

import ReactCountryFlag from "react-country-flag";

/**
 * Simplified country select component that only shows India
 */
const CountrySelect = () => {
  return (
    <div>
      <div className="py-1 w-full">
        <div className="txt-compact-small flex items-start gap-x-2">
          <span>Shipping to:</span>
          <span className="txt-compact-small flex items-center gap-x-2">
            <ReactCountryFlag
              svg
              style={{
                width: "16px",
                height: "16px",
              }}
              countryCode="in"
            />
            India
          </span>
        </div>
      </div>
    </div>
  );
};

export default CountrySelect;
