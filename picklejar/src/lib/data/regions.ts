// REGIONS DISABLED: Only India is supported. All region functions return India.

export const listRegions = async () => {
  return [
    {
      id: "IN",
      name: "India",
      countries: [{ iso_2: "in", name: "India" }],
    },
  ];
};

export const retrieveRegion = async (id: string) => {
  if (id === "IN" || id === "in") {
    return {
      id: "IN",
      name: "India",
      countries: [{ iso_2: "in", name: "India" }],
    };
  }
  return null;
};

export const getRegion = async (countryCode: string) => {
  if (countryCode.toLowerCase() === "in") {
    return {
      id: "IN",
      name: "India",
      countries: [{ iso_2: "in", name: "India" }],
    };
  }
  return null;
};
