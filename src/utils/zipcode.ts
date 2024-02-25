import gpZip from "@src/data/gp-zipcodes.json";

const isZipCodeDeliverable = (zipCode: string | undefined): boolean => {
  const zipCodes: string[] = gpZip.map((item) => item.zip.toString());
  if (zipCode !== undefined) {
    return zipCodes.includes(zipCode);
  }
  return false;
};

export { isZipCodeDeliverable };
